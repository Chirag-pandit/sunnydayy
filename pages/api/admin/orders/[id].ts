import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../src/utils/db';
import { ObjectId, WithId, Document } from 'mongodb';

interface Order extends WithId<Document> {
  _id: ObjectId;
  status: string;
  updatedAt?: Date;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate order ID
  if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const orderId = new ObjectId(id);

    if (req.method === 'GET') {
      const order = await ordersCollection.findOne({ _id: orderId });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Convert _id to string for serialization
      const responseOrder = {
        ...order,
        _id: order._id.toString(),
        // Ensure dates are serialized properly
        createdAt: order.createdAt?.toISOString(),
        updatedAt: order.updatedAt?.toISOString()
      };
      
      return res.status(200).json(responseOrder);
    }

    if (req.method === 'PATCH') {
      const { status } = req.body;
      
      // Validate status update
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: 'Status is required' });
      }

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status',
          validStatuses
        });
      }

      const updateData = { 
        status,
        updatedAt: new Date() 
      };

      const result = await ordersCollection.updateOne(
        { _id: orderId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Get the updated order
      const updatedOrder = await ordersCollection.findOne({ _id: orderId });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found after update' });
      }

      return res.status(200).json({ 
        success: true,
        message: 'Order updated successfully',
        order: {
          ...updatedOrder,
          _id: updatedOrder._id.toString(),
          createdAt: updatedOrder.createdAt?.toISOString(),
          updatedAt: updatedOrder.updatedAt?.toISOString()
        }
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in order API:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

