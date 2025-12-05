"use server";

import { GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import {
  getDynamoDBClient,
  getTableName,
} from "@/lib/data-broker-remover/aws-clients";
import { VerifyCodeResponse } from "@/lib/data-broker-remover/types";

export async function verifyCode(
  email: string,
  code: string,
): Promise<VerifyCodeResponse> {
  try {
    // Hash email to match storage
    const hash = crypto.createHash("sha256");
    hash.update(email);
    const hashedEmail = hash.digest("hex");

    const dynamoClient = getDynamoDBClient();
    const tableName = getTableName();

    // Get stored code from DynamoDB
    const getParams = {
      TableName: tableName,
      Key: {
        id: { S: hashedEmail },
      },
    };

    const getCommand = new GetItemCommand(getParams);
    const data = await dynamoClient.send(getCommand);

    if (!data.Item || !data.Item.code) {
      return {
        success: false,
        error: "Verification code not found. Please request a new code.",
      };
    }

    const storedCode = data.Item.code.S;

    // Verify the code matches
    if (storedCode !== code) {
      return {
        success: false,
        error: "Invalid verification code. Please try again.",
      };
    }

    // Mark as verified in DynamoDB
    const updateParams = {
      TableName: tableName,
      Key: {
        id: { S: hashedEmail },
      },
      UpdateExpression: "SET verified = :verified",
      ExpressionAttributeValues: {
        ":verified": { BOOL: true },
      },
    };

    const updateCommand = new UpdateItemCommand(updateParams);
    await dynamoClient.send(updateCommand);

    return { success: true };
  } catch (error) {
    console.error("Error verifying code:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
