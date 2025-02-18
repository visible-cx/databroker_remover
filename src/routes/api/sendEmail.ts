import { json } from 'solid-start/api'
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import Dayjs from 'dayjs'
import { SESClient, SendTemplatedEmailCommand, SendBulkTemplatedEmailCommand } from '@aws-sdk/client-ses'
import crypto from 'crypto'

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION
})

const sesClient = new SESClient({
  region: import.meta.env.VITE_AWS_REGION
})

const USFilter = ["Cowen"]

const companies = import.meta.env.VITE_COMPANIES.split(':').map((company) => {
  const [name, email] = company.split(',')
  return { name, email }
})

export async function POST({ request }) {
  const body = await new Response(request.body).json()

  let filteredCompanies = companies

  const { email, details } = body

  if (!email) return json({ success: false })

  const hash = crypto.createHash('sha256')
  hash.update(email)
  const hashedEmail = hash.digest('hex')

  const params = {
    TableName: import.meta.env.VITE_TABLE_NAME,
    Key: {
      id: { S: hashedEmail }
    }
  }

  const command = new GetItemCommand(params)

  try {
    const data = await client.send(command)
    let canProceed = true

    if (data.Item.lastSent) {
      const lastSent = data.Item.lastSent.N || Dayjs().unix()
      const now = Dayjs()
      const lastSentDate = Dayjs(lastSent)
      canProceed = lastSentDate < now.subtract(45, 'day')
    }
    if(!data.Item.verified){
      canProceed = false
    }
    if (canProceed) {
      const params = {
        TableName: import.meta.env.VITE_TABLE_NAME,
        Key: {
          id: { S: hashedEmail }
        },
        UpdateExpression: 'SET lastSent = :lastSent, dateDate = :dateDate',
        ExpressionAttributeValues: {
          ':lastSent': { N: Dayjs().unix().toString() },
          ':dateDate': { N: Dayjs().get('date').toString()}
        }
      }

      const command = new UpdateItemCommand(params)

      await client.send(command)

      const { name, street, city, country, postcode, phone } = details

      if(country !== "US"){
        filteredCompanies = filteredCompanies.filter((company) => !USFilter.includes(company.name))
      }

      const createBulkSendCommand = (companies, templateName) => {
          return new SendBulkTemplatedEmailCommand({
            Destinations: companies.map((company) => ({
              Destination: { ToAddresses: [company.email], CcAddresses: [email] },
              ReplacementTemplateData: JSON.stringify({
                name,
                street,
                city,
                country,
                postcode,
                email,
				phone,
                companyName: company.name
              }),
            })),
            DefaultTemplateData: JSON.stringify({
              name: 'John Doe',
              street: '123 Main St',
              city: 'Anytown',
              country: 'USA',
              postcode: '12345',
              email: 'example@example.com',
			  phone: '123-456-7890',
              companyName: "Acme"
            }),
            Source: "requests@visiblelabs.org",
            Template: templateName,
            ReplyToAddresses: [email]
          });
      };

      const splitCompaniesIntoChunks = (companies, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < companies.length; i += chunkSize) {
          chunks.push(companies.slice(i, i + chunkSize));
        }
        return chunks;
      };

      const chunks = splitCompaniesIntoChunks(filteredCompanies, 50);

      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const bulkSendCommand = createBulkSendCommand(chunk, "CompanyEmail");
        try {
          const result = await sesClient.send(bulkSendCommand);
          console.log("result", result);
        }
        catch (err) {
          console.log(err)
        }
      }


      return json({ success: true})


    } else {
      return json({
        success: false,
        error: 'You have already done this within the last 45 days'
      })
    }
  } catch (err) {
    console.log(err)
    return json({ success: false, error: 'Something went wrong' })
  }
}
