import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Sample categories data
const sampleCategories = [
  {
    name: 'MMA Gloves',
    description: 'Professional MMA gloves for training and competition',
    slug: 'mma-gloves',
    image: '/images/categories/gloves.jpg',
    sortOrder: 1,
    metaTitle: 'MMA Gloves - Professional Training & Competition Gloves',
    metaDescription: 'High-quality MMA gloves for all skill levels. Perfect for training, sparring, and competition.'
  },
  {
    name: 'Fight Shorts',
    description: 'Comfortable and durable fight shorts for MMA and martial arts',
    slug: 'fight-shorts',
    image: '/images/categories/shorts.jpg',
    sortOrder: 2,
    metaTitle: 'MMA Fight Shorts - Premium Quality Martial Arts Shorts',
    metaDescription: 'Professional fight shorts designed for maximum comfort and durability during training and competition.'
  },
  {
    name: 'Training Equipment',
    description: 'Essential training equipment for MMA and martial arts practitioners',
    slug: 'training-equipment',
    image: '/images/categories/training.jpg',
    sortOrder: 3,
    metaTitle: 'MMA Training Equipment - Professional Gear for Martial Arts',
    metaDescription: 'Complete range of training equipment including punching bags, pads, and protective gear.'
  },
  {
    name: 'Protective Gear',
    description: 'Safety equipment for training and sparring',
    slug: 'protective-gear',
    image: '/images/categories/protective.jpg',
    sortOrder: 4,
    metaTitle: 'MMA Protective Gear - Safety Equipment for Martial Arts',
    metaDescription: 'Essential protective gear including head guards, shin guards, mouth guards, and more.'
  },
  {
    name: 'Apparel',
    description: 'MMA and martial arts themed clothing and accessories',
    slug: 'apparel',
    image: '/images/categories/apparel.jpg',
    sortOrder: 5,
    metaTitle: 'MMA Apparel - Martial Arts Clothing & Accessories',
    metaDescription: 'Stylish and comfortable MMA-themed apparel including t-shirts, hoodies, and accessories.'
  }
];

// Sample products data
const sampleProducts = [
  {
    name: 'Premium MMA Gloves',
    description: 'Professional grade MMA gloves made from high-quality leather. Perfect for both training and competition. Features superior padding and wrist support.',
    price: 2999,
    originalPrice: 3499,
    images: ['/images/products/gloves-1.jpg', '/images/products/gloves-2.jpg'],
    category: null, // Will be set after category creation
    stock: 25,
    sku: 'MMA-GLOVES-001',
    brand: 'Elite Fighter',
    tags: ['mma', 'gloves', 'training', 'competition'],
    featured: true,
    specifications: {
      'Material': 'Genuine Leather',
      'Weight': '4oz',
      'Color': 'Black/Red',
      'Wrist Support': 'Yes',
      'Padding': 'Multi-layer Foam'
    }
  },
  {
    name: 'Professional Fight Shorts',
    description: 'High-performance fight shorts with stretch panel for maximum mobility. Moisture-wicking fabric keeps you dry during intense training sessions.',
    price: 1899,
    originalPrice: 2299,
    images: ['/images/products/shorts-1.jpg', '/images/products/shorts-2.jpg'],
    category: null, // Will be set after category creation
    stock: 40,
    sku: 'MMA-SHORTS-001',
    brand: 'Combat Pro',
    tags: ['mma', 'shorts', 'fight', 'training'],
    featured: true,
    specifications: {
      'Material': 'Polyester-Spandex Blend',
      'Length': 'Mid-thigh',
      'Closure': 'Velcro',
      'Stretch Panel': 'Yes',
      'Moisture Wicking': 'Yes'
    }
  },
  {
    name: 'MMA Training Bag',
    description: 'Heavy-duty training bag perfect for MMA and martial arts practice. Filled with premium material for optimal resistance and durability.',
    price: 4999,
    originalPrice: 5999,
    images: ['/images/products/bag-1.jpg', '/images/products/bag-2.jpg'],
    category: null, // Will be set after category creation
    stock: 15,
    sku: 'MMA-BAG-001',
    brand: 'Power Strike',
    tags: ['mma', 'bag', 'training', 'heavy'],
    featured: false,
    specifications: {
      'Weight': '70 lbs',
      'Height': '6 feet',
      'Material': 'Synthetic Leather',
      'Filling': 'Premium Fabric',
      'Chain Included': 'Yes'
    }
  },
  {
    name: 'Mouth Guard Professional',
    description: 'Advanced mouth guard with shock-absorbing technology. Custom fit design provides maximum protection for teeth and jaw during combat sports.',
    price: 599,
    originalPrice: 799,
    images: ['/images/products/mouthguard-1.jpg'],
    category: null, // Will be set after category creation
    stock: 100,
    sku: 'MMA-MOUTH-001',
    brand: 'Safe Guard',
    tags: ['mma', 'mouth guard', 'protection', 'safety'],
    featured: false,
    specifications: {
      'Material': 'Medical Grade Silicone',
      'Fit': 'Custom Moldable',
      'Protection': 'Shock Absorbing',
      'Case Included': 'Yes',
      'Colors': 'Black, Red, Blue'
    }
  },
  {
    name: 'Hand Wraps',
    description: 'Professional hand wraps for wrist and knuckle protection. Made from breathable cotton blend for comfort and durability during training.',
    price: 399,
    originalPrice: 499,
    images: ['/images/products/wraps-1.jpg'],
    category: null, // Will be set after category creation
    stock: 75,
    sku: 'MMA-WRAPS-001',
    brand: 'Wrap Pro',
    tags: ['mma', 'hand wraps', 'protection', 'training'],
    featured: false,
    specifications: {
      'Material': 'Cotton-Elastic Blend',
      'Length': '180 inches',
      'Width': '2 inches',
      'Thumb Loop': 'Yes',
      'Velcro Closure': 'Yes'
    }
  },
  {
    name: 'Shin Guards Pro',
    description: 'Professional shin guards with dual strap system for secure fit. Contoured design provides excellent protection without restricting movement.',
    price: 1299,
    originalPrice: 1599,
    images: ['/images/products/shinguards-1.jpg', '/images/products/shinguards-2.jpg'],
    category: null, // Will be set after category creation
    stock: 30,
    sku: 'MMA-SHIN-001',
    brand: 'Strike Guard',
    tags: ['mma', 'shin guards', 'protection', 'kickboxing'],
    featured: true,
    specifications: {
      'Material': 'Synthetic Leather',
      'Padding': 'Dual Density Foam',
      'Straps': 'Dual Strap System',
      'Size': 'Large',
      'Machine Washable': 'Yes'
    }
  },
  {
    name: 'Head Guard',
    description: 'Full coverage head guard with superior impact absorption. Lightweight design ensures comfort while providing maximum protection during sparring.',
    price: 2199,
    originalPrice: 2699,
    images: ['/images/products/headguard-1.jpg'],
    category: null, // Will be set after category creation
    stock: 20,
    sku: 'MMA-HEAD-001',
    brand: 'Safe Guard',
    tags: ['mma', 'head guard', 'protection', 'sparring'],
    featured: false,
    specifications: {
      'Material': 'Synthetic Leather',
      'Padding': 'Multi-layer Foam',
      'Coverage': 'Full Head',
      'Chin Strap': 'Yes',
      'Ventilation': 'Yes'
    }
  },
  {
    name: 'MMA T-Shirt Premium',
    description: 'Premium quality MMA t-shirt with moisture-wicking technology. Comfortable fit and stylish design perfect for training or casual wear.',
    price: 799,
    originalPrice: 999,
    images: ['/images/products/tshirt-1.jpg', '/images/products/tshirt-2.jpg'],
    category: null, // Will be set after category creation
    stock: 50,
    sku: 'MMA-TSHIRT-001',
    brand: 'Fighter Wear',
    tags: ['mma', 't-shirt', 'apparel', 'casual'],
    featured: false,
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular',
      'Neck': 'Round Neck',
      'Print': 'MMA Graphic',
      'Machine Washable': 'Yes'
    }
  }
];

// Connect to MongoDB and add sample data
async function addSampleData() {
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

    // Clear existing data (optional)
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing categories and products');

    // Add sample categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Successfully added ${categories.length} sample categories:`);
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
    });

    // Map category names to IDs for products
    const categoryMap = {
      'MMA Gloves': categories.find(c => c.name === 'MMA Gloves')._id,
      'Fight Shorts': categories.find(c => c.name === 'Fight Shorts')._id,
      'Training Equipment': categories.find(c => c.name === 'Training Equipment')._id,
      'Protective Gear': categories.find(c => c.name === 'Protective Gear')._id,
      'Apparel': categories.find(c => c.name === 'Apparel')._id
    };

    // Assign category IDs to products
    const productsWithCategories = sampleProducts.map(product => {
      const productCopy = { ...product };
      
      // Assign category based on product type
      if (product.name.includes('Gloves')) {
        productCopy.category = categoryMap['MMA Gloves'];
      } else if (product.name.includes('Shorts')) {
        productCopy.category = categoryMap['Fight Shorts'];
      } else if (product.name.includes('Bag')) {
        productCopy.category = categoryMap['Training Equipment'];
      } else if (product.name.includes('Mouth Guard') || product.name.includes('Shin Guards') || product.name.includes('Head Guard') || product.name.includes('Wraps')) {
        productCopy.category = categoryMap['Protective Gear'];
      } else if (product.name.includes('T-Shirt')) {
        productCopy.category = categoryMap['Apparel'];
      }
      
      return productCopy;
    });

    // Add sample products
    const products = await Product.insertMany(productsWithCategories);
    console.log(`\nSuccessfully added ${products.length} sample products:`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
    });

    console.log('\nSample data added successfully!');
    console.log('You can now view categories and products in the admin panel:');
    console.log('- Categories: /admin/categories');
    console.log('- Products: /admin/products');

  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the script
addSampleData();
