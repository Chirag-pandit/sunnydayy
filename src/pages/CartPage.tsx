"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Gift,
  Truck,
  Shield,
  CreditCard,
  ChevronRight,
  Heart,
} from "lucide-react"

// Import the Header component
import Header from "../components/Header"

// Types
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

interface RecommendedProduct {
  id: number
  name: string
  price: number
  image: string
  isNew?: boolean
}

const CartPage: React.FC = () => {
  // State for cart items (would normally be shared with Header via context or state management)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "StrikeZone Tee",
      price: 1499,
      quantity: 2,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-28_16-57-30-740.jpg-7V2fXbcrm3YNuoEoMewvuDkF6n8bXT.jpeg",
      size: "L",
      color: "Black",
    },
    {
      id: 2,
      name: "Fight Hard Hoodie",
      price: 2999,
      quantity: 1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/T2a.jpg-rpKI56EC6ILseeUa7ppAvSHDWFH6Pc.jpeg",
      size: "M",
      color: "Black",
    },
    {
      id: 3,
      name: "Training Shorts",
      price: 1299,
      quantity: 1,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_24-08-15_11-16-12-417-3T3fYz6jkMMllMME0EgRtGmMsDdpzC.png",
      size: "L",
      color: "Black/Red",
    },
  ])

  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [deliveryOption, setDeliveryOption] = useState("standard")

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
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insomia_hoddie-ifOBUqrK8yIOh9R6CJkFwOkc8lCuAo.webp",
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
  ]

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Functions to manage cart
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "DIWALI") {
      setCouponApplied(true)
      setDiscount(0.15) // 15% discount
    } else if (couponCode.toUpperCase() === "INDIA75") {
      setCouponApplied(true)
      setDiscount(0.2) // 20% discount
    }
  }

  const removeCoupon = () => {
    setCouponApplied(false)
    setDiscount(0)
    setCouponCode("")
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountAmount = subtotal * discount
  const shippingCost = deliveryOption === "express" ? 199 : subtotal > 1999 ? 0 : 99
  const gstAmount = (subtotal - discountAmount) * 0.18
  const total = subtotal - discountAmount + shippingCost + gstAmount

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Include the Header component */}
      <Header />

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8 mt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#FF9933] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-white">Shopping Cart</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Shopping Cart</h1>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-secondary-light/50 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-700 rounded-md"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4 mb-4"></div>
                      <div className="h-8 bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-secondary-light/50 rounded-lg h-96 animate-pulse"></div>
          </div>
        ) : cartItems.length === 0 ? (
          // Empty cart
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF9933]/10 rounded-full mb-6">
              <ShoppingCart size={32} className="text-[#FF9933]" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Explore our collections to find something
              you'll love.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-[#FF9933] text-secondary-dark font-bold rounded-md hover:bg-[#FF9933]/90 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          // Cart with items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-secondary-light/30 backdrop-blur-sm rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading font-bold text-white">Cart Items ({cartItems.length})</h2>
                    <button className="text-sm text-[#FF9933] hover:underline">Clear All</button>
                  </div>

                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        exit="exit"
                        className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-t border-gray-800 group"
                      >
                        {/* Product Image */}
                        <div className="w-full sm:w-20 h-40 sm:h-20 mb-4 sm:mb-0 overflow-hidden rounded-md">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 px-0 sm:px-4">
                          <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#FF9933] transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400 mb-3">
                            {item.size && <span className="mr-3">Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-700 rounded-md overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-secondary-light hover:bg-[#FF9933]/20 text-white transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-secondary-light hover:bg-[#FF9933]/20 text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                              <button className="text-gray-400 hover:text-[#FF9933] transition-colors">
                                <Heart size={18} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 sm:mt-0 w-full sm:w-auto text-right">
                          <p className="text-[#FF9933] font-bold text-lg">{formatPrice(item.price)}</p>
                          <p className="text-sm text-gray-400">
                            {item.quantity > 1 && `${formatPrice(item.price)} each`}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Delivery Options */}
              <motion.div variants={itemVariants} className="bg-secondary-light/30 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-heading font-bold text-white mb-4">Delivery Options</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border border-gray-800 rounded-md cursor-pointer hover:border-[#FF9933]/50 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        value="standard"
                        checked={deliveryOption === "standard"}
                        onChange={() => setDeliveryOption("standard")}
                        className="mr-3 accent-[#FF9933]"
                      />
                      <div>
                        <p className="font-medium text-white">Standard Delivery</p>
                        <p className="text-sm text-gray-400">3-5 business days</p>
                      </div>
                    </div>
                    <span className="text-white font-medium">{subtotal > 1999 ? "Free" : formatPrice(99)}</span>
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-800 rounded-md cursor-pointer hover:border-[#FF9933]/50 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        value="express"
                        checked={deliveryOption === "express"}
                        onChange={() => setDeliveryOption("express")}
                        className="mr-3 accent-[#FF9933]"
                      />
                      <div>
                        <p className="font-medium text-white">Express Delivery</p>
                        <p className="text-sm text-gray-400">1-2 business days</p>
                      </div>
                    </div>
                    <span className="text-white font-medium">{formatPrice(199)}</span>
                  </label>
                </div>
              </motion.div>

              {/* Recommended Products */}
              <motion.div variants={itemVariants} className="bg-secondary-light/30 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-heading font-bold text-white mb-6">You May Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group block rounded-md overflow-hidden transition-transform hover:scale-105"
                    >
                      <div className="relative aspect-square overflow-hidden bg-secondary-light">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.isNew && (
                          <span className="absolute top-2 right-2 bg-[#FF9933] text-secondary-dark text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="text-sm font-medium text-white truncate group-hover:text-[#FF9933] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[#FF9933] font-bold text-sm">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-secondary-light/30 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-heading font-bold text-white mb-6">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal ({cartItems.length} items)</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-green-400">
                      <span className="flex items-center">
                        Discount
                        <button onClick={removeCoupon} className="ml-2 text-xs text-gray-400 hover:text-[#FF9933]">
                          Remove
                        </button>
                      </span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-white">
                      {deliveryOption === "express" ? formatPrice(199) : subtotal > 1999 ? "Free" : formatPrice(99)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-300">GST (18%)</span>
                    <span className="text-white">{formatPrice(gstAmount)}</span>
                  </div>

                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#FF9933] text-xl">{formatPrice(total)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">(Including {formatPrice(gstAmount)} in taxes)</p>
                  </div>
                </div>

                {/* Coupon Code */}
                {!couponApplied && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-300 mb-2">Have a coupon code?</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-secondary border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9933]"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">Try "DIWALI" for 15% off or "INDIA75" for 20% off</div>
                  </div>
                )}

                {/* Checkout Button */}
                <button className="w-full mt-6 bg-[#FF9933] hover:bg-[#FF9933]/90 text-secondary-dark font-bold py-3 rounded-md transition-all duration-300 hover:scale-105 active:scale-95">
                  PROCEED TO CHECKOUT
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="flex items-center justify-center w-full mt-4 py-2 text-gray-300 hover:text-[#FF9933] transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF9933]/10 flex items-center justify-center mr-3">
                        <Shield size={16} className="text-[#FF9933]" />
                      </div>
                      <span className="text-xs text-gray-300">Secure Checkout</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF9933]/10 flex items-center justify-center mr-3">
                        <Truck size={16} className="text-[#FF9933]" />
                      </div>
                      <span className="text-xs text-gray-300">Fast Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF9933]/10 flex items-center justify-center mr-3">
                        <Gift size={16} className="text-[#FF9933]" />
                      </div>
                      <span className="text-xs text-gray-300">Easy Returns</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF9933]/10 flex items-center justify-center mr-3">
                        <CreditCard size={16} className="text-[#FF9933]" />
                      </div>
                      <span className="text-xs text-gray-300">Secure Payment</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 flex justify-center space-x-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/196/196566.png"
                    alt="Visa"
                    className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
                    alt="Mastercard"
                    className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/196/196565.png"
                    alt="PayPal"
                    className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/349/349221.png"
                    alt="UPI"
                    className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
