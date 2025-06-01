import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Grid3X3, List, ChevronLeft } from 'lucide-react';
import { allProducts } from '../data/products';
import { Product } from '../types';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';

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

type ViewType = 'grid' | 'list';

interface Category {
  id: string;
  name: string;
}

interface PriceFilters {
  under50: boolean;
  between50And100: boolean;
  between100And150: boolean;
  over150: boolean;
}

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');
  const pageParam = searchParams.get('page');

  const [products, setProducts] = useState<Product[]>(allProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<ViewType>('grid');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [priceFilters, setPriceFilters] = useState<PriceFilters>({
    under50: false,
    between50And100: false,
    between100And150: false,
    over150: false
  });
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const PRODUCTS_PER_PAGE = 6;

  // Categories list with proper order (shirts, hoodies, shorts first)
  const categories: Category[] = [
    { id: 'all', name: 'All Products' },
     { id: 'shirts', name: 'T-Shirts' },
     { id: 'shorts', name: 'Fight Shorts' },
     { id: 'hoodies', name: 'Hoodies' },
   
  ];

  // Filter products based on all criteria
  const filterProducts = useCallback(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Filter by in-stock status
    if (inStockOnly) {
      result = result.filter(product => product.stock > 0);
    }
    
    // Filter by price
    const activePriceFilters = Object.entries(priceFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (activePriceFilters.length > 0) {
      result = result.filter(product => {
        if (priceFilters.under50 && product.price < 50) return true;
        if (priceFilters.between50And100 && product.price >= 50 && product.price <= 100) return true;
        if (priceFilters.between100And150 && product.price > 100 && product.price <= 150) return true;
        if (priceFilters.over150 && product.price > 150) return true;
        return false;
      });
    }
    
    // Sort products
    switch(sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price);
      case 'newest':
        // Assuming all products have a createdAt date
        // return [...result].sort((a, b) => {
        //   const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        //   const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        //   return dateB - dateA;
        // });
      case 'featured':
      default:
        return result;
    }
  }, [
    products, 
    activeCategory, 
    sortBy, 
    priceFilters, 
    inStockOnly
  ]);

  // Handle pagination
  const paginateProducts = useCallback((products: Product[], page: number) => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [PRODUCTS_PER_PAGE]);

  // Apply filters and sort whenever criteria change
  useEffect(() => {
    const filtered = filterProducts();
    setFilteredProducts(filtered);
    
    // Update displayed products based on current page
    setDisplayProducts(paginateProducts(filtered, currentPage));
    
    // Update URL params
    const params = new URLSearchParams();
    if (activeCategory !== 'all') {
      params.set('category', activeCategory);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    setSearchParams(params);
  }, [
    activeCategory, 
    sortBy, 
    currentPage, 
    priceFilters, 
    inStockOnly, 
    filterProducts, 
    paginateProducts, 
    setSearchParams
  ]);

  // Update category and page from URL parameters
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page)) {
        setCurrentPage(page);
      }
    } else {
      setCurrentPage(1);
    }
  }, [categoryParam, pageParam]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setPriceFilters(prev => ({
      ...prev,
      [id]: checked
    }));
    setCurrentPage(1);
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStockOnly(e.target.checked);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {categories.find(c => c.id === activeCategory)?.name || 'All Products'}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden flex items-center text-gray-100 bg-secondary-light px-4 py-2 rounded"
              onClick={toggleFilter}
            >
              <Filter size={18} className="mr-2" />
              Filter
              <ChevronDown 
                size={18} 
                className={`ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
              />
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
              <h3 className="text-xl font-bold mb-4 text-gray-100">Categories</h3>
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
              
              {/* Price Filter */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { id: 'under50', label: 'Under $50' },
                    { id: 'between50And100', label: '$50 - $100' },
                    { id: 'between100And150', label: '$100 - $150' },
                    { id: 'over150', label: 'Over $150' }
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={id}
                        className="mr-2" 
                        checked={priceFilters[id as keyof PriceFilters]}
                        onChange={handlePriceFilterChange}
                      />
                      <label htmlFor={id} className="text-gray-200">{label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Availability Filter */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Availability</h3>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="inStock" 
                    className="mr-2" 
                    checked={inStockOnly}
                    onChange={handleInStockChange}
                  />
                  <label htmlFor="inStock" className="text-gray-200">In Stock Only</label>
                </div>
              </div>
            </div>
          )}
          
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-secondary-light p-6 rounded sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-100">Categories</h3>
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
                <h3 className="text-xl font-bold mb-4 text-gray-100">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { id: 'under50', label: 'Under $50' },
                    { id: 'between50And100', label: '$50 - $100' },
                    { id: 'between100And150', label: '$100 - $150' },
                    { id: 'over150', label: 'Over $150' }
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={id}
                        className="mr-2" 
                        checked={priceFilters[id as keyof PriceFilters]}
                        onChange={handlePriceFilterChange}
                      />
                      <label htmlFor={id} className="text-gray-200">{label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Availability Filter */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Availability</h3>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="inStock" 
                    className="mr-2" 
                    checked={inStockOnly}
                    onChange={handleInStockChange}
                  />
                  <label htmlFor="inStock" className="text-gray-200">In Stock Only</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {displayProducts.length > 0 ? (
              <motion.div 
                className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {displayProducts.map(product => (
                  <motion.div key={product.id} variants={fadeInUp}>
                    <ProductCard product={product} view={view} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-100">No products found</h3>
                <p className="text-gray-300 mb-6">Try adjusting your filters or search criteria.</p>
                <button 
                  className="px-6 py-3 bg-primary text-secondary-dark font-medium rounded hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    setActiveCategory('all');
                    setPriceFilters({
                      under50: false,
                      between50And100: false,
                      between100And150: false,
                      over150: false
                    });
                    setInStockOnly(false);
                    setCurrentPage(1);
                  }}
                >
                  View All Products
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts.length > PRODUCTS_PER_PAGE && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;