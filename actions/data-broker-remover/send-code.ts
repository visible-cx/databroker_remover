"use server";

import { PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import crypto from "crypto";
import dayjs from "dayjs";
import {
  getDynamoDBClient,
  getSESClient,
  getTableName,
} from "@/lib/data-broker-remover/aws-clients";
import { SendCodeResponse } from "@/lib/data-broker-remover/types";

export async function sendVerificationCode(
  email: string,
): Promise<SendCodeResponse> {
  try {
    // Generate OTP code
    const otpCode = crypto.randomBytes(6).toString("hex");

    // Hash email for storage
    const hash = crypto.createHash("sha256");
    hash.update(email);
    const hashedEmail = hash.digest("hex");

    const dynamoClient = getDynamoDBClient();
    const sesClient = getSESClient();
    const tableName = getTableName();

    // Check if email was already used recently
    const checkParams = {
      TableName: tableName,
      Key: {
        id: { S: hashedEmail },
      },
    };

    const checkCommand = new GetItemCommand(checkParams);
    const existingData = await dynamoClient.send(checkCommand);

    // Check if already sent within 45 days
    if (existingData.Item && existingData.Item.lastSent) {
      const lastSent = parseInt(existingData.Item.lastSent.N || "0");
      const now = dayjs();
      const lastSentDate = dayjs.unix(lastSent);
      const daysSinceLastSent = now.diff(lastSentDate, "day");

      if (daysSinceLastSent < 45) {
        const daysRemaining = 45 - daysSinceLastSent;
        return {
          success: false,
          error: `You've already used this tool within the last 45 days. Please try again in ${daysRemaining} days.`,
        };
      }
    }

    // Store email hash and OTP in DynamoDB
    const putParams = {
      TableName: tableName,
      Item: {
        id: { S: hashedEmail },
        code: { S: otpCode },
      },
    };

    const putCommand = new PutItemCommand(putParams);
    await dynamoClient.send(putCommand);

    // Send verification email via SES
    const templateData = {
      code: otpCode,
    };

    const sesParams = {
      Destination: {
        ToAddresses: [email],
      },
      Source: "noreply@visiblelabs.org",
      Template: "VerificationCode",
      TemplateData: JSON.stringify(templateData),
    };

    const sesCommand = new SendTemplatedEmailCommand(sesParams);
    await sesClient.send(sesCommand);

    return { success: true };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
