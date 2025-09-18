import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  sortOrder?: number;
  isActive?: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const DynamicCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const categoriesData = data.categories || data || [];
        
        // Filter active categories and sort by sortOrder
        const activeCategories = categoriesData
          .filter((cat: Category) => cat.isActive !== false)
          .sort((a: Category, b: Category) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
        setCategories(activeCategories);
        console.log('Fetched categories:', activeCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <div className="text-center">
            <div className="text-xl text-gray-400">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <div className="text-center">
            <div className="text-xl text-red-400">Error loading categories: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <div className="text-center">
            <div className="text-xl text-gray-400">No categories available</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary-dark">
      <div className="container">
        <motion.h2 
          className="section-title text-center mb-12"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <span className="text-primary">FIGHT</span> READY GEAR
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div 
              key={category._id}
              className="group relative overflow-hidden rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-96 overflow-hidden">
                <img 
                  src={category.image || `https://picsum.photos/seed/${category.slug}/400/300.jpg`} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/seed/${category.slug}/400/300.jpg`;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">{category.name}</h3>
                <p className="text-gray-100 mb-4">{category.description}</p>
                <Link 
                  to={`/products?category=${category.slug}`} 
                  className="inline-flex items-center text-primary font-heading hover:text-primary-light transition-colors"
                >
                  SHOP {category.name.toUpperCase()} <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicCategories;
