import { useState, useEffect, useRef } from 'react';
import { Sun, Search, User,Heart, ShoppingCart, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

interface Product {
  id: number;
  name: string;
  category: string;
  path: string;
}

// Mock product data - replace with your actual data source
const mockProducts: Product[] = [
  { id: 1, name: "Classic Fight T-Shirt", category: "tshirt", path: "/products/1" },
  { id: 2, name: "Training Hoodie", category: "hoodie", path: "/products/2" },
  { id: 3, name: "Fight Shorts Pro", category: "shorts", path: "/products/3" },
  { id: 4, name: "Premium Hoodie", category: "hoodie", path: "/products/4" },
  { id: 5, name: "Combat T-Shirt", category: "tshirt", path: "/products/5" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { cartCount } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug?: string }[]>([]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close categories when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Load categories for navbar dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api<any>(`/categories`);
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any).categories)
          ? (data as any).categories
          : Array.isArray((data as any).data)
          ? (data as any).data
          : [];
        const mapped = list
          .map((c: any) => ({ id: c._id || c.id || c.slug || c.name, name: c.name || c.title || c.slug, slug: c.slug }))
          .filter((c: any) => c.id && c.name);
        setCategories(mapped);
      } catch (e) {
        // ignore
      }
    };
    loadCategories();
  }, []);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      // Filter products based on search query
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <header className="relative">
      {/* Navigation */}
      <nav className={`bg-black text-white py-4 px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'sticky top-0 z-50 shadow-lg' : ''}`}>
        <Link to="/" className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors">
          <div className="flex items-center">
            <Sun className="w-6 h-6 mr-2 text-red-600" />
            SUNNYDAY
          </div>
        </Link>

        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <Link 
            to="/products" 
            className={`hover:text-red-500 transition-colors ${location.pathname === '/products' ? 'text-red-500' : ''}`}
          >
            SHOP ALL
          </Link>
          <div 
            className="relative"
            ref={categoriesRef}
            onMouseEnter={() => setShowCategories(true)}
          >
            <button 
              className={`inline-flex items-center gap-1 hover:text-red-500 transition-colors ${location.pathname.includes('/products/category') ? 'text-red-500' : ''}`}
              aria-haspopup="true"
              aria-expanded={showCategories}
              onClick={() => setShowCategories((v) => !v)}
            >
              CATEGORIES
              <svg className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.854a.75.75 0 011.08 1.04l-4.24 4.4a.75.75 0 01-1.08 0l-4.24-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
            </button>
            {showCategories && (
              <div className="absolute left-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg ring-1 ring-black/5 z-40"
                   onMouseEnter={() => setShowCategories(true)}>
                <div className="py-2 max-h-80 overflow-y-auto">
                  {categories.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No categories</div>
                  ) : (
                    categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/products/category/${encodeURIComponent((c.slug || c.name).toLowerCase())}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setShowCategories(false)}
                      >
                        {c.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <Link 
            to="/contact" 
            className={`hover:text-red-500 transition-colors ${location.pathname === '/contact' ? 'text-red-500' : ''}`}
          >
            CONTACT
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Search Button and Input */}
          <div className="relative" ref={searchRef}>
            {searchOpen ? (
              <div className="absolute right-0 top-0 transform translate-y-1 bg-white text-black rounded-md shadow-lg z-50">
                <form onSubmit={handleSubmit} className="flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search products..."
                    className="py-2 px-4 w-64 focus:outline-none rounded-l-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-2 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={product.path}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        {product.name}
                      </Link>
                    ))}
                    <Link
                      to={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="block px-4 py-2 bg-gray-100 text-sm font-medium text-center hover:bg-gray-200"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      View all results
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="text-white hover:text-red-500 transition-colors"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

            <Link 
            to="/wishlist" 
            className="text-white hover:text-red-500 transition-colors"
            aria-label="Account"
          >
            <Heart className="h-5 w-5" />
             
          </Link>

          <Link 
            to="/profile" 
            className="text-white hover:text-red-500 transition-colors"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link 
            to="/cart" 
            className="text-white hover:text-red-500 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;