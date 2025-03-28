// app/api/readings/route.js
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET() {
  try {
    const command = new ScanCommand({ TableName: "group-reading" });

    const data = await dynamoDB.send(command);
    return Response.json({ readings: data.Items });
  } catch (error) {
    console.error("DynamoDB error:", error);
    return Response.json({ error: "Failed to fetch readings" }, { status: 500 });
  }
}
