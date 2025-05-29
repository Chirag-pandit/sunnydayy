import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import SunnyDayLogo from './SunnyDayLogo';
import { contactInfo } from '../data/products';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-dark text-gray-100 pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1 - About */}
          <div>
            <SunnyDayLogo className="mb-4" />
            <p className="mb-4">
              Premium MMA gear designed for fighters, by fighters. 
              Built to withstand the toughest training sessions and fights.
            </p>
            <div className="flex space-x-4">
              <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-xl font-heading mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=tshirts" className="hover:text-primary transition-colors">T-Shirts</Link>
              </li>
              <li>
                <Link to="/products?category=shorts" className="hover:text-primary transition-colors">Shorts</Link>
              </li>
              <li>
                <Link to="/products?category=hoodies" className="hover:text-primary transition-colors">Hoodies</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="text-xl font-heading mb-4 uppercase">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">Shipping Information</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-primary transition-colors">Size Guide</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-xl font-heading mb-4 uppercase">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-primary flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-primary flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center">
                <Instagram size={20} className="mr-2 text-primary flex-shrink-0" />
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @sunnydayofficials
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SunnyDay MMA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;