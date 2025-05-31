import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft, Share2, Heart } from 'lucide-react';

// Define product type
interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'tshirt' | 'shorts' | 'hoodie';
  sizes: string[];
  colors: {
    name: string;
    code: string;
    selected?: boolean;
  }[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
}

// Mock products data
const products: Product[] = [
  {
    id: 'tshirt-1',
    name: 'Fight Ready T-Shirt',
    description: 'Premium cotton t-shirt for training and casual wear',
    longDescription: 'Our Fight Ready T-Shirt is made from 100% premium combed cotton for maximum comfort and durability. The fabric is breathable and moisture-wicking, keeping you cool during intense workouts. Features reinforced stitching and a tagless design to prevent irritation.',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583744946564-b52d01e2da64?w=800&h=800&fit=crop'
    ],
    category: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#000000', selected: true },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Navy', code: '#001F3F' }
    ],
    rating: 4.5,
    reviewCount: 124,
    isNew: true
  },
  {
    id: 'shorts-1',
    name: 'Training Shorts',
    description: 'Performance shorts designed for MMA training',
    longDescription: 'These Training Shorts feature a lightweight, quick-drying fabric with 4-way stretch for maximum mobility. The waistband has an internal drawstring for secure fit, and the gusseted crotch prevents ride-up during movement. Includes two side pockets and one secure back pocket.',
    price: 44.99,
    originalPrice: 54.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop'
    ],
    category: 'shorts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', code: '#000000', selected: true },
      { name: 'Gray', code: '#808080' },
      { name: 'Red', code: '#FF0000' }
    ],
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: 'hoodie-1',
    name: 'Champion Hoodie',
    description: 'Heavyweight hoodie for cold weather training',
    longDescription: 'The Champion Hoodie is crafted from heavyweight 80% cotton/20% polyester blend for warmth and durability. Features a double-lined hood, kangaroo pocket, and reinforced stitching at stress points. The interior is brushed for extra softness against the skin.',
    price: 59.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1620799139834-6b8f844802e1?w=800&h=800&fit=crop'
    ],
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#000000', selected: true },
      { name: 'Charcoal', code: '#36454F' },
      { name: 'Navy', code: '#001F3F' }
    ],
    rating: 4.8,
    reviewCount: 156,
    isNew: true
  }
];

// Cart item type
interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct);
    
    if (foundProduct) {
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0].name);
    }
    
    setQuantity(1);
    setActiveImageIndex(0);
  }, [id]);
  
  const addToCart = () => {
    if (!product) return;
    
    const newItem: CartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && 
               item.selectedSize === selectedSize && 
               item.selectedColor === selectedColor
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }
      
      return [...prevCart, newItem];
    });
    
    // Show feedback to user
    alert(`${quantity} ${product.name} (${selectedSize}, ${selectedColor}) added to cart!`);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-heading mb-6">Product Not Found</h1>
        <p className="mb-8 text-gray-300">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-400">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize">
              {product.category === 'tshirt' ? 'T-Shirts' : 
               product.category === 'shorts' ? 'Shorts' : 'Hoodies'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">{product.name}</span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          {/* Product Images */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 bg-secondary-light rounded-lg overflow-hidden">
              <img 
                src={product.images ? product.images[activeImageIndex] : product.image} 
                alt={product.name} 
                className="w-full aspect-square object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer bg-secondary-light rounded overflow-hidden border-2 ${
                      activeImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Product Info */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                {product.isNew && (
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded mb-2">
                    NEW
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-100 mb-2">
                  {product.name}
                </h1>
              </div>
              <div className="flex space-x-2">
                <button 
                  className={`p-2 rounded-full bg-secondary-light text-gray-300 hover:text-primary transition-colors ${isFavorite ? 'text-accent' : ''}`}
                  onClick={toggleFavorite}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 rounded-full bg-secondary-light text-gray-300 hover:text-primary transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < product.rating ? 'currentColor' : 'none'} 
                  />
                ))}
              </div>
              <span className="text-gray-400 ml-2">({product.reviewCount} reviews)</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-heading font-bold text-primary mr-3">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {product.originalPrice && (
                <p className="text-accent font-medium mt-1">
                  Save ${(product.originalPrice - product.price).toFixed(2)} ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                </p>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-300 mb-6">{product.description}</p>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-heading text-lg mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 border ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-secondary-dark font-medium'
                        : 'border-gray-600 text-gray-300 hover:border-primary'
                    } rounded-md transition-colors`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-heading text-lg mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color.code}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.name ? 'border-primary' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                  />
                ))}
              </div>
            </div>
            
            {/* Quantity & Add to Cart */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex">
                <button 
                  className="px-4 py-3 bg-secondary-light border border-gray-700 border-r-0 rounded-l-md"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 bg-secondary-light border border-gray-700 text-center focus:outline-none"
                />
                <button 
                  className="px-4 py-3 bg-secondary-light border border-gray-700 border-l-0 rounded-r-md"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              
              <button 
                className="flex-grow btn-primary"
                onClick={addToCart}
              >
                ADD TO CART
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => {
                  addToCart();
                  // In a real app, you would navigate to checkout
                  alert('Proceeding to checkout!');
                }}
              >
                BUY NOW
              </button>
            </div>
            
            {/* Product Benefits */}
            <div className="bg-secondary-light p-4 rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <ShieldCheck size={20} className="text-primary mr-2" />
                  <span className="text-sm">1 Year Warranty</span>
                </div>
                <div className="flex items-center">
                  <Truck size={20} className="text-primary mr-2" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <ArrowLeft size={20} className="text-primary mr-2" />
                  <span className="text-sm">30-Day Returns</span>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex border-b border-gray-700">
                <button 
                  className={`py-3 px-4 font-heading font-medium ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-300'}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`py-3 px-4 font-heading font-medium ${activeTab === 'specifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-300'}`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
                <button 
                  className={`py-3 px-4 font-heading font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-300'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.reviewCount})
                </button>
              </div>
              
              <div className="py-6">
                {activeTab === 'description' && (
                  <div>
                    <p className="text-gray-300 mb-4">
                      {product.longDescription}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-heading font-bold text-gray-100 mb-2">Features:</h4>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {product.category === 'tshirt' ? '100% premium combed cotton' : 
                             product.category === 'shorts' ? 'Quick-drying 4-way stretch fabric' : 
                             '80% cotton/20% polyester heavyweight blend'}
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {product.category === 'tshirt' ? 'Reinforced stitching for durability' : 
                             product.category === 'shorts' ? 'Gusseted crotch for mobility' : 
                             'Double-lined hood for extra warmth'}
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {product.category === 'tshirt' ? 'Tagless design to prevent irritation' : 
                             product.category === 'shorts' ? 'Secure pockets for essentials' : 
                             'Brushed interior for softness'}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-gray-100 mb-2">Best For:</h4>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {product.category === 'tshirt' ? 'Training sessions' : 
                             product.category === 'shorts' ? 'MMA and grappling' : 
                             'Cold weather workouts'}
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {product.category === 'tshirt' ? 'Everyday casual wear' : 
                             product.category === 'shorts' ? 'High-intensity conditioning' : 
                             'Post-training recovery'}
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {product.category === 'tshirt' ? 'Layering under fight gear' : 
                             product.category === 'shorts' ? 'Competition preparation' : 
                             'Streetwear fashion'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h3 className="font-heading font-medium mb-2">Materials</h3>
                      <p className="text-gray-300">
                        {product.category === 'tshirt' ? '100% premium combed cotton' : 
                         product.category === 'shorts' ? '92% polyester, 8% spandex' : 
                         '80% cotton, 20% polyester'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Weight</h3>
                      <p className="text-gray-300">
                        {product.category === 'tshirt' ? '180 gsm (grams per square meter)' : 
                         product.category === 'shorts' ? 'Lightweight (approx. 250g)' : 
                         'Heavyweight (approx. 450g)'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Care Instructions</h3>
                      <p className="text-gray-300">
                        {product.category === 'tshirt' ? 'Machine wash cold, tumble dry low' : 
                         product.category === 'shorts' ? 'Machine wash cold, hang to dry' : 
                         'Machine wash cold, tumble dry low'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Country of Origin</h3>
                      <p className="text-gray-300">USA</p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Fit</h3>
                      <p className="text-gray-300">
                        {product.category === 'tshirt' ? 'Regular fit' : 
                         product.category === 'shorts' ? 'Athletic fit' : 
                         'Standard fit'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Sizing</h3>
                      <p className="text-gray-300">True to size (refer to size chart)</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                      <div className="md:w-1/3 text-center">
                        <div className="text-5xl font-bold text-primary mb-2">{product.rating.toFixed(1)}</div>
                        <div className="flex justify-center text-primary mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={20} 
                              fill={i < product.rating ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-400">{product.reviewCount} reviews</p>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center">
                              <div className="w-12 text-gray-400">{star} star</div>
                              <div className="flex-grow mx-4 bg-secondary-light rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-primary h-full" 
                                  style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                                ></div>
                              </div>
                              <div className="w-12 text-right text-gray-400">
                                {star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="border-b border-gray-700 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-heading font-bold">Alex M.</h4>
                          <span className="text-gray-400">1 week ago</span>
                        </div>
                        <div className="flex text-primary mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-gray-300">
                          {product.category === 'tshirt' ? 
                           'This is the most comfortable training shirt I own. The fabric is soft but durable, and it holds up well after multiple washes.' : 
                           product.category === 'shorts' ? 
                           'Perfect for MMA training! The stretch allows for full range of motion, and the fabric dries incredibly fast.' : 
                           'The heavyweight material is perfect for cold mornings. The hood is roomy enough to fit over my headgear.'}
                        </p>
                      </div>
                      
                      <div className="border-b border-gray-700 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-heading font-bold">Jamie R.</h4>
                          <span className="text-gray-400">3 weeks ago</span>
                        </div>
                        <div className="flex text-primary mb-2">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                          <Star size={16} fill="none" />
                        </div>
                        <p className="text-gray-300">
                          {product.category === 'tshirt' ? 
                           'Great shirt overall. The fit is slightly looser than expected, but the quality is excellent.' : 
                           product.category === 'shorts' ? 
                           'Love these shorts! Only giving 4 stars because the pockets could be deeper to hold more items securely.' : 
                           'Super warm and comfortable. The only minor issue is the drawstrings could be a bit longer for easier tying.'}
                        </p>
                      </div>
                      
                      <div className="text-center mt-8">
                        <button className="btn-secondary">
                          Load More Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-gray-100 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <motion.div 
                  key={relatedProduct.id}
                  className="bg-secondary-light rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/products/${relatedProduct.id}`} className="block overflow-hidden">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/products/${relatedProduct.id}`} className="block">
                      <h3 className="font-heading text-lg font-bold text-gray-100 hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="font-bold text-primary">${relatedProduct.price.toFixed(2)}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-gray-400 line-through ml-2">${relatedProduct.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      
                      <button 
                        className="text-gray-300 hover:text-accent transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsFavorite(!isFavorite);
                        }}
                      >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;