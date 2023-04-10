import Dayjs from "dayjs";
import { DynamoDBClient, QueryCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
});


export async function GET() {

  const todaysDate = Dayjs().date().toString()
  const params = {
    TableName: import.meta.env.VITE_TABLE_NAME,
    IndexName: 'dateDate-index',
    KeyConditionExpression: 'dateDate = :dateDate',
    ExpressionAttributeValues: {
      ':dateDate': { N: todaysDate }
    }
  }

  const command = new QueryCommand(params)

    try{

      const data = await client.send(command)
      
      const fourtyFiveDaysAgo = Dayjs().subtract(45, 'day').unix()
      data.Items.forEach((item) => {
        if (parseInt(item.lastSent.N) < fourtyFiveDaysAgo) {
          const params = {
            TableName: import.meta.env.VITE_TABLE_NAME,
            Key: {
              id: { S: item.id.S }
            }
          }
          const command = new DeleteItemCommand(params)
          client.send(command)
        }
      })
      
    }
    catch(err){
      return new Response(JSON.stringify({success: false, error: err}));
    }
    return new Response(JSON.stringify({success: true}));
}
    