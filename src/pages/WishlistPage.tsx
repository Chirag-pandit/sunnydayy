// src/pages/WishlistPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../pages/WishlistContext';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-8">
          <Link
            to="/products"
            className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Products
          </Link>
        </div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-3xl font-bold text-gray-100 mb-8">Your Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gray-500 mb-4" />
              <h2 className="text-xl text-gray-300 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-4">Save your favorite items here for later</p>
              <Link
                to="/products"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded font-medium hover:bg-red-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-md relative group"
                >
                  <Link to={`/products/${product.id}`} className="block">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </Link>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-medium text-gray-100 hover:text-red-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={20} fill="currentColor" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <span className="font-bold text-red-500">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;