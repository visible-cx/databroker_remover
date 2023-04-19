import { json } from 'solid-start/api'
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import Dayjs from 'dayjs'
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses'

const credentials = {
  accessKeyId: import.meta.env.AWS_SDK_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.AWS_SDK_SECRET_ACCESS_KEY,
};

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION
})

const sesClient = new SESClient({
  region: import.meta.env.VITE_AWS_REGION,
   credentials: credentials,
})

function sendEmail({ email, details, companyEmail, companyName }) {
  const { name, street, city, country, postcode } = details
  const templateData = {
    name,
    street,
    city,
    country,
    postcode,
    email,
    companyName
  }

  const params = {
    Destination: {
      ToAddresses: [companyEmail],
      CcAddresses: [email]
    },
    Template: 'CompanyEmail',
    TemplateData: JSON.stringify(templateData),
    Source: 'requests@visiblelabs.org',
    ReplyToAddresses: [email], 
    ReturnPath: 'bounce@plzdelete.me',
  }


  const command = new SendTemplatedEmailCommand(params)

  sesClient.send(command)
  .then((data) => {console.log("I AM THE DATA NOW", data)})
  .catch((err) => {console.log("I AM THE ERROR NOW", err)})

}

const companies = import.meta.env.VITE_COMPANIES.split(':').map((company) => {
  const [name, email] = company.split(',')
  return { name, email }
})


export async function POST({ request }) {
  const body = await new Response(request.body).json()

  const { email, details } = body
  const { name, street, city, country, postcode } = details

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

      companies.forEach((company) => {
       sendEmail({
          email,
          details: {
            name,
            street,
            city,
            country,
            postcode
          },
          companyEmail: company.email,
          companyName: company.name
        })
      })

      return json({ success: true })
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
