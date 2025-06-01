import { useState, useEffect } from 'react';
import { Sun, Search, User, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../pages/CartContext';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart(); // Get cart count from context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative">
      {/* Free shipping banner */}
      <div className="bg-gray-900 text-white text-center py-2 px-4 text-sm font-medium relative">
        FREE SHIPPING ON ORDERS OVER ₹500
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
          ×
        </button>
      </div>

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
          <Link 
            to="/products/category/tshirt" 
            className={`hover:text-red-500 transition-colors ${location.pathname.includes('/tshirt') ? 'text-red-500' : ''}`}
          >
            T-SHIRTS
          </Link>
          <Link 
            to="/products/category/shorts" 
            className={`hover:text-red-500 transition-colors ${location.pathname.includes('/shorts') ? 'text-red-500' : ''}`}
          >
            SHORTS
          </Link>
          <Link 
            to="/products/category/hoodie" 
            className={`hover:text-red-500 transition-colors ${location.pathname.includes('/hoodie') ? 'text-red-500' : ''}`}
          >
            HOODIES
          </Link>
          <Link 
            to="/contact" 
            className={`hover:text-red-500 transition-colors ${location.pathname === '/contact' ? 'text-red-500' : ''}`}
          >
            CONTACT
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            className="text-white hover:text-red-500 transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/account" 
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