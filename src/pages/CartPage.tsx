import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useCart, calculateCartTotal } from "../context/CartContext";
import EmptyCart from "../components/EmptyCart";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { api } from "../api/client";

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
}

const CartPage: React.FC = () => {

  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartCount,
    addToCart
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [defaultAddress, setDefaultAddress] = useState<null | {
    id: string;
    name: string;
    phone?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  }>(null);

  // Calculate cart totals
  const subtotal = calculateCartTotal(cartItems);
  const shipping = subtotal > 1000 ? 0 : deliveryOption === "express" ? 199 : 99;
  const gstAmount = subtotal * 0.18;
  const total = subtotal + shipping + gstAmount - discount;

  // Load default address from backend
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const data = await api<{ addresses: any[] }>("/addresses");
        let list = (data.addresses || []).map((a: any) => ({
          id: a._id,
          name: a.name,
          phone: a.phone,
          street: a.street,
          city: a.city,
          state: a.state,
          zipCode: a.zipCode,
          country: a.country ?? "India",
          isDefault: !!a.isDefault,
        }));
        // Fallback: if no addresses for current user, try pulling legacy 'guest' addresses
        if (!list.length) {
          try {
            const fallback = await api<{ addresses: any[] }>(
              "/addresses",
              { headers: { "x-user-id": "guest" } },
              { userId: "guest" }
            );
            list = (fallback.addresses || []).map((a: any) => ({
              id: a._id,
              name: a.name,
              phone: a.phone,
              street: a.street,
              city: a.city,
              state: a.state,
              zipCode: a.zipCode,
              country: a.country ?? "India",
              isDefault: !!a.isDefault,
            }));
          } catch {}
        }
        console.debug("CartPage: addresses fetched", list);
        const def = list.find((x: any) => x.isDefault) || list[0] || null;
        if (def) setDefaultAddress(def);
      } catch (e) {
        // ignore errors for cart banner
      }
    };
    loadAddress();
  }, []);

  // Recommended products
  const recommendedProducts: RecommendedProduct[] = [
    {
      id: 4,
      name: "MMA Gloves",
      price: 1999,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goku-8mFhEuwTKzwoLBSeFqpMJWhKVotXhw.webp",
      isNew: true,
    },
    {
      id: 5,
      name: "Insomnia Hoodie",
      price: 2499,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insomia_hoddie-ifOBUqrK8yIOh9R6CJkFwOkc8lCuAo.webp",
    },
    {
      id: 6,
      name: "Champion Series Tee",
      price: 1699,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/falling-pnro5EB4y0YZc0KUgH4Y1TbkA76FH9.webp",
    },
    {
      id: 7,
      name: "Street Edge Tee",
      price: 1499,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insomia-4GljPIEfy0rlc2lMq0vMab2jVu2FKz.webp",
      isNew: true,
    },
  ];

  const handleApplyCoupon = (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode === "SUNNY10") {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
    }
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscount(0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Shopping Cart ({cartCount})</h1>
        </div>

        {/* Saved Address Banner */}
        <div className="mb-6">
          {defaultAddress ? (
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Delivery Address</h3>
                <p className="text-sm text-gray-700">
                  {defaultAddress.name}{defaultAddress.phone ? ` · ${defaultAddress.phone}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.zipCode}
                </p>
              </div>
              <Link to="/checkout" className="text-blue-600 hover:underline whitespace-nowrap">Change</Link>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <p className="text-sm text-blue-900">No saved address found. Add your delivery address to speed up checkout.</p>
              <Link to="/checkout" className="text-blue-700 font-medium hover:underline">Add Address</Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Your Items</h2>
                </div>
                
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Delivery Options */}
              <motion.div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Delivery Options</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:border-blue-500">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery-option"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        checked={deliveryOption === "standard"}
                        onChange={() => setDeliveryOption("standard")}
                      />
                      <div className="ml-3">
                        <p className="font-medium">Standard Delivery</p>
                        <p className="text-sm text-gray-500">3-5 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {subtotal > 1999 ? "Free" : "₹99"}
                    </span>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:border-blue-500">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery-option"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        checked={deliveryOption === "express"}
                        onChange={() => setDeliveryOption("express")}
                      />
                      <div className="ml-3">
                        <p className="font-medium">Express Delivery</p>
                        <p className="text-sm text-gray-500">1-2 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {subtotal > 1999 ? "Free" : "₹199"}
                    </span>
                  </label>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Order Summary */}
          <div>
            <OrderSummary
              subtotal={subtotal}
              itemCount={cartCount}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              discount={discount}
              couponApplied={couponApplied}
              shipping={shipping}
              gstAmount={gstAmount}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;