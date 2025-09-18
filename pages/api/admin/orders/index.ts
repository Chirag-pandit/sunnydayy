import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../src/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert _id to string for serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
    }));

    return res.status(200).json(serializedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
