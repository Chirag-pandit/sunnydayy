import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft, Share2, Heart } from 'lucide-react';
import { products } from '../data/products';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState(products.find(p => p.id === id));
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Find the product based on ID
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct);
    
    // Reset state when product changes
    if (foundProduct && foundProduct.sizes && foundProduct.sizes.length > 0) {
      setSelectedSize(foundProduct.sizes[0]);
    } else {
      setSelectedSize('');
    }
    setQuantity(1);
    setActiveImageIndex(0);
  }, [id]);
  
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

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
              {product.category}
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
            variants={fadeIn}
            initial="initial"
            animate="animate"
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
                <button className="p-2 rounded-full bg-secondary-light text-gray-300 hover:text-primary transition-colors">
                  <Heart size={20} />
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
            {product.sizes && product.sizes.length > 0 && (
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
            )}
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading text-lg mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color.code}
                      className={`w-10 h-10 rounded-full border-2 ${
                        color.selected ? 'border-primary' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            
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
              
              <button className="flex-grow btn-primary">
                ADD TO CART
              </button>
              
              <button className="btn-secondary">
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
                      {product.longDescription || product.description}
                    </p>
                    <p className="text-gray-300">
                      Our premium {product.name} is designed for serious fighters who demand the best. Crafted with high-quality materials and built to withstand the toughest training sessions and fights. The ergonomic design ensures maximum comfort and protection, allowing you to focus on your performance.
                    </p>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h3 className="font-heading font-medium mb-2">Materials</h3>
                      <p className="text-gray-300">Premium synthetic leather, shock-absorbing foam</p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Weight</h3>
                      <p className="text-gray-300">12oz - 16oz (depending on size)</p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Care Instructions</h3>
                      <p className="text-gray-300">Wipe clean with damp cloth, air dry away from direct sunlight</p>
                    </div>
                    <div>
                      <h3 className="font-heading font-medium mb-2">Country of Origin</h3>
                      <p className="text-gray-300">USA</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    {/* Review Summary */}
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
                    
                    {/* Reviews List */}
                    <div className="space-y-6">
                      {/* Review 1 */}
                      <div className="border-b border-gray-700 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-heading font-bold">John D.</h4>
                          <span className="text-gray-400">2 weeks ago</span>
                        </div>
                        <div className="flex text-primary mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill="currentColor" 
                            />
                          ))}
                        </div>
                        <p className="text-gray-300">
                          Absolutely love these gloves! The quality is top-notch and they provide excellent protection during sparring. Highly recommend for any serious fighter.
                        </p>
                      </div>
                      
                      {/* Review 2 */}
                      <div className="border-b border-gray-700 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-heading font-bold">Sarah M.</h4>
                          <span className="text-gray-400">1 month ago</span>
                        </div>
                        <div className="flex text-primary mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < 4 ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-300">
                          Great product overall. Comfortable and durable. The only reason I'm giving 4 stars is because they took a while to break in. After that, they're perfect.
                        </p>
                      </div>
                      
                      {/* Review 3 */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <h4 className="font-heading font-bold">Mike R.</h4>
                          <span className="text-gray-400">2 months ago</span>
                        </div>
                        <div className="flex text-primary mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < 5 ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-300">
                          Best MMA gear I've ever used. The quality is exceptional and they've held up well through intense training sessions. Worth every penny!
                        </p>
                      </div>
                      
                      {/* More Reviews Button */}
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
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <motion.div 
                  key={relatedProduct.id}
                  className="product-card"
                  variants={fadeIn}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <Link to={`/products/${relatedProduct.id}`} className="block product-hover-zoom overflow-hidden">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="w-full aspect-square object-cover"
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
                      
                      <button className="text-primary hover:text-primary-dark">
                        <Heart size={20} />
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