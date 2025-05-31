import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  frontImage: string;
  backImage: string;
  category: string;
}

export default function ProductSection() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: "FIGHT READY",
      description: "Gear that performs when it matters most",
      frontImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop",
      category: "VIRAL"
    },
    {
      id: 2,
      name: "STREET VIBES",
      description: "Casual wear with that fighter energy",
      frontImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
      category: "FIRE"
    },
    {
      id: 3,
      name: "TRAINING",
      description: "Equipment for the daily grind",
      frontImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=400&h=400&fit=crop",
      category: "TRENDING"
    },
    // NEW PRODUCTS ADDED BELOW
    {
      id: 4,
      name: "CHAMPION SERIES",
      description: "Wear what champions wear in the ring",
      frontImage: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=400&h=400&fit=crop",
      category: "ELITE"
    },
    {
      id: 5,
      name: "STREET EDGE",
      description: "Urban styles with combat inspiration",
      frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=400&fit=crop",
      category: "HOT"
    },
    {
      id: 6,
      name: "GYM ESSENTIALS",
      description: "Performance gear for serious athletes",
      frontImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1571019614243-c4cd3a119107?w=400&h=400&fit=crop",
      category: "NEW"
    },
    {
      id: 7,
      name: "COMBAT CLASSICS",
      description: "Timeless designs for modern warriors",
      frontImage: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1600185365406-4a33e2bf3d6f?w=400&h=400&fit=crop",
      category: "LEGEND"
    },
    {
      id: 8,
      name: "LIMITED EDITION",
      description: "Exclusive drops you won't find elsewhere",
      frontImage: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=400&fit=crop",
      backImage: "https://images.unsplash.com/photo-1555529669-226e9dd13e0a?w=400&h=400&fit=crop",
      category: "RARE"
    }
  ];

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
              className="product-card bg-gray-800 rounded-lg overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }} // Slightly faster stagger
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-bold">
                  {product.category}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={hoveredProduct === product.id ? product.backImage : product.frontImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  width={400}
                  height={400}
                  loading="lazy"
                />
                
                {/* Shield Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-90">
                  <div className="w-8 h-8 border-2 border-black rounded-full relative">
                    <div className="w-3 h-3 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <button className="w-full bg-white text-black py-3 font-bold rounded hover:bg-gray-200 transition-colors">
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}