import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ShoppingBag } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-secondary min-h-screen py-20">
      <div className="container">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-secondary-light flex items-center justify-center">
              <AlertTriangle size={48} className="text-primary" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-heading font-extrabold text-primary mb-4">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-100">
            Page Not Found
          </h2>
          
          <p className="text-xl text-gray-300 mb-10">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="btn-primary flex items-center justify-center">
              <Home size={20} className="mr-2" />
              Back to Home
            </Link>
            
            <Link to="/products" className="btn-secondary flex items-center justify-center">
              <ShoppingBag size={20} className="mr-2" />
              Browse Products
            </Link>
          </div>
          
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-secondary px-4 text-gray-400">
                Or try searching for what you need
              </span>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                className="flex-grow px-4 py-3 bg-secondary-light border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search for products..."
              />
              <button className="px-6 bg-primary text-secondary-dark rounded-r-md font-heading hover:bg-primary-dark transition-colors">
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;