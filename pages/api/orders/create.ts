import { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from '../../../src/utils/razorpay';
import { connectToDatabase } from '../../../src/utils/db';

interface OrderData {
  amount: number;
  currency: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'online' | 'cod';
  items: any[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const orderData: OrderData = req.body;
    const { db } = await connectToDatabase();
    
    // Create order in database
    const order = {
      ...orderData,
      status: orderData.paymentMethod === 'cod' ? 'pending' : 'created',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(order);
    const orderId = result.insertedId.toString();

    if (orderData.paymentMethod === 'online') {
      // Create Razorpay order
      const razorpayOrder = await createOrder(orderData.amount, orderData.currency);
      
      // Update order with Razorpay order ID
      await db.collection('orders').updateOne(
        { _id: result.insertedId },
        { $set: { razorpayOrderId: razorpayOrder.id } }
      );

      return res.status(200).json({
        success: true,
        orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: orderData.amount,
        currency: orderData.currency
      });
    }

    // For COD orders
    return res.status(200).json({
      success: true,
      orderId,
      message: 'Order placed successfully. You will receive a confirmation email shortly.'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
