import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { getPrimaryImage } from "../utils/imageUtils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sizes?: string[];
    colors?: string[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: getPrimaryImage(product.images),
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image + Wishlist */}
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={getPrimaryImage(product.images)}
            alt={product.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/800x800?text=Product';
            }}
          />
        </Link>
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <Heart
            size={20}
            className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-500"}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        </Link>
        <p className="text-red-500 font-bold mt-1">₹{product.price}</p>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddToCart}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1 text-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
