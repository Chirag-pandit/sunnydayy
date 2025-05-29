import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ChevronLeft, CreditCard, ArrowRight } from 'lucide-react';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const CartPage: React.FC = () => {
  // Dummy cart data
  const [cartItems, setCartItems] = useState([
    { 
      id: '1', 
      name: 'Pro MMA Gloves',
      image: 'https://images.pexels.com/photos/9389932/pexels-photo-9389932.jpeg',
      price: 89.99, 
      quantity: 1,
      size: 'L',
      color: 'Black/Gold'
    },
    { 
      id: '2', 
      name: 'Competition Fight Shorts',
      image: 'https://images.pexels.com/photos/9389884/pexels-photo-9389884.jpeg',
      price: 59.99, 
      quantity: 2,
      size: 'M',
      color: 'Black'
    },
    { 
      id: '3', 
      name: 'Performance Rashguard',
      image: 'https://images.pexels.com/photos/8032725/pexels-photo-8032725.jpeg',
      price: 45.99, 
      quantity: 1,
      size: 'L',
      color: 'Red/Black'
    }
  ]);
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 12.99;
  const discount = promoApplied ? promoDiscount : 0;
  const total = subtotal + shipping - discount;
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FIGHTER10') {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.1); // 10% discount
    } else {
      alert('Invalid promo code');
    }
  };
  
  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container">
        <h1 className="section-title mb-8">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <motion.div 
              className="lg:w-2/3"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <div className="bg-secondary-light rounded-lg overflow-hidden mb-6">
                <div className="p-4 bg-secondary-dark border-b border-gray-700">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <h3 className="font-heading font-bold">Product</h3>
                    </div>
                    <div className="col-span-2 text-center">
                      <h3 className="font-heading font-bold">Price</h3>
                    </div>
                    <div className="col-span-2 text-center">
                      <h3 className="font-heading font-bold">Quantity</h3>
                    </div>
                    <div className="col-span-2 text-right">
                      <h3 className="font-heading font-bold">Total</h3>
                    </div>
                  </div>
                </div>
                
                {cartItems.map(item => (
                  <motion.div 
                    key={item.id}
                    variants={fadeIn}
                    className="p-4 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <div className="w-20 h-20 flex-shrink-0 bg-secondary rounded overflow-hidden mr-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-gray-100 mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-400">Size: {item.size}</p>
                            <p className="text-sm text-gray-400">Color: {item.color}</p>
                            <button 
                              className="text-red-500 text-sm flex items-center mt-2 hover:text-red-400 transition-colors"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="text-primary font-medium">${item.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 flex items-center justify-center bg-secondary rounded-l border border-gray-700"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 h-8 bg-secondary border-t border-b border-gray-700 text-center focus:outline-none"
                          />
                          <button 
                            className="w-8 h-8 flex items-center justify-center bg-secondary rounded-r border border-gray-700"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 text-right">
                        <span className="font-bold text-gray-100">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <Link to="/products" className="flex items-center text-primary hover:text-primary-dark transition-colors mb-4 sm:mb-0">
                  <ChevronLeft size={20} className="mr-1" />
                  Continue Shopping
                </Link>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="px-4 py-2 bg-secondary-light border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button 
                    className="btn-primary h-full py-2"
                    onClick={handleApplyPromo}
                    disabled={promoApplied}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              className="lg:w-1/3"
              variants={fadeIn}
              initial="initial"
              animate="animate"
            >
              <div className="bg-secondary-light rounded-lg overflow-hidden">
                <div className="p-4 bg-secondary-dark border-b border-gray-700">
                  <h3 className="font-heading font-bold text-xl">Order Summary</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between text-accent">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between">
                        <span className="font-heading font-bold text-lg">Total</span>
                        <span className="font-heading font-bold text-lg text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary mb-4">
                    <CreditCard size={20} className="mr-2" />
                    Proceed to Checkout
                  </button>
                  
                  <p className="text-center text-sm text-gray-400 mb-4">
                    We accept Credit Cards, PayPal, and Apple Pay
                  </p>
                  
                  <div className="flex justify-center space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/200px-MasterCard_Logo.svg.png" alt="Mastercard" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png" alt="PayPal" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/100px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-8" />
                  </div>
                </div>
              </div>
              
              {/* Shipping Policy */}
              <div className="mt-6 bg-secondary-light rounded-lg p-6">
                <h3 className="font-heading font-bold mb-3">Shipping Information</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Free shipping on orders over $100
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Standard shipping (3-5 business days)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Express shipping available at checkout
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="inline-block p-6 bg-secondary-light rounded-full mb-6">
              <ShoppingBag size={64} className="text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Check out our products and find the perfect gear for your next fight.
            </p>
            <Link to="/products" className="btn-primary">
              Explore Products
            </Link>
          </motion.div>
        )}
        
        {/* You May Also Like */}
        <div className="mt-20">
          <h2 className="section-title mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recommended Product 1 */}
            <motion.div 
              className="product-card"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Link to="/products/headgear" className="block product-hover-zoom overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/6740732/pexels-photo-6740732.jpeg" 
                  alt="MMA Headgear" 
                  className="w-full aspect-square object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to="/products/headgear" className="block">
                  <h3 className="font-heading text-lg font-bold text-gray-100 hover:text-primary transition-colors">
                    Professional Headgear
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">$79.99</span>
                  <button className="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Recommended Product 2 */}
            <motion.div 
              className="product-card"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/products/handwraps" className="block product-hover-zoom overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg" 
                  alt="Hand Wraps" 
                  className="w-full aspect-square object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to="/products/handwraps" className="block">
                  <h3 className="font-heading text-lg font-bold text-gray-100 hover:text-primary transition-colors">
                    Professional Hand Wraps (3 Pack)
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">$24.99</span>
                  <button className="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Recommended Product 3 */}
            <motion.div 
              className="product-card"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/products/mouthguard" className="block product-hover-zoom overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/6111/fitness-equipment-boxing-glove-hitting.jpg" 
                  alt="Mouthguard" 
                  className="w-full aspect-square object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to="/products/mouthguard" className="block">
                  <h3 className="font-heading text-lg font-bold text-gray-100 hover:text-primary transition-colors">
                    Premium Mouthguard
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">$19.99</span>
                  <button className="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Recommended Product 4 */}
            <motion.div 
              className="product-card"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/products/gym-bag" className="block product-hover-zoom overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7992496/pexels-photo-7992496.jpeg" 
                  alt="Gym Bag" 
                  className="w-full aspect-square object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to="/products/gym-bag" className="block">
                  <h3 className="font-heading text-lg font-bold text-gray-100 hover:text-primary transition-colors">
                    Fighter Gym Bag
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">$69.99</span>
                  <button className="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/products" className="inline-flex items-center text-primary hover:text-primary-dark font-heading">
              Browse All Products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;