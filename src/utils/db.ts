import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db(process.env.MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Define TypeScript interfaces for our collections
export interface Order {
  _id: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paymentId?: string;
  razorpayOrderId?: string;
  paymentSignature?: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Add indexes for better query performance
async function createIndexes() {
  const { db } = await connectToDatabase();
  
  await db.collection('orders').createIndex({ email: 1 });
  await db.collection('orders').createIndex({ status: 1 });
  await db.collection('orders').createIndex({ createdAt: -1 });
  await db.collection('orders').createIndex({ razorpayOrderId: 1 }, { unique: true, sparse: true });
}

// Create indexes when the module is loaded
if (process.env.NODE_ENV !== 'test') {
  createIndexes().catch(console.error);
}
