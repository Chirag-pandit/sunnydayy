import 'dotenv/config';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Sample orders data
const sampleOrders = [
  {
    userId: 'sample-user-1',
    items: [
      {
        productId: '67d8a9b5e3b8f9a1b8c9d123',
        name: 'Premium MMA Gloves',
        price: 2999,
        quantity: 1,
        image: '/images/products/gloves-1.jpg'
      },
      {
        productId: '67d8a9b5e3b8f9a1b8c9d124',
        name: 'Professional Fight Shorts',
        price: 1899,
        quantity: 2,
        image: '/images/products/shorts-1.jpg'
      }
    ],
    amount: 6797,
    currency: 'INR',
    status: 'delivered',
    paymentMethod: 'online',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    addressLine1: '123 Fighter Street, Apt 4B',
    addressLine2: 'Near Sports Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  },
  {
    userId: 'sample-user-2',
    items: [
      {
        productId: '67d8a9b5e3b8f9a1b8c9d125',
        name: 'MMA Training Bag',
        price: 4999,
        quantity: 1,
        image: '/images/products/bag-1.jpg'
      }
    ],
    amount: 4999,
    currency: 'INR',
    status: 'shipped',
    paymentMethod: 'cod',
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    addressLine1: '456 Training Avenue',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India'
  },
  {
    userId: 'sample-user-3',
    items: [
      {
        productId: '67d8a9b5e3b8f9a1b8c9d126',
        name: 'Mouth Guard Professional',
        price: 599,
        quantity: 3,
        image: '/images/products/mouthguard-1.jpg'
      },
      {
        productId: '67d8a9b5e3b8f9a1b8c9d127',
        name: 'Hand Wraps',
        price: 399,
        quantity: 2,
        image: '/images/products/wraps-1.jpg'
      }
    ],
    amount: 2595,
    currency: 'INR',
    status: 'paid',
    paymentMethod: 'online',
    fullName: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 76543 21098',
    addressLine1: '789 Combat Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India'
  },
  {
    userId: 'sample-user-4',
    items: [
      {
        productId: '67d8a9b5e3b8f9a1b8c9d128',
        name: 'Shin Guards Pro',
        price: 1299,
        quantity: 1,
        image: '/images/products/shinguards-1.jpg'
      },
      {
        productId: '67d8a9b5e3b8f9a1b8c9d129',
        name: 'Head Guard',
        price: 2199,
        quantity: 1,
        image: '/images/products/headguard-1.jpg'
      }
    ],
    amount: 3498,
    currency: 'INR',
    status: 'pending',
    paymentMethod: 'cod',
    fullName: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91 65432 10987',
    addressLine1: '321 Martial Arts Lane',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    country: 'India'
  },
  {
    userId: 'sample-user-5',
    items: [
      {
        productId: '67d8a9b5e3b8f9a1b8c9d130',
        name: 'MMA T-Shirt Premium',
        price: 799,
        quantity: 5,
        image: '/images/products/tshirt-1.jpg'
      }
    ],
    amount: 3995,
    currency: 'INR',
    status: 'cancelled',
    paymentMethod: 'online',
    fullName: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 54321 09876',
    addressLine1: '656 Fighter Colony',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    country: 'India'
  }
];

// Connect to MongoDB and add sample orders
async function addSampleOrders() {
  try {
    // Connect to MongoDB
    let MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Please set it in your environment before running this script.');
    }
    // ensure URI ends with /sunnydayy if no db name provided (same logic as server)
    if (!/\/[A-Za-z0-9_\-]+(\?|$)/.test(MONGODB_URI)) {
      if (MONGODB_URI.endsWith('/')) MONGODB_URI += 'sunnydayy';
      else MONGODB_URI += '/sunnydayy';
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing orders (optional)
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Add sample orders
    const orders = await Order.insertMany(sampleOrders);
    console.log(`Successfully added ${orders.length} sample orders:`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order._id}, Status: ${order.status}, Amount: ₹${order.amount}`);
    });

    console.log('\nSample orders added successfully!');
    console.log('You can now view these orders in the admin panel at /admin/orders');

  } catch (error) {
    console.error('Error adding sample orders:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the script
addSampleOrders();
