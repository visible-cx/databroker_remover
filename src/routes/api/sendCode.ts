import { json } from 'solid-start/api'
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand
} from '@aws-sdk/client-dynamodb'
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses'
import crypto from 'crypto'

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION
})

const sesClient = new SESClient({
  region: import.meta.env.VITE_AWS_REGION
})

export async function POST({ request }) {
  const body = await new Response(request.body).json()
  const otpCode = crypto.randomBytes(6).toString('hex')

  const { email } = body
  if (!email) return json({ success: false })

  const hash = crypto.createHash('sha256')
  hash.update(email)
  const hashedEmail = hash.digest('hex')
  console.log(hashedEmail)
  const checkIfEmailExistsParams = {
    TableName: import.meta.env.VITE_TABLE_NAME,
    Key: {
      id: { S: hashedEmail }
    }
  }

  const checkIfEmailExistsCommand = new GetItemCommand(checkIfEmailExistsParams)

  try {
    const data = await client.send(checkIfEmailExistsCommand)
    if (data.Item && data.Item.lastSent) {
      return json({
        success: false,
        error: "You've already done this within the last 45 days"
      })
    }
  } catch (err) {
    console.log(err)
    return json({ success: false, error: 'Something went wrong' })
  }

  const params = {
    TableName: import.meta.env.VITE_TABLE_NAME,
    Item: {
      id: { S: hashedEmail },
      code: { S: otpCode }
    }
  }

  const command = new PutItemCommand(params)

  const templateDate = {
    code: otpCode
  }

  const sesSendTemplateInput = {
    Destination: {
      ToAddresses: [email]
    },
    Source: 'noreply@visiblelabs.org',
    Template: 'VerificationCode',
    TemplateData: JSON.stringify(templateDate)
  }

  const sesSendTemplateCommand = new SendTemplatedEmailCommand(
    sesSendTemplateInput
  )

  try {
    await client.send(command)
    await sesClient.send(sesSendTemplateCommand)
    return json({ success: true })
  } catch (err) {
    console.log(err)
    return json({ success: false, error: 'Something went wrong' })
  }
}
