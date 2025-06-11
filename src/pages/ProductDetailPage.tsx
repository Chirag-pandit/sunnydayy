"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, ChevronDown, Truck, Shield } from "lucide-react"
import { useCart } from "./CartContext"
import { useWishlist } from "./WishlistContext"

// Product interface - defines the structure of each product object
interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  stock: number
  inStock: boolean
  isNew: boolean
  description: string
  images: string[]
  colors: string[]
  sizes: string[]
}

// Updated product data with your new t-shirt designs
const allProducts: Product[] = [
  // ORIGINAL T-SHIRTS
  {
    id: 1,
    name: "Classic Fight T-Shirt",
    category: "tshirt",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    stock: 15,
    inStock: true,
    isNew: true,
    description: "Premium cotton blend t-shirt perfect for training and casual wear.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-03_17-11-50-568.jpg-0FUnC5c9RAjGh15NrvAbYs5vsElpfM.jpeg",
    ],
    colors: ["Black", "White", "Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 6,
    name: "Falling Down Artistic T-Shirt",
    category: "tshirt",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.7,
    stock: 20,
    inStock: true,
    isNew: true,
    description: "Artistic design featuring classical renaissance-inspired artwork with modern streetwear aesthetics.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/falling-5fyuP3YQiIFxqXTyT2HaKK5gTiNTC0.webp", // Your "Falling Down" design
      
    ],
    colors: ["White", "Black", "Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    name: "Art & Nobility",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-03_23-40-22-118.jpg-plaVeR8SPC6FC1EpeP3sLLQMpdvoJW.jpeg"
    ],
    price: 32.99,
    category: "tshirt",
    rating: 4.5,
    stock: 15,
    inStock: true,
    isNew: true,
    description: "Artistic design featuring classical renaissance-inspired artwork.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Ornate Skull",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Skull.jpg-iwI6EzGKoQbn8R1iu9jV7ZMUqfPjBG.jpeg"
    ],
    price: 36.99,
    category: "tshirt",
    rating: 4.6,
    stock: 12,
    inStock: true,
    isNew: false,
    description: "Bold skull design with ornate details.",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    name: "MMA Red",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/T3c.jpg-AbM8E8w5WC4RoYa7duKINBXTXg9lyk.jpeg"
    ],
    price: 31.99,
    category: "tshirt",
    rating: 4.7,
    stock: 18,
    inStock: true,
    isNew: true,
    description: "Dynamic MMA-inspired design in striking red.",
    colors: ["Red", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 6,
    name: "Paint Stripes",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/T4b.jpg-PnuWOr269QBrh13iBKHbIilRdoenCz.jpeg"
    ],
    price: 33.99,
    category: "tshirt",
    rating: 4.4,
    stock: 20,
    inStock: true,
    isNew: false,
    description: "Abstract paint stripe design for the modern artist.",
    colors: ["White", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 7,
    name: "Travis Scott",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/travis-vcvW3YVsQJxKvOSfD6Kfd9yPUj0eMk.webp"
    ],
    price: 39.99,
    category: "tshirt",
    rating: 4.8,
    stock: 10,
    inStock: true,
    isNew: true,
    description: "Travis Scott inspired design with unique aesthetics.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 7,
    name: "Ultra Instinct Goku T-Shirt",
    category: "tshirt",
    price: 32.99,
    rating: 4.8,
    stock: 25,
    inStock: true,
    isNew: true,
    description: "Epic Dragon Ball Z inspired design featuring Goku in Ultra Instinct form with dynamic artwork.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goku-Dptsqo8pfS7rFuGZTnUZquIkn6G0T8.webp", // Your Goku design
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goku-Dptsqo8pfS7rFuGZTnUZquIkn6G0T8.webp",
    ],
    colors: ["Black", "Navy", "Dark Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 8,
    name: "Insomnia Streetwear T-Shirt",
    category: "tshirt",
    price: 36.99,
    rating: 4.6,
    stock: 18,
    inStock: true,
    isNew: true,
    description: "Bold streetwear design with masked figure and striking red typography for the urban warrior.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insomia-WnfxV33Dtonn4oAAn60p26ixsqlvrK.webp", // Your Insomnia design
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insomia-WnfxV33Dtonn4oAAn60p26ixsqlvrK.webp",
    ],
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 9,
    name: "Brazilian Jiu-Jitsu Flag T-Shirt",
    category: "tshirt",
    price: 31.99,
    rating: 4.5,
    stock: 22,
    inStock: true,
    isNew: false,
    description: "Show your BJJ pride with this Brazilian flag-inspired design perfect for training and casual wear.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_24-08-09_20-23-50-344.jpg-kW7kgYBLLZtlWJlIIsKP3PgyS0OKN0.jpeg", // Your Brazilian Jiu-Jitsu design
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_24-08-09_20-23-50-344.jpg-kW7kgYBLLZtlWJlIIsKP3PgyS0OKN0.jpeg",
    ],
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 10,
    name: "Fight Hard Boxing T-Shirt",
    category: "tshirt",
    price: 33.99,
    rating: 4.7,
    stock: 16,
    inStock: true,
    isNew: false,
    description: "Motivational boxing design with detailed glove artwork and inspiring message for fighters.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-01_10-00-19-353.jpg-MprUP65nK772t1t3HDu0RxOanxw3ia.jpeg", // Your Fight Hard boxing design
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-01_10-00-19-353.jpg-MprUP65nK772t1t3HDu0RxOanxw3ia.jpeg",
    ],
    colors: ["Black", "Dark Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 11,
    name: "UFC Fighter Silhouette T-Shirt",
    category: "tshirt",
    price: 35.99,
    rating: 4.6,
    stock: 14,
    inStock: true,
    isNew: false,
    description: "Iconic UFC fighter silhouette design capturing the intensity and power of mixed martial arts.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-10_23-21-49-542.jpg-vCWZE0f6CCVXjrb6zUjyGWTOD7d7PD.jpeg", // Your UFC fighter design
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-10_23-21-49-542.jpg-vCWZE0f6CCVXjrb6zUjyGWTOD7d7PD.jpeg",
    ],
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  // OTHER CATEGORIES (Hoodies and Shorts)
  {
    id: 18,
    name: "Dark Block Insomnia",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insomia_hoddie-ebFCVkMILypdCuUhRhVqJXOBUhCl7S.webp"
    ],
    price: 65.99,
    category: "hoodie",
    rating: 4.7,
    stock: 15,
    inStock: true,
    isNew: true,
    description: "Dark block design hoodie with insomnia theme.",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 19,
    name: "Sanji Flame Circle",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sanji-JW9l5yxbdM8RceKezOlhB7WSJx8Y1p.webp"
    ],
    price: 69.99,
    category: "hoodie",
    rating: 4.8,
    stock: 12,
    inStock: true,
    isNew: true,
    description: "One Piece inspired Sanji flame circle design hoodie.",
    colors: ["Black", "Red"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 20,
    name: "Demon Mask Sukuna",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sukunja-lGPN2neITGBpZmm6rOqvw6bnAUwWtF.webp"
    ],
    price: 72.99,
    category: "hoodie",
    rating: 4.9,
    stock: 10,
    inStock: true,
    isNew: true,
    description: "Jujutsu Kaisen inspired Sukuna demon mask hoodie.",
    colors: ["Black", "Red"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 21,
    name: "Zenitsu Thunder",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zenitus-sF1vyLtnZlEv2xjFh1fPpMe3J55rbZ.webp"
    ],
    price: 68.99,
    category: "hoodie",
    rating: 4.6,
    stock: 14,
    inStock: true,
    isNew: true,
    description: "Demon Slayer inspired Zenitsu thunder design hoodie.",
    colors: ["Black", "Yellow"],
    sizes: ["S", "M", "L", "XL"]
  },
  //shorts.....................
  {
    id: 8,
    name: "SYD MMA Pro",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-04_11-40-14-436.jpg-aikU6xUkJKcLhGdrqXIdL7yudg2VzQ.jpeg"
    ],
    price: 45.99,
    category: "shorts",
    rating: 4.5,
    stock: 15,
    inStock: true,
    isNew: true,
    description: "Professional MMA shorts with premium design.",
    colors: ["Black", "Red"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 9,
    name: "Fire Fighter",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-04_11-41-50-263.jpg-RZpJo8OKcOv0pskl6xApApFB48Uoy0.jpeg"
    ],
    price: 42.99,
    category: "shorts",
    rating: 4.6,
    stock: 12,
    inStock: true,
    isNew: false,
    description: "Bold fire-inspired design shorts.",
    colors: ["Black", "Orange"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 10,
    name: "Tiger Crown",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-31_14-52-53-537.jpg-vbA9bCRImUzb8n4ojh0dAIW7e0a6nH.jpeg"
    ],
    price: 38.99,
    category: "shorts",
    rating: 4.7,
    stock: 18,
    inStock: true,
    isNew: true,
    description: "Royal tiger design shorts with crown motif.",
    colors: ["Black", "Gold"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 11,
    name: "Crown Claw",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-31_14-53-59-080.jpg-bxlXb1IIubAiuZL2kvHMpRH1qmnuc0.jpeg"
    ],
    price: 40.99,
    category: "shorts",
    rating: 4.5,
    stock: 20,
    inStock: true,
    isNew: false,
    description: "Fierce crown and claw design shorts.",
    colors: ["Black", "Silver"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 12,
    name: "Royal Crown",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-31_17-01-25-544.jpg-xL6QXE5q6S4jGer6ATjfvPa0Kwbbcw.jpeg"
    ],
    price: 35.99,
    category: "shorts",
    rating: 4.4,
    stock: 15,
    inStock: true,
    isNew: true,
    description: "Elegant royal crown design shorts.",
    colors: ["Black", "Purple"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 13,
    name: "Tiger Roar",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-03_16-22-07-555.jpg-YZLcfGsV5qoRsEVTeXGgSA6vLYsJl9.jpeg"
    ],
    price: 44.99,
    category: "shorts",
    rating: 4.8,
    stock: 10,
    inStock: true,
    isNew: true,
    description: "Dynamic tiger roar design shorts.",
    colors: ["Black", "Orange"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 14,
    name: "Lightning Tiger",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-05-31_14-55-12-738.jpg-V9ZTj87cUKvYEgcwrwScDa8sq5Etx2.jpeg"
    ],
    price: 43.99,
    category: "shorts",
    rating: 4.6,
    stock: 12,
    inStock: true,
    isNew: false,
    description: "Electrifying lightning tiger design shorts.",
    colors: ["Black", "Blue"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 15,
    name: "School Kills Artists Barbed",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-03_16-49-53-612.jpg-uJl6FtmGSQI96Yc27UXpCEwtv1oVWU.jpeg"
    ],
    price: 41.99,
    category: "shorts",
    rating: 4.7,
    stock: 8,
    inStock: true,
    isNew: true,
    description: "Edgy barbed wire design shorts.",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 16,
    name: "School Kills Artists Classic",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-03_16-43-03-079.jpg-4N5qCo1dICKAjdJfRzH2wTwmyOLoQx.jpeg"
    ],
    price: 39.99,
    category: "shorts",
    rating: 4.5,
    stock: 15,
    inStock: true,
    isNew: false,
    description: "Classic artistic design shorts.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 17,
    name: "Sypdy Signature",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-03_17-08-17-546.jpg-RFjwvTT74S72WZ2iVgZzGK8oRU3f3M.jpeg"
    ],
    price: 37.99,
    category: "shorts",
    rating: 4.6,
    stock: 20,
    inStock: true,
    isNew: true,
    description: "Signature design shorts with unique style.",
    colors: ["Black", "Red"],
    sizes: ["S", "M", "L", "XL"]
  },
  
]

// Animation configuration for smooth page transitions
const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

const ProductDetailPage: React.FC = () => {
  // React Router hooks for navigation and URL parameters
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Custom hooks for cart and wishlist functionality
  const { cartItems, addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Convert URL parameter to number and find the product
  const productId = id ? Number.parseInt(id) : null
  const product = allProducts.find((p) => p.id === productId)

  // State management for product customization and UI
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState<string>("")
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Effect hook to initialize component state when product changes
  useEffect(() => {
    window.scrollTo(0, 0) // Scroll to top when product changes

    // Redirect to products page if product not found
    if (!product && id) {
      navigate("/products")
      return
    }

    // Initialize default selections when product loads
    if (product) {
      setSelectedColor(product.colors[0])
      setSelectedSize(product.sizes[0])
      setMainImage(product.images[0])
    }
  }, [product, id, navigate])

  // Handle adding product to cart with loading state
  const handleAddToCart = () => {
    if (!product) return

    setIsAddingToCart(true)

    // Add product to cart with selected options
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    })

    // Reset loading state after animation
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  // Handle wishlist toggle functionality
  const handleWishlistToggle = () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
      })
    }
  }

  // Show error page if product not found
  if (!product) {
    return (
      <div className="bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Product not found</h2>
          <Link
            to="/products"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded font-medium hover:bg-red-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Find related products in the same category (excluding current product)
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  // Navigation logic for previous/next products
  const currentIndex = allProducts.findIndex((p) => p.id === productId)
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null
  const nextProduct = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null

  // Handle quantity selection change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number.parseInt(e.target.value))
  }

  // Toggle size chart visibility
  const toggleSizeChart = () => {
    setShowSizeChart(!showSizeChart)
  }

  // Size chart data for reference
  const sizeChart = {
    S: '34-36" Chest',
    M: '38-40" Chest',
    L: '42-44" Chest',
    XL: '46-48" Chest',
    XXL: '50-52" Chest',
  }

  // Shipping information
  const shippingInfo = "FREE shipping on orders over ₹50. Standard shipping 3-5 business days."

  // Check if current product configuration is already in cart
  const isInCart = cartItems.some(
    (item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor,
  )

  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Navigation Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Products
          </button>
        </div>

        {/* Main Product Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={mainImage || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border-2 ${
                    mainImage === img ? "border-red-500" : "border-transparent"
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Product Title and Wishlist */}
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-100">{product.name}</h1>
                <button
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    size={24}
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                    className={isInWishlist(product.id) ? "text-red-500" : ""}
                  />
                </button>
              </div>

              {/* Rating and Product Badges */}
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= Math.floor(product.rating) ? "currentColor" : "none"}
                      className={star <= Math.floor(product.rating) ? "text-red-500" : "text-gray-400"}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">{product.rating.toFixed(1)}</span>
                </div>

                {/* Product Status Badges */}
                <div className="flex space-x-2">
                  {product.isNew && (
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                  )}
                  {(product.stock <= 0 || product.inStock === false) && (
                    <span className="bg-gray-700 text-red-500 text-xs font-bold px-2 py-1 rounded">
                      {product.stock <= 0 ? "OUT OF STOCK" : "COMING SOON"}
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="flex items-center mt-4">
                <span className="text-3xl font-bold text-red-500">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through ml-3">₹{product.originalPrice.toFixed(2)}</span>
                )}
                {product.originalPrice && (
                  <span className="ml-3 text-green-500">
                    Save ₹{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <p className="text-gray-300">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-gray-100 font-medium mb-2">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? "border-red-500 text-red-500"
                        : "border-gray-600 text-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection with Chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-100 font-medium">Size:</h3>
                <button className="text-red-500 text-sm flex items-center" onClick={toggleSizeChart}>
                  Size Chart
                  <ChevronDown size={16} className={`ml-1 transition-transform ${showSizeChart ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Size Chart Modal */}
              {showSizeChart && (
                <div className="bg-gray-800 p-4 rounded-md mb-4">
                  <h4 className="text-gray-100 font-medium mb-2">Size Chart</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300 text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2 text-left">Size</th>
                          <th className="py-2 text-left">Measurement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sizeChart).map(([size, measurement]) => (
                          <tr key={size} className="border-b border-gray-700">
                            <td className="py-2">{size}</td>
                            <td className="py-2">{measurement}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Size Selection Buttons */}
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-red-500 text-red-500"
                        : "border-gray-600 text-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="w-full sm:w-1/3">
                <label htmlFor="quantity" className="block text-gray-100 font-medium mb-2">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full bg-gray-800 text-gray-100 rounded border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                  disabled={product.stock <= 0 || product.inStock === false}
                >
                  {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <div className="w-full sm:w-2/3">
                <button
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded font-medium mt-7 ${
                    product.stock > 0 && product.inStock !== false
                      ? isInCart
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white hover:bg-red-700 transition-colors"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={product.stock <= 0 || product.inStock === false || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    "Adding..."
                  ) : product.stock <= 0 ? (
                    "Out of Stock"
                  ) : product.inStock === false ? (
                    "Coming Soon"
                  ) : isInCart ? (
                    "Added to Cart ✓"
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Shipping and Returns Information */}
            <div className="space-y-3 border-t border-gray-700 pt-6">
              <div className="flex items-start">
                <Truck size={20} className="text-red-500 flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="text-gray-100 font-medium">Shipping</h3>
                  <p className="text-gray-300 text-sm">{shippingInfo}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield size={20} className="text-red-500 flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="text-gray-100 font-medium">Returns</h3>
                  <p className="text-gray-300 text-sm">
                    30-day easy returns.{" "}
                    <a href="#" className="text-red-500">
                      See our return policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Navigation (Previous/Next) */}
        <div className="flex justify-between border-t border-b border-gray-700 py-4 mb-12">
          {prevProduct ? (
            <Link
              to={`/products/${prevProduct.id}`}
              className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
            >
              <ChevronLeft size={20} className="mr-2" />
              <span className="hidden sm:inline">Previous Product:</span>
              <span className="font-medium ml-1">{prevProduct.name}</span>
            </Link>
          ) : (
            <div></div>
          )}

          {nextProduct && (
            <Link
              to={`/products/${nextProduct.id}`}
              className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
            >
              <span className="font-medium mr-1">{nextProduct.name}</span>
              <span className="hidden sm:inline">:Next Product</span>
              <ChevronRight size={20} className="ml-2" />
            </Link>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  {/* Related Product Image */}
                  <Link to={`/products/${relatedProduct.id}`} className="block relative group overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Out of Stock Overlay */}
                    {(relatedProduct.stock <= 0 || relatedProduct.inStock === false) && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <span className="bg-gray-800 text-red-500 text-sm font-bold px-4 py-2 rounded">
                          {relatedProduct.stock <= 0 ? "OUT OF STOCK" : "COMING SOON"}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Related Product Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/products/${relatedProduct.id}`} className="block">
                        <h3 className="font-medium text-gray-100 hover:text-red-500 transition-colors">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <div className="flex space-x-2">
                        {relatedProduct.isNew && (
                          <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                        )}
                        {relatedProduct.originalPrice && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                        )}
                      </div>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="font-bold text-red-500">₹{relatedProduct.price.toFixed(2)}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-gray-400 line-through ml-2">
                            ₹{relatedProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star size={16} fill="currentColor" className="text-red-500 mr-1" />
                        <span className="text-sm text-gray-300">{relatedProduct.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
