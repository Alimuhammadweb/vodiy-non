import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
};

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db | null> {
  if (db) {
    return db;
  }

  if (!uri) {
    console.log('[v0] MONGODB_URI not set, using in-memory fallback storage');
    return null;
  }

  try {
    client = new MongoClient(uri, options);
    await client.connect();
    db = client.db('order_management');
    console.log('[v0] Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('[v0] Failed to connect to MongoDB:', error);
    console.log('[v0] Falling back to in-memory storage');
    return null;
  }
}

export async function getDatabaseOrNull(): Promise<Db | null> {
  if (db) {
    return db;
  }
  return connectToDatabase();
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('[v0] Disconnected from MongoDB');
  }
}

export async function getDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const result = await connectToDatabase();
  if (!result) {
    throw new Error('MongoDB connection failed and no fallback available');
  }
  return result;
}
