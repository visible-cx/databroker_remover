import { json } from 'solid-start/api'
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION
})

export async function POST({ request }) {
  const body = await new Response(request.body).json()

  const { email, code } = body

  const params = {
    TableName: import.meta.env.VITE_TABLE_NAME,
    Key: {
      id: { S: email }
    }
  }

  const command = new GetItemCommand(params)

  try {
    const data = await client.send(command)
    const storedCode = data.Item.code.S
    if (storedCode === code) {

      const params = {
        TableName: import.meta.env.VITE_TABLE_NAME,
        Key: {
          id: { S: email }
        },
        UpdateExpression: 'SET verified = :verified',
        ExpressionAttributeValues: {
          ':verified': { BOOL: true },
        }
      }

      const command = new UpdateItemCommand(params)

      await client.send(command)
      return json({ success: true })
    } else {
      return json({ success: false, error: 'Incorrect code' })
    }
  } catch (err) {
    console.log(err)
    return json({ success: false, error: 'Something went wrong' })
  }
}
