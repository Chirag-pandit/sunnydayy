import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm"
      >
        <motion.div 
          className="mx-auto w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShoppingCart className="h-16 w-16 text-blue-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start shopping to find amazing products!</p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  </div>
);

export default EmptyCart;
