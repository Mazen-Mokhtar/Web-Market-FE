'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Eye, ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG, buildApiUrl } from '@/lib/api';

interface Website {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: string;
  mainImage: {
    secure_url: string;
    public_id: string;
  };
  technologies: string[];
  viewsCount: number;
  isResponsive: boolean;
  hasAdminPanel: boolean;
  hasDatabase: boolean;
  categoryId: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const websiteTypes = [
    'ecommerce',
    'blog',
    'portfolio',
    'corporate',
    'landing',
    'dashboard',
    'other'
  ];

  useEffect(() => {
    fetchWebsites();
    fetchCategories();
  }, [searchTerm, selectedCategory, selectedType, sortBy, sortOrder]);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      let url = buildApiUrl(API_CONFIG.ENDPOINTS.WEBSITES.BASE) + '?';
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedType) params.append('type', selectedType);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`${url}${params.toString()}`);
      const data = await response.json();
      setWebsites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching websites:', error);
      setWebsites([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.ALL));
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.documents || data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleContactUs = (websiteName: string) => {
    const message = `Hi! I'm interested in the website: ${websiteName}. Can you provide more details?`;
    const whatsappUrl = API_CONFIG.WHATSAPP.getUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  return (
    <div className="bg-dark-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Browse Websites
          </h1>
          <p className="text-dark-300">
            Discover premium ready-made websites for your business
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Types</option>
              {websiteTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="viewsCount-desc">Most Popular</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Filters
              </button>
              <span className="text-dark-400">
                {websites.length} websites found
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-dark-700 text-dark-400 hover:text-white'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-dark-700 text-dark-400 hover:text-white'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-dark-800 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-dark-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-3 bg-dark-700 rounded mb-4"></div>
                  <div className="h-8 bg-dark-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No websites found</h3>
            <p className="text-dark-400 mb-4">Try adjusting your search criteria</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-6'
          }>
            {websites.map((website) => (
              <div
                key={website._id}
                className={`bg-dark-800 rounded-xl overflow-hidden card-hover border border-dark-700 hover:border-red-500 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative bg-dark-700 ${
                  viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'
                }`}>
                  {website.mainImage?.secure_url ? (
                    <img
                      src={website.mainImage.secure_url}
                      alt={website.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-gradient flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {website.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-red-400 font-semibold text-sm">
                      ${website.price}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-400 text-sm font-medium uppercase">
                      {website.type}
                    </span>
                    <div className="flex items-center text-dark-400 text-sm">
                      <Eye size={14} className="mr-1" />
                      {website.viewsCount}
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2">
                    {website.name}
                  </h3>

                  <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                    {website.description}
                  </p>

                  {/* Category */}
                  {website.categoryId && (
                    <div className="mb-3">
                      <span className="bg-dark-700 text-blue-400 text-xs px-2 py-1 rounded">
                        {website.categoryId.name}
                      </span>
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {website.isResponsive && (
                      <span className="bg-dark-700 text-green-400 text-xs px-2 py-1 rounded">
                        Responsive
                      </span>
                    )}
                    {website.hasAdminPanel && (
                      <span className="bg-dark-700 text-blue-400 text-xs px-2 py-1 rounded">
                        Admin Panel
                      </span>
                    )}
                    {website.hasDatabase && (
                      <span className="bg-dark-700 text-purple-400 text-xs px-2 py-1 rounded">
                        Database
                      </span>
                    )}
                  </div>

                  {/* Technologies */}
                  {website.technologies && website.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {website.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {website.technologies.length > 3 && (
                        <span className="text-dark-400 text-xs px-2 py-1">
                          +{website.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/websites/${website.slug}`}
                      className="flex-1 bg-dark-700 text-white text-center py-2 px-4 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink size={16} />
                      <span>View Details</span>
                    </Link>
                    <button
                      onClick={() => handleContactUs(website.name)}
                      className="btn-primary flex items-center justify-center space-x-2 px-4"
                    >
                      <MessageCircle size={16} />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}