import Razorpay from 'razorpay';
import crypto from 'crypto';

// Define missing Razorpay types
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  attempts: number;
  created_at: number;
  receipt?: string;
  notes?: Record<string, string>;
  entity: 'order';
  amount_paid: number;
  amount_due: number;
  offer_id: string | null;
}

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
  throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined in environment variables');
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_SECRET is not defined in environment variables');
}

// Initialize Razorpay with your API keys
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

interface CreateOrderOptions {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: number;
  notes?: Record<string, string>;
}

interface OrderResponse extends RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid';
  created_at: number;
}

// Create a new order
export const createOrder = async (
  amount: number, 
  currency: string = 'INR',
  notes?: Record<string, string>
): Promise<OrderResponse> => {
  const options: CreateOrderOptions = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise
    currency,
    receipt: `order_rcpt_${Date.now()}`,
    payment_capture: 1, // Auto capture payment
    ...(notes && { notes })
  };

  try {
    const order = await razorpay.orders.create(options);
    return order as OrderResponse;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

// Verify payment signature
export const verifyPayment = (paymentId: string, orderId: string, signature: string): boolean => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.error('RAZORPAY_KEY_SECRET is not defined');
    return false;
  }

  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
};

export default razorpay;
