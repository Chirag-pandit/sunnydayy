// products.ts
import { Product } from '../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let id = 1;
  return () => id++;
})();

// T-shirts data
const tshirts: Product[] = Array.from({ length: 40 }, (_, i) => ({
  id: generateId(),
  name: [
    'Falling Down T-Shirt',
    'Ultra Instinct T-Shirt',
    'Insomnia T-Shirt',
    'Striker T-Shirt',
    'Knockout T-Shirt',
    'Ground Game T-Shirt',
    'Championship T-Shirt',
    'Fighter\'s Pride T-Shirt',
    'Octagon T-Shirt',
    'Warrior Spirit T-Shirt',
  ][i % 10],
  price: parseFloat((Math.floor(Math.random() * 20 + 30)).toFixed(2)),
  originalPrice: parseFloat((Math.floor(Math.random() * 30 + 40)).toFixed(2)),
  category: 'tshirt',
  images: [
    `https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/4066292/pexels-photo-4066292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  ],
  isNew: i < 15,
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
  reviewCount: Math.floor(Math.random() * 100 + 5),
  description: 'Premium quality MMA-inspired t-shirt made with high-quality materials for comfort and durability. Perfect for training or casual wear.',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Black', 'White', 'Red', 'Grey'],
  material: '100% Cotton',
  careInstructions: ['Machine wash cold', 'Tumble dry low', 'Do not bleach', 'Iron on low heat'],
  stock: Math.floor(Math.random() * 50 + 10),
}));

// Hoodies data
const hoodies: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: generateId(),
  name: [
    'Combat Hoodie',
    'Black Belt Hoodie',
    'Grappler\'s Hoodie',
    'Champions Hoodie',
    'Fight Night Hoodie',
    'Training Camp Hoodie',
  ][i % 6],
  price: parseFloat((Math.floor(Math.random() * 30 + 50)).toFixed(2)),
  originalPrice: parseFloat((Math.floor(Math.random() * 40 + 60)).toFixed(2)),
  category: 'hoodie',
  images: [
    `https://images.pexels.com/photos/5325599/pexels-photo-5325599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/7679657/pexels-photo-7679657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  ],
  isNew: i < 10,
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
  reviewCount: Math.floor(Math.random() * 80 + 5),
  description: 'Warm and comfortable hoodie designed for MMA enthusiasts. Features high-quality fabric and premium printing that will last.',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Black', 'Grey', 'Navy'],
  material: '80% Cotton, 20% Polyester',
  careInstructions: ['Machine wash cold', 'Tumble dry low', 'Do not bleach', 'Iron on low heat'],
  stock: Math.floor(Math.random() * 40 + 5),
}));

// Shorts data
const shorts: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: generateId(),
  name: [
    'Fight Shorts',
    'Grappling Shorts',
    'Competition Shorts',
    'Training Shorts',
    'Performance Shorts',
  ][i % 5],
  price: parseFloat((Math.floor(Math.random() * 25 + 35)).toFixed(2)),
  originalPrice: parseFloat((Math.floor(Math.random() * 35 + 45)).toFixed(2)),
  category: 'shorts',
  images: [
    `https://images.pexels.com/photos/3621780/pexels-photo-3621780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/3490363/pexels-photo-3490363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/4427914/pexels-photo-4427914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  ],
  isNew: i < 8,
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
  reviewCount: Math.floor(Math.random() * 70 + 5),
  description: 'Durable and flexible MMA shorts designed for maximum mobility and comfort during training and competition.',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Black', 'Blue', 'Red'],
  material: '90% Polyester, 10% Spandex',
  careInstructions: ['Machine wash cold', 'Hang to dry', 'Do not bleach', 'Do not iron'],
  stock: Math.floor(Math.random() * 35 + 5),
}));

// Coming soon products
const comingSoon: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: generateId(),
  name: [
    'Pro Gloves',
    'Compression Gear',
    'Mouth Guards',
    'Hand Wraps',
    'Training Pads',
  ][i % 5],
  price: parseFloat((Math.floor(Math.random() * 40 + 40)).toFixed(2)),
  originalPrice: parseFloat((Math.floor(Math.random() * 50 + 50)).toFixed(2)),
  category: 'coming-soon',
  images: [
    `https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
    `https://images.pexels.com/photos/6740754/pexels-photo-6740754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  ],
  isNew: true,
  rating: 0,
  reviewCount: 0,
  description: 'Coming soon! Be the first to know when this product is available.',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Black', 'Red'],
  material: 'Premium Materials',
  careInstructions: ['To be announced'],
  stock: 0,
}));

// Combine all products
export const allProducts: Product[] = [...tshirts, ...hoodies, ...shorts, ...comingSoon];

export const contactInfo = {
  email: 'support@sunnyday.com',
  phone: '+91 98765 43210',
  address: '123 MMA Street, Fight City, India'
};

// Categories data
export const categories = [
  { id: 'all', name: 'All Products', count: allProducts.length },
  { id: 'tshirt', name: 'T-Shirts', count: tshirts.length },
  { id: 'shorts', name: 'Fight Shorts', count: shorts.length },
  { id: 'hoodie', name: 'Hoodies', count: hoodies.length },
  { id: 'coming-soon', name: 'Coming Soon', count: comingSoon.length },
];

// Export all product categories
export { tshirts, hoodies, shorts, comingSoon };

// Price ranges
export const priceRanges = [
  { id: 'under-50', label: 'Under ₹50', min: 0, max: 50 },
  { id: '50-100', label: '₹50 - ₹100', min: 50, max: 100 },
  { id: '100-150', label: '₹100 - ₹150', min: 100, max: 150 },
  { id: 'over-150', label: 'Over ₹150', min: 150, max: Infinity },
];