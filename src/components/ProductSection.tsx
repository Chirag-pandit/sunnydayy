"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

interface Product {
  id: number
  name: string
  description: string
  frontImage: string
  backImage: string
  category: string
}

export default function ProductSection() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const products: Product[] = [
    {
      id: 1,
      name: "StrikeZone",
      description: "Gear that performs when it matters most",
      frontImage: "https://placehold.co/400x600?text=StrikeZone+Front",
      backImage: "https://placehold.co/400x600?text=StrikeZone+Back",
      category: "VIRAL",
    },
    {
      id: 2,
      name: "FIGHT HARD",
      description: "Casual wear with that fighter energy",
      frontImage: "https://placehold.co/400x600?text=Fight+Hard+Front",
      backImage: "https://placehold.co/400x600?text=Fight+Hard+Back",
      category: "FIRE",
    },
    {
      id: 3,
      name: "INSOMIA HOOD",
      description: "Equipment for the daily grind",
      frontImage: "https://placehold.co/400x600?text=Insomia+Hood+Front",
      backImage: "https://placehold.co/400x600?text=Insomia+Hood+Back",
      category: "TRENDING",
    },
    {
      id: 4,
      name: "TREND WITH TUPACK",
      description: "Wear what champions wear in the ring",
      frontImage: "https://placehold.co/400x600?text=Trend+With+Tupack+Front",
      backImage: "https://placehold.co/400x600?text=Trend+With+Tupack+Back",
      category: "ELITE",
    },
    {
      id: 5,
      name: "ANIME STYLE WITH GOKU",
      description: "Urban styles with combat inspiration",
      frontImage: "https://placehold.co/400x600?text=Anime+Style+Goku+Front",
      backImage: "https://placehold.co/400x600?text=Anime+Style+Goku+Back",
      category: "HOT",
    },
    {
      id: 6,
      name: "CAGE KINGS",
      description: "Born for the Octagon. Built for dominance.",
      frontImage: "https://placehold.co/400x600?text=Cage+Kings+Front",
      backImage: "https://placehold.co/400x600?text=Cage+Kings+Back",
      category: "NEW",
    },
    {
      id: 7,
      name: "SIAM STRIKES",
      description: "Ain't nobody's fool.",
      frontImage: "https://placehold.co/400x600?text=Siam+Strikes+Front",
      backImage: "https://placehold.co/400x600?text=Siam+Strikes+Back",
      category: "LEGEND",
    },
    {
      id: 8,
      name: "MIND OVER MUSCLE",
      description: "Brains hit harder.",
      frontImage: "https://placehold.co/400x600?text=Mind+Over+Muscle+Front",
      backImage: "https://placehold.co/400x600?text=Mind+Over+Muscle+Back",
      category: "RARE",
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            GEAR THAT <span className="text-gray-400">SLAPS</span>
          </h2>
        </div>

        {/* Product Grid - Updated to 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-card bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-white/10 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "both",
              }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10 transform transition-all duration-300 hover:scale-110">
                <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {product.category}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={hoveredProduct === product.id ? product.backImage : product.frontImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform hover:scale-110"
                  width={400}
                  height={400}
                  loading="lazy"
                />

                {/* Shield Icon with smooth animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-90 transition-all duration-500 hover:opacity-100 hover:scale-110 hover:rotate-12">
                  <div className="w-8 h-8 border-2 border-black rounded-full relative transition-all duration-300">
                    <div className="w-3 h-3 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <Link to="products">
              <div className="p-6 transform transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 hover:text-gray-300">
                  {product.name}
                </h3>
                <p className="text-gray-400 mb-4 transition-colors duration-300">{product.description}</p>
                <button className="w-full bg-white text-black py-3 font-bold rounded transition-all duration-300 hover:bg-gray-200 hover:shadow-lg hover:transform hover:scale-105 active:scale-95">
                  SHOP NOW
                </button>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
