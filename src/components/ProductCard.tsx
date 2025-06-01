import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/products/${product.id}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-800 rounded-lg aspect-square">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Product tags */}
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}

          {product.category === 'coming-soon' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">COMING SOON</span>
            </div>
          )}
          
          {/* Quick view button */}
          <div 
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
          >
            <button 
              onClick={handleQuickView}
              className="bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              VIEW DETAILS
            </button>
          </div>

          {/* Wishlist button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${isFavorite ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}
          >
            <Heart size={16} fill={isFavorite ? 'white' : 'none'} />
          </button>
        </div>

        <div className="mt-4 px-1">
          <h3 className="text-lg font-medium text-white">{product.name}</h3>
          <div className="flex items-center mt-1">
            <p className="font-bold text-white">₹{product.price}</p>
            {product.originalPrice && (
              <p className="ml-2 text-gray-500 line-through text-sm">₹{product.originalPrice}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;