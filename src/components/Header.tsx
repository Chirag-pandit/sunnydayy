"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X, ShoppingCart, Search, User, Plus, Minus, Trash2 } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const SunnyDayLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`font-heading font-black text-2xl text-primary ${className}`}>SUNNYDAY</div>
)

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "StrikeZone Tee",
      price: 29.99,
      quantity: 2,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-28_16-57-30-740.jpg-7V2fXbcrm3YNuoEoMewvuDkF6n8bXT.jpeg",
    },
    {
      id: 2,
      name: "Fight Hard Hoodie",
      price: 59.99,
      quantity: 1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/T2a.jpg-rpKI56EC6ILseeUa7ppAvSHDWFH6Pc.jpeg",
    },
  ])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const toggleCart = () => setIsCartOpen(!isCartOpen)

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

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-secondary-dark/95 backdrop-blur-md shadow-2xl border-b border-gray-800"
            : "bg-secondary/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group transition-all duration-300 hover:scale-105"
              aria-label="SunnyDay Home"
            >
              <SunnyDayLogo className="h-10 w-auto group-hover:text-accent transition-colors duration-300" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { to: "/products", label: "SHOP ALL" },
                { to: "/products?category=tshirts", label: "T-SHIRTS" },
                { to: "/products?category=shorts", label: "SHORTS" },
                { to: "/products?category=hoodies", label: "HOODIES" },
                { to: "/contact", label: "CONTACT" },
              ].map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative font-heading font-bold text-sm tracking-wider transition-all duration-300 hover:text-accent group ${
                      isActive ? "text-accent" : "text-gray-100"
                    }`
                  }
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-100 hover:text-accent transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                to="/account"
                className="text-gray-100 hover:text-accent transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              <button
                onClick={toggleCart}
                className="text-gray-100 hover:text-accent transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50 relative group"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-100 hover:text-accent transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-800/50"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute transition-all duration-300 ${
                      isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute transition-all duration-300 ${
                      isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-secondary-dark/95 backdrop-blur-md border-t border-gray-800">
            <nav className="container mx-auto px-6 py-6 flex flex-col space-y-4">
              {[
                { to: "/products", label: "SHOP ALL" },
                { to: "/products?category=tshirts", label: "T-SHIRTS" },
                { to: "/products?category=shorts", label: "SHORTS" },
                { to: "/products?category=hoodies", label: "HOODIES" },
                { to: "/contact", label: "CONTACT" },
              ].map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-heading font-bold text-lg tracking-wider transition-all duration-300 hover:text-accent hover:translate-x-2 ${
                      isActive ? "text-accent" : "text-gray-100"
                    }`
                  }
                  onClick={closeMenu}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: isMenuOpen ? "slideInLeft 0.5s ease-out forwards" : "none",
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${isCartOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            isCartOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={toggleCart}
        />

        {/* Cart Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-secondary-dark border-l border-gray-800 shadow-2xl transform transition-transform duration-500 ease-out ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-heading font-bold text-primary">SHOPPING CART ({getTotalItems()})</h2>
              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-accent transition-colors duration-300 p-2 rounded-full hover:bg-gray-800/50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-gray-800/70"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-primary text-sm">{item.name}</h3>
                        <p className="text-accent font-bold">${item.price.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-700 hover:bg-accent transition-colors duration-300 flex items-center justify-center"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-primary font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-700 hover:bg-accent transition-colors duration-300 flex items-center justify-center"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-error transition-colors duration-300 p-2 rounded-full hover:bg-gray-800/50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-800 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-primary">Total:</span>
                  <span className="text-accent">${getTotalPrice().toFixed(2)}</span>
                </div>
                <button className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  CHECKOUT
                </button>
                <button
                  onClick={toggleCart}
                  className="w-full bg-transparent border border-gray-600 hover:border-accent text-gray-100 hover:text-accent font-bold py-3 rounded-lg transition-all duration-300"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  )
}

export default Header
