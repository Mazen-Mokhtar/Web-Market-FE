'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink,
  DollarSign,
  Calendar,
  Tag,
  TrendingUp,
  Users,
  Heart,
  MessageCircle
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
  likes: string[];
  createdAt: string;
}

export default function MyWebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
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
    checkAuthAndFetchWebsites();
  }, []);

  const checkAuthAndFetchWebsites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً');
        router.push('/login');
        return;
      }

      await fetchMyWebsites();
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('حدث خطأ في التحقق من الهوية');
      router.push('/login');
    }
  };

  const fetchMyWebsites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl('/websites/my-websites'), {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWebsites(Array.isArray(data) ? data : []);
      } else {
        toast.error('فشل في تحميل المواقع');
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast.error('حدث خطأ في تحميل المواقع');
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموقع؟')) return;

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
        toast.success('تم حذف الموقع بنجاح');
        fetchMyWebsites();
      } else {
        toast.error('فشل في حذف الموقع');
      }
    } catch (error) {
      console.error('Error deleting website:', error);
      toast.error('حدث خطأ في حذف الموقع');
    }
  };

  const handleContactUs = (websiteName: string) => {
    const message = `مرحباً! أريد الاستفسار عن الموقع: ${websiteName}`;
    const whatsappUrl = API_CONFIG.WHATSAPP.getUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
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

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || website.status === statusFilter;
    const matchesType = !typeFilter || website.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalWebsites = websites.length;
  const availableWebsites = websites.filter(w => w.status === 'available').length;
  const soldWebsites = websites.filter(w => w.status === 'sold').length;
  const totalViews = websites.reduce((sum, w) => sum + w.viewsCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">جاري تحميل مواقعك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">مواقعي</h1>
              <p className="text-dark-300">إدارة وعرض جميع مواقعك</p>
            </div>
            <button
              onClick={() => router.push('/websites/create')}
              className="btn-primary flex items-center space-x-2 space-x-reverse"
            >
              <Plus size={20} />
              <span>إضافة موقع جديد</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">إجمالي المواقع</p>
                <p className="text-2xl font-bold text-white">{totalWebsites}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Globe className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">متاح للبيع</p>
                <p className="text-2xl font-bold text-white">{availableWebsites}</p>
              </div>
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                <Tag className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">تم البيع</p>
                <p className="text-2xl font-bold text-white">{soldWebsites}</p>
              </div>
              <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="text-red-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-white">{totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
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
                placeholder="البحث في المواقع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">جميع الحالات</option>
              <option value="available">متاح</option>
              <option value="sold">مباع</option>
              <option value="reserved">محجوز</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">جميع الأنواع</option>
              {websiteTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTypeFilter('');
              }}
              className="btn-secondary"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>

        {/* Websites Grid */}
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-dark-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد مواقع</h3>
            <p className="text-dark-400 mb-4">ابدأ بإضافة موقعك الأول</p>
            <button
              onClick={() => router.push('/websites/create')}
              className="btn-primary"
            >
              إضافة موقع جديد
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website) => (
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
                  <div className="absolute top-4 right-4 flex space-x-2 space-x-reverse">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(website.status)}`}>
                      {website.status === 'available' ? 'متاح' : website.status === 'sold' ? 'مباع' : 'محجوز'}
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
                        متجاوب
                      </span>
                    )}
                    {website.hasAdminPanel && (
                      <span className="bg-dark-700 text-blue-400 text-xs px-2 py-1 rounded">
                        لوحة إدارة
                      </span>
                    )}
                    {website.hasDatabase && (
                      <span className="bg-dark-700 text-purple-400 text-xs px-2 py-1 rounded">
                        قاعدة بيانات
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
                          +{website.technologies.length - 3} أكثر
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-dark-400 mb-4">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(website.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart size={12} className="mr-1" />
                      <span>{website.likes?.length || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => router.push(`/websites/${website.slug}`)}
                      className="flex-1 bg-dark-700 text-white text-center py-2 px-3 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2 space-x-reverse text-sm"
                    >
                      <Eye size={14} />
                      <span>عرض</span>
                    </button>
                    <button
                      onClick={() => router.push(`/websites/edit/${website._id}`)}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse text-sm"
                    >
                      <Edit size={14} />
                      <span>تعديل</span>
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