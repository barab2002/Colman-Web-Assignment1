import { MongoClient } from 'mongodb';
import { config } from '../config/env';

let client: MongoClient | null = null;

export async function connectIfNeeded(): Promise<void> {
  if (client) return;
  const uri = config.MONGO_URI;
  client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB at', uri);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

export function getClient(): MongoClient | null {
  return client;
}
