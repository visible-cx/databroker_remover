import { json } from 'solid-start/api'
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import Dayjs from 'dayjs'
import { SESClient, SendBulkTemplatedEmailCommand } from '@aws-sdk/client-ses'


const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION
})

const sesClient = new SESClient({
  region: import.meta.env.VITE_AWS_REGION
})


const companies = import.meta.env.VITE_COMPANIES.split(':').map((company) => {
  const [name, email] = company.split(',')
  return { name, email }
})


export async function POST({ request }) {
  const body = await new Response(request.body).json()

  const { email, details } = body
  const params = {
    TableName: import.meta.env.VITE_TABLE_NAME,
    Key: {
      id: { S: email }
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
          id: { S: email }
        },
        UpdateExpression: 'SET lastSent = :lastSent, dateDate = :dateDate',
        ExpressionAttributeValues: {
          ':lastSent': { N: Dayjs().unix().toString() },
          ':dateDate': { N: Dayjs().get('date').toString()}
        }
      }

      const command = new UpdateItemCommand(params)

      await client.send(command)

      const { name, street, city, country, postcode } = details

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
              companyName: "Acme"
            }),
            Source: "requests@visiblelabs.org",
            Template: templateName,
            ReplyToAddresses: [email]
          });
      };

      const bulkSendCommand = createBulkSendCommand(companies, "CompanyEmail");

      try {
        const result = await sesClient.send(bulkSendCommand);
        console.log("result", result);
        return json({ success: true})
      }
      catch (err) {
        console.log(err)
        return json({ success: false, error: 'Something went wrong'})
      }

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
