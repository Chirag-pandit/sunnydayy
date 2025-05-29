import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    isNew?: boolean;
    description: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const flipVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const hoverVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="relative perspective"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      variants={hoverVariants}
      whileHover="hover"
    >
      <motion.div
        className="w-full h-full"
        animate={isFlipped ? "back" : "front"}
        variants={flipVariants}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div className="product-card relative">
          <div 
            className="relative overflow-hidden cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-110"
            />
            {product.isNew && (
              <span className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}
          </div>

          <div className="p-4">
            <Link to={`/products/${product.id}`}>
              <h3 className="font-heading text-lg font-bold text-gray-100 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <span className="font-bold text-primary text-lg">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through ml-2">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-secondary-light text-gray-300 hover:text-primary transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-2 rounded-full bg-primary text-secondary-dark hover:bg-primary-dark transition-colors">
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 product-card [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div 
            className="relative h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <img 
              src={product.images?.[1] || product.image} 
              alt={`${product.name} back view`}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-90">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-heading text-lg font-bold text-primary mb-2">
                  Product Details
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  {product.description}
                </p>
                <Link 
                  to={`/products/${product.id}`}
                  className="btn-primary text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;