import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPayment } from '../../../src/utils/razorpay';
import { connectToDatabase } from '../../../src/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { paymentId, orderId, signature, ...orderData } = req.body;
    const { db } = await connectToDatabase();

    // Verify payment signature
    const isSignatureValid = verifyPayment(paymentId, orderId, signature);
    
    if (!isSignatureValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }

    // Update order status in database
    await db.collection('orders').updateOne(
      { _id: orderId },
      { 
        $set: { 
          status: 'paid',
          paymentId,
          paymentSignature: signature,
          updatedAt: new Date()
        } 
      }
    );

    // TODO: Send order confirmation email
    // await sendOrderConfirmationEmail(orderData);

    return res.status(200).json({
      success: true,
      orderId,
      message: 'Payment verified and order confirmed!'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to verify payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
