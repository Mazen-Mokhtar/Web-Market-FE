'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink,
  DollarSign,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Website {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: string;
  status: string;
  technologies: string[];
  viewsCount: number;
  isResponsive: boolean;
  hasAdminPanel: boolean;
  hasDatabase: boolean;
  mainImage: {
    secure_url: string;
    public_id: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  const websiteTypes = [
    'ecommerce',
    'blog',
    'portfolio',
    'corporate',
    'landing',
    'dashboard',
    'other'
  ];

  const websiteStatuses = [
    'available',
    'sold',
    'reserved'
  ];

  useEffect(() => {
    fetchWebsites();
  }, [searchTerm, typeFilter, statusFilter]);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(buildApiUrl(`/websites?${params.toString()}`), {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWebsites(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to fetch websites');
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast.error('Failed to fetch websites');
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/websites/${websiteId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Website deleted successfully');
        fetchWebsites();
      } else {
        toast.error('Failed to delete website');
      }
    } catch (error) {
      console.error('Error deleting website:', error);
      toast.error('Failed to delete website');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'text-green-400 bg-green-900/30';
      case 'sold':
        return 'text-red-400 bg-red-900/30';
      case 'reserved':
        return 'text-yellow-400 bg-yellow-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      ecommerce: 'text-blue-400 bg-blue-900/30',
      blog: 'text-green-400 bg-green-900/30',
      portfolio: 'text-purple-400 bg-purple-900/30',
      corporate: 'text-orange-400 bg-orange-900/30',
      landing: 'text-pink-400 bg-pink-900/30',
      dashboard: 'text-cyan-400 bg-cyan-900/30',
      other: 'text-gray-400 bg-gray-900/30'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Website Management</h1>
              <p className="text-dark-300">Manage all websites in your marketplace</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-dark-400">
                <Globe size={20} />
                <span>{websites.length} websites</span>
              </div>
              <button
                onClick={() => router.push('/admin/websites/create')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Types</option>
              {websiteTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Status</option>
              {websiteStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setStatusFilter('');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Websites Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-dark-400">Loading websites...</p>
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-dark-400 mb-4" />
            <p className="text-dark-400 mb-4">No websites found</p>
            <button
              onClick={() => router.push('/admin/websites/create')}
              className="btn-primary"
            >
              Add First Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <div
                key={website._id}
                className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-red-500 transition-colors"
              >
                {/* Website Image */}
                <div className="relative h-48 bg-dark-700">
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
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(website.status)}`}>
                      {website.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(website.type)}`}>
                      {website.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-red-400 font-semibold text-sm">
                      {formatCurrency(website.price)}
                    </span>
                  </div>
                </div>

                {/* Website Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-lg truncate">{website.name}</h3>
                    <div className="flex items-center text-dark-400 text-sm">
                      <Eye size={14} className="mr-1" />
                      {website.viewsCount}
                    </div>
                  </div>

                  <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                    {website.description}
                  </p>

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

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 text-xs text-dark-400">
                    <div className="flex items-center">
                      <User size={12} className="mr-2" />
                      <span>{website.createdBy?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag size={12} className="mr-2" />
                      <span>{website.categoryId?.name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-2" />
                      <span>{formatDate(website.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/websites/${website.slug}`)}
                      className="flex-1 bg-dark-700 text-white text-center py-2 px-3 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => router.push(`/admin/websites/edit/${website._id}`)}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteWebsite(website._id)}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={14} />
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