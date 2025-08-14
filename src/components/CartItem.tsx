import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    id?: string;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    color?: string;
  };
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="border-b p-4"
  >
    <div className="flex">
      <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300';
          }}
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <button 
            onClick={() => onRemove(item.productId)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        {(item.size || item.color) && (
          <p className="text-sm text-gray-500 mt-1">
            {item.size && `Size: ${item.size}`}
            {item.size && item.color && ' • '}
            {item.color && `Color: ${item.color}`}
          </p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 w-12 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <span className="font-medium">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default CartItem;
