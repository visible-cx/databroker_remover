import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';
import { DataBroker } from './types';

// AWS clients - only used in Server Actions
export function getDynamoDBClient(): DynamoDBClient {
  return new DynamoDBClient({
    region: process.env.VITE_AWS_REGION || 'eu-west-2',
  });
}

export function getSESClient(): SESClient {
  return new SESClient({
    region: process.env.VITE_AWS_REGION || 'eu-west-2',
  });
}

export function getTableName(): string {
  return process.env.VITE_TABLE_NAME || 'data-broker-remover-users';
}

// Parse broker list from environment variable
export function getBrokerList(): DataBroker[] {
  const companiesEnv = process.env.VITE_COMPANIES || '';
  
  if (!companiesEnv) {
    console.warn('VITE_COMPANIES environment variable not set');
    return [];
  }

  return companiesEnv.split(':').map((company) => {
    const [name, email] = company.split(',');
    return { name: name.trim(), email: email.trim() };
  });
}

// Brokers that only apply to US residents
export const US_ONLY_BROKERS = ['Cowen'];
