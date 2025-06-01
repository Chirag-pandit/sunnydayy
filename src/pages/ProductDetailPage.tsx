import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, ChevronDown, Truck, Shield } from 'lucide-react';
import { allProducts } from '../data/products';
import { useCart } from './CartContext';

const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  // Convert id to number since your product IDs are numbers
  const productId = id ? parseInt(id) : null;
  const product = allProducts.find(p => p.id === productId);
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!product && id) {
      navigate('/products');
      return;
    }
    
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setMainImage(product.images[0]);
    }
  }, [product, id, navigate]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor
    });
    
    // Show feedback then reset
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  if (!product) {
    return (
      <div className="bg-secondary min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Product not found</h2>
          <Link 
            to="/products" 
            className="inline-block bg-primary text-secondary-dark px-6 py-3 rounded font-medium"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  // Find related products (same category)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  // Get index of current product
  const currentIndex = allProducts.findIndex(p => p.id === productId);
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null;
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  
  const toggleSizeChart = () => {
    setShowSizeChart(!showSizeChart);
  };

  // Default size chart if not provided
  const sizeChart = {
    'S': '34-36" Chest',
    'M': '38-40" Chest',
    'L': '42-44" Chest',
    'XL': '46-48" Chest',
    'XXL': '50-52" Chest'
  };

  // Default shipping info if not provided
  const shippingInfo = 'FREE shipping on orders over $50. Standard shipping 3-5 business days.';

  const isInCart = cartItems.some(item => 
    item.id === product.id && 
    item.size === selectedSize && 
    item.color === selectedColor
  );

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Products
          </button>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-secondary-light rounded-lg overflow-hidden">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button 
                  key={index} 
                  className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border-2 ${
                    mainImage === img ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-100">{product.name}</h1>
                <button className="text-gray-300 hover:text-primary transition-colors" aria-label="Add to wishlist">
                  <Heart size={24} />
                </button>
              </div>
              
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={18} 
                      fill={star <= Math.floor(product.rating) ? "currentColor" : "none"} 
                      className={star <= Math.floor(product.rating) ? "text-primary" : "text-gray-400"}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">{product.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex space-x-2">
                  {product.isNew && (
                    <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-primary text-secondary-dark text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                  {(product.stock <= 0 || product.inStock === false) && (
                    <span className="bg-secondary-light text-primary text-xs font-bold px-2 py-1 rounded">
                      {product.stock <= 0 ? 'OUT OF STOCK' : 'COMING SOON'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through ml-3">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="ml-3 text-accent">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-300">{product.description}</p>
            
            {/* Color Selection */}
            <div>
              <h3 className="text-gray-100 font-medium mb-2">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? 'border-primary text-primary'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-100 font-medium">Size:</h3>
                <button 
                  className="text-primary text-sm flex items-center"
                  onClick={toggleSizeChart}
                >
                  Size Chart
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform ${showSizeChart ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
              
              {showSizeChart && (
                <div className="bg-secondary-light p-4 rounded-md mb-4">
                  <h4 className="text-gray-100 font-medium mb-2">Size Chart</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300 text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2 text-left">Size</th>
                          <th className="py-2 text-left">Measurement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sizeChart).map(([size, measurement]) => (
                          <tr key={size} className="border-b border-gray-700">
                            <td className="py-2">{size}</td>
                            <td className="py-2">{measurement}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'border-primary text-primary'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <label htmlFor="quantity" className="block text-gray-100 font-medium mb-2">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full bg-secondary-light text-gray-100 rounded border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={product.stock <= 0 || product.inStock === false}
                >
                  {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-2/3">
                <button
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded font-medium mt-7 ${
                    product.stock > 0 && product.inStock !== false
                      ? isInCart
                        ? 'bg-green-600 text-white'
                        : 'bg-primary text-secondary-dark hover:bg-primary-dark transition-colors'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.stock <= 0 || product.inStock === false || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    'Adding...'
                  ) : product.stock <= 0 ? (
                    'Out of Stock'
                  ) : product.inStock === false ? (
                    'Coming Soon'
                  ) : isInCart ? (
                    'Added to Cart ✓'
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Shipping & Returns */}
            <div className="space-y-3 border-t border-gray-700 pt-6">
              <div className="flex items-start">
                <Truck size={20} className="text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="text-gray-100 font-medium">Shipping</h3>
                  <p className="text-gray-300 text-sm">{shippingInfo}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield size={20} className="text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="text-gray-100 font-medium">Returns</h3>
                  <p className="text-gray-300 text-sm">30-day easy returns. <a href="#" className="text-primary">See our return policy</a></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Product Navigation */}
        <div className="flex justify-between border-t border-b border-gray-700 py-4 mb-12">
          {prevProduct ? (
            <Link 
              to={`/products/${prevProduct.id}`} 
              className="flex items-center text-gray-300 hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} className="mr-2" />
              <span className="hidden sm:inline">Previous Product:</span>
              <span className="font-medium ml-1">{prevProduct.name}</span>
            </Link>
          ) : (
            <div></div>
          )}
          
          {nextProduct && (
            <Link 
              to={`/products/${nextProduct.id}`} 
              className="flex items-center text-gray-300 hover:text-primary transition-colors"
            >
              <span className="font-medium mr-1">{nextProduct.name}</span>
              <span className="hidden sm:inline">:Next Product</span>
              <ChevronRight size={20} className="ml-2" />
            </Link>
          )}
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-secondary-light rounded-lg overflow-hidden shadow-md">
                  <Link to={`/products/${relatedProduct.id}`} className="block relative group overflow-hidden">
                    <img 
                      src={relatedProduct.images[0]} 
                      alt={relatedProduct.name} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {(relatedProduct.stock <= 0 || relatedProduct.inStock === false) && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <span className="bg-secondary-light text-primary text-sm font-bold px-4 py-2 rounded">
                          {relatedProduct.stock <= 0 ? 'OUT OF STOCK' : 'COMING SOON'}
                        </span>
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/products/${relatedProduct.id}`} className="block">
                        <h3 className="font-medium text-gray-100 hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <div className="flex space-x-2">
                        {relatedProduct.isNew && (
                          <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                        {relatedProduct.originalPrice && (
                          <span className="bg-primary text-secondary-dark text-xs font-bold px-2 py-1 rounded">
                            SALE
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="font-bold text-primary">${relatedProduct.price.toFixed(2)}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-gray-400 line-through ml-2">${relatedProduct.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star size={16} fill="currentColor" className="text-primary mr-1" />
                        <span className="text-sm text-gray-300">{relatedProduct.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;