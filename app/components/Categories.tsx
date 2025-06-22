'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/useSectionInView';

interface Category {
  _id: string;
  name: string;
  slug: string;
  logo: {
    secure_url: string;
    public_id: string;
  };
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isInView } = useSectionInView({ threshold: 0.2 });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.ALL));
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.documents || data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-dark-900 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-dark-800 rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-dark-700 rounded-lg mb-4 mx-auto"></div>
                <div className="h-4 bg-dark-700 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-dark-900 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-dark-300 text-lg">
            Find the perfect website for your industry
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category._id}
              href={`/websites?category=${category._id}`}
              className="group bg-dark-800 rounded-xl p-6 text-center card-hover border border-dark-700 hover:border-red-500"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-dark-700">
                {category.logo?.secure_url ? (
                  <img
                    src={category.logo.secure_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-red-400 transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center justify-center text-dark-400 group-hover:text-red-400 transition-colors">
                <span className="text-sm">View Websites</span>
                <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories" className="btn-secondary">
            View All Categories
          </Link>
        </div>
      </div>
    </motion.section>
  );
}