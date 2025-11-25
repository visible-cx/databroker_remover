'use server';

import {
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { SendBulkTemplatedEmailCommand } from '@aws-sdk/client-ses';
import crypto from 'crypto';
import dayjs from 'dayjs';
import {
  getDynamoDBClient,
  getSESClient,
  getTableName,
  getBrokerList,
  US_ONLY_BROKERS,
} from '@/lib/data-broker-remover/aws-clients';
import { SendEmailsResponse, UserDetails } from '@/lib/data-broker-remover/types';

export async function sendEmails(
  email: string,
  details: UserDetails
): Promise<SendEmailsResponse> {
  try {
    // Hash email to match storage
    const hash = crypto.createHash('sha256');
    hash.update(email);
    const hashedEmail = hash.digest('hex');

    const dynamoClient = getDynamoDBClient();
    const sesClient = getSESClient();
    const tableName = getTableName();

    // Get user record from DynamoDB
    const getParams = {
      TableName: tableName,
      Key: {
        id: { S: hashedEmail },
      },
    };

    const getCommand = new GetItemCommand(getParams);
    const data = await dynamoClient.send(getCommand);

    if (!data.Item) {
      return {
        success: false,
        error: 'Email not found. Please start over.',
      };
    }

    // Check if verified
    if (!data.Item.verified || !data.Item.verified.BOOL) {
      return {
        success: false,
        error: 'Email not verified. Please verify your email first.',
      };
    }

    // Check if already sent within 45 days
    if (data.Item.lastSent) {
      const lastSent = parseInt(data.Item.lastSent.N || '0');
      const now = dayjs();
      const lastSentDate = dayjs.unix(lastSent);
      const daysSinceLastSent = now.diff(lastSentDate, 'day');

      if (daysSinceLastSent < 45) {
        const daysRemaining = 45 - daysSinceLastSent;
        return {
          success: false,
          error: `You have already used this tool within the last 45 days. Please try again in ${daysRemaining} days.`,
        };
      }
    }

    // Get broker list and filter based on country
    let brokers = getBrokerList();
    
    if (details.country !== 'US') {
      brokers = brokers.filter((broker) => !US_ONLY_BROKERS.includes(broker.name));
    }

    if (brokers.length === 0) {
      return {
        success: false,
        error: 'No broker email addresses configured. Please contact support.',
      };
    }

    // Split brokers into chunks of 50 (SES bulk limit)
    const splitIntoChunks = <T,>(array: T[], chunkSize: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const chunks = splitIntoChunks(brokers, 50);

    // Send emails in chunks with delay between each chunk
    for (const chunk of chunks) {
      const bulkCommand = new SendBulkTemplatedEmailCommand({
        Destinations: chunk.map((broker) => ({
          Destination: { 
            ToAddresses: ["ed+test@visible.tech"],//broker.email], 
            CcAddresses: [email] 
          },
          ReplacementTemplateData: JSON.stringify({
            name: details.name,
            street: details.street,
            city: details.city,
            country: details.country,
            postcode: details.postcode,
            email: email,
            companyName: broker.name,
          }),
        })),
        DefaultTemplateData: JSON.stringify({
          name: 'John Doe',
          street: '123 Main St',
          city: 'Anytown',
          country: 'USA',
          postcode: '12345',
          email: 'example@example.com',
          companyName: 'Acme',
        }),
        Source: 'requests@visiblelabs.org',
        Template: 'CompanyEmail',
        ReplyToAddresses: [email],
      });

      await sesClient.send(bulkCommand);

      // Wait 1 second between chunks to avoid rate limits
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Update lastSent timestamp in DynamoDB
    const updateParams = {
      TableName: tableName,
      Key: {
        id: { S: hashedEmail },
      },
      UpdateExpression: 'SET lastSent = :lastSent, dateDate = :dateDate',
      ExpressionAttributeValues: {
        ':lastSent': { N: dayjs().unix().toString() },
        ':dateDate': { N: dayjs().date().toString() },
      },
    };

    const updateCommand = new UpdateItemCommand(updateParams);
    await dynamoClient.send(updateCommand);

    return { success: true };
  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      success: false,
      error: 'Failed to send emails. Please try again or contact support.',
    };
  }
}
