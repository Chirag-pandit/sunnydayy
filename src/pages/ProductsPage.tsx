import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Grid3X3, List } from 'lucide-react';
import { products } from '../data/products';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    // Filter products based on category
    if (categoryParam && categoryParam !== 'all') {
      setActiveCategory(categoryParam);
      setFilteredProducts(products.filter(product => product.category === categoryParam));
    } else {
      setActiveCategory('all');
      setFilteredProducts(products);
    }
  }, [categoryParam]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    
    // Create a new array to avoid mutating the original
    let sortedProducts = [...filteredProducts];
    
    switch(value) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'featured':
      default:
        // Reset to original filtered products
        sortedProducts = categoryParam && categoryParam !== 'all' 
          ? products.filter(product => product.category === categoryParam)
          : [...products];
        break;
    }
    
    setFilteredProducts(sortedProducts);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'gloves', name: 'MMA Gloves' },
    { id: 'shorts', name: 'Fight Shorts' },
    { id: 'rashguards', name: 'Rashguards' },
    { id: 'protection', name: 'Protection' },
    { id: 'accessories', name: 'Accessories' }
  ];

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="section-title">
            {categoryParam 
              ? categories.find(c => c.id === categoryParam)?.name || 'Products'
              : 'All Products'
            }
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden flex items-center text-gray-100 bg-secondary-light px-4 py-2 rounded"
              onClick={toggleFilter}
            >
              <Filter size={18} className="mr-2" />
              Filter
              <ChevronDown size={18} className={`ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Sort & View Options */}
            <div className="flex items-center ml-auto gap-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-300 hidden sm:inline">Sort by:</label>
                <select 
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-secondary-light text-gray-100 rounded border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              
              <div className="hidden md:flex bg-secondary-light rounded overflow-hidden">
                <button 
                  className={`p-2 ${view === 'grid' ? 'bg-primary text-secondary-dark' : 'text-gray-300'}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={18} />
                </button>
                <button 
                  className={`p-2 ${view === 'list' ? 'bg-primary text-secondary-dark' : 'text-gray-300'}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters - Mobile */}
          {isFilterOpen && (
            <div className="md:hidden bg-secondary-light p-4 rounded mb-6">
              <h3 className="font-heading text-xl mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`block w-full text-left py-2 px-3 rounded ${
                        activeCategory === category.id 
                          ? 'bg-primary text-secondary-dark font-medium' 
                          : 'text-gray-200 hover:bg-secondary-dark'
                      }`}
                      onClick={() => filterByCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-secondary-light p-6 rounded sticky top-24">
              <h3 className="font-heading text-xl mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                        activeCategory === category.id 
                          ? 'bg-primary text-secondary-dark font-medium' 
                          : 'text-gray-200 hover:bg-secondary-dark'
                      }`}
                      onClick={() => filterByCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              {/* Price Filter */}
              <div className="mt-8">
                <h3 className="font-heading text-xl mb-4">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="price-1" className="mr-2" />
                    <label htmlFor="price-1" className="text-gray-200">Under $50</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-2" className="mr-2" />
                    <label htmlFor="price-2" className="text-gray-200">$50 - $100</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-3" className="mr-2" />
                    <label htmlFor="price-3" className="text-gray-200">$100 - $150</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-4" className="mr-2" />
                    <label htmlFor="price-4" className="text-gray-200">Over $150</label>
                  </div>
                </div>
              </div>
              
              {/* Additional Filters can be added here */}
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <motion.div 
                className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    variants={fadeInUp}
                    className={`product-card ${view === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                  >
                    <Link to={`/products/${product.id}`} className="block product-hover-zoom overflow-hidden">
                      <div className={view === 'list' ? 'md:w-1/3' : ''}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={`w-full aspect-square object-cover ${view === 'list' ? 'md:h-full' : ''}`}
                        />
                      </div>
                    </Link>
                    
                    <div className={`p-4 ${view === 'list' ? 'md:w-2/3' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/products/${product.id}`} className="block">
                          <h3 className="font-heading text-xl font-bold text-gray-100 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.isNew && (
                          <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      {view === 'list' && (
                        <p className="text-gray-300 mb-4">{product.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <span className="font-bold text-primary text-lg">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        
                        {view === 'list' ? (
                          <Link to={`/products/${product.id}`} className="btn-primary text-sm px-4 py-2">
                            View Details
                          </Link>
                        ) : (
                          <button className="text-primary hover:text-primary-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-heading mb-4">No products found</h3>
                <p className="text-gray-300 mb-6">Try adjusting your filters or search criteria.</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setActiveCategory('all');
                    setFilteredProducts(products);
                  }}
                >
                  View All Products
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex">
                  <a href="#" className="px-4 py-2 mx-1 rounded bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark">
                    &laquo;
                  </a>
                  <a href="#" className="px-4 py-2 mx-1 rounded bg-primary text-secondary-dark">
                    1
                  </a>
                  <a href="#" className="px-4 py-2 mx-1 rounded bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark">
                    2
                  </a>
                  <a href="#" className="px-4 py-2 mx-1 rounded bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark">
                    3
                  </a>
                  <a href="#" className="px-4 py-2 mx-1 rounded bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark">
                    &raquo;
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;