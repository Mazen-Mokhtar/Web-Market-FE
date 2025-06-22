'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, FolderOpen, ChevronRight, Globe } from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  logo: {
    secure_url: string;
    public_id: string;
  };
  websiteCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            تصفح الفئات
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            اكتشف مجموعة متنوعة من المواقع المصنفة حسب الفئات المختلفة
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
            <input
              type="text"
              placeholder="البحث في الفئات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-dark-800 rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-dark-700 rounded-lg mb-4 mx-auto"></div>
                <div className="h-4 bg-dark-700 rounded mb-2"></div>
                <div className="h-3 bg-dark-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-dark-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد فئات</h3>
            <p className="text-dark-400">لم يتم العثور على فئات تطابق بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                href={`/websites?category=${category._id}`}
                className="group bg-dark-800 rounded-xl p-6 text-center card-hover border border-dark-700 hover:border-red-500 transition-all duration-300"
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
                {category.websiteCount !== undefined && (
                  <p className="text-dark-400 text-sm mb-3">
                    {category.websiteCount} موقع
                  </p>
                )}
                <div className="flex items-center justify-center text-dark-400 group-hover:text-red-400 transition-colors">
                  <span className="text-sm">عرض المواقع</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Popular Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">الفئات الشائعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">مواقع التجارة الإلكترونية</h3>
                  <p className="text-dark-400 text-sm">متاجر إلكترونية متكاملة</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">مواقع الشركات</h3>
                  <p className="text-dark-400 text-sm">مواقع احترافية للشركات</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">المدونات</h3>
                  <p className="text-dark-400 text-sm">منصات نشر المحتوى</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}