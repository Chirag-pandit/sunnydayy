import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import SunnyDayLogo from './SunnyDayLogo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-secondary-dark shadow-lg' : 'bg-secondary'
    }`}>
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="SunnyDay Home">
            <SunnyDayLogo className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/products" className={({isActive}) => 
              `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
            >
              SHOP ALL
            </NavLink>
            <NavLink to="/products?category=tshirts" className={({isActive}) => 
              `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
            >
              T-SHIRTS
            </NavLink>
            <NavLink to="/products?category=shorts" className={({isActive}) => 
              `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
            >
              SHORTS
            </NavLink>
            <NavLink to="/products?category=hoodies" className={({isActive}) => 
              `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
            >
              HOODIES
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => 
              `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
            >
              CONTACT
            </NavLink>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-100 hover:text-primary transition-colors" aria-label="Search">
              <Search />
            </button>
            <Link to="/account" className="text-gray-100 hover:text-primary transition-colors" aria-label="Account">
              <User />
            </Link>
            <Link to="/cart" className="text-gray-100 hover:text-primary transition-colors relative" aria-label="Cart">
              <ShoppingCart />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-100 hover:text-primary transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary-dark">
          <nav className="container py-4 flex flex-col space-y-4">
            <NavLink 
              to="/products" 
              className={({isActive}) => `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
              onClick={closeMenu}
            >
              SHOP ALL
            </NavLink>
            <NavLink 
              to="/products?category=tshirts" 
              className={({isActive}) => `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
              onClick={closeMenu}
            >
              T-SHIRTS
            </NavLink>
            <NavLink 
              to="/products?category=shorts" 
              className={({isActive}) => `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
              onClick={closeMenu}
            >
              SHORTS
            </NavLink>
            <NavLink 
              to="/products?category=hoodies" 
              className={({isActive}) => `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
              onClick={closeMenu}
            >
              HOODIES
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({isActive}) => `nav-link ${isActive ? 'text-primary' : 'text-gray-100'}`}
              onClick={closeMenu}
            >
              CONTACT
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;