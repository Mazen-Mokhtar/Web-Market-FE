'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Eye, 
  ExternalLink, 
  MessageCircle, 
  Heart, 
  Share2, 
  Calendar,
  User,
  Tag,
  Globe,
  Code,
  Database,
  Monitor,
  Smartphone,
  Settings,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Website {
  _id: string;
  name: string;
  slug: string;
  description: string;
  demoUrl: string;
  sourceCodeUrl?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  type: string;
  status: string;
  technologies: string[];
  features: string[];
  pagesCount?: number;
  isResponsive: boolean;
  hasAdminPanel: boolean;
  hasDatabase: boolean;
  hostingInfo?: string;
  domainInfo?: string;
  mainImage: {
    secure_url: string;
    public_id: string;
  };
  gallery: Array<{
    secure_url: string;
    public_id: string;
  }>;
  categoryId: {
    _id: string;
    name: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  likes: string[];
  viewsCount: number;
  createdAt: string;
  finalPrice?: number;
}

export default function WebsiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchWebsite(params.slug as string);
    }
  }, [params.slug]);

  const fetchWebsite = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(`/websites/slug/${slug}`));
      
      if (response.ok) {
        const data = await response.json();
        setWebsite(data);
        
        // Check if user has liked this website
        const token = localStorage.getItem('token');
        if (token && data.likes) {
          // You would need to decode the token to get user ID
          // For now, we'll just set it to false
          setIsLiked(false);
        }
      } else {
        toast.error('لم يتم العثور على الموقع');
        router.push('/websites');
      }
    } catch (error) {
      console.error('Error fetching website:', error);
      toast.error('حدث خطأ في تحميل الموقع');
      router.push('/websites');
    } finally {
      setLoading(false);
    }
  };

  const handleContactUs = () => {
    if (!website) return;
    const message = `مرحباً! أريد الاستفسار عن الموقع: ${website.name} - ${window.location.href}`;
    const whatsappUrl = API_CONFIG.WHATSAPP.getUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: website?.name,
          text: website?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">جاري تحميل الموقع...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Globe className="mx-auto h-12 w-12 text-dark-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">لم يتم العثور على الموقع</h2>
          <p className="text-dark-400 mb-4">الموقع المطلوب غير موجود أو تم حذفه</p>
          <button
            onClick={() => router.push('/websites')}
            className="btn-primary"
          >
            العودة للمواقع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 space-x-reverse text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>العودة</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 mb-8">
              <div className="relative h-96">
                <img
                  src={website.gallery?.[selectedImage]?.secure_url || website.mainImage?.secure_url}
                  alt={website.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2 space-x-reverse">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(website.status)}`}>
                    {website.status === 'available' ? 'متاح' : website.status === 'sold' ? 'مباع' : 'محجوز'}
                  </span>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {website.gallery && website.gallery.length > 1 && (
                <div className="p-4 flex space-x-2 space-x-reverse overflow-x-auto">
                  {website.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-red-500' : 'border-dark-600'
                      }`}
                    >
                      <img
                        src={image.secure_url}
                        alt={`${website.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Website Details */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{website.name}</h1>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-dark-400">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Eye size={16} />
                      <span>{website.viewsCount} مشاهدة</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar size={16} />
                      <span>{formatDate(website.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Tag size={16} />
                      <span>{website.categoryId?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={handleShare}
                    className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <Share2 size={20} className="text-dark-400" />
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-lg transition-colors ${
                      isLiked ? 'bg-red-600 text-white' : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <p className="text-dark-300 leading-relaxed mb-6">
                {website.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`flex items-center space-x-2 space-x-reverse p-3 rounded-lg ${
                  website.isResponsive ? 'bg-green-900/30 text-green-400' : 'bg-dark-700 text-dark-400'
                }`}>
                  <Smartphone size={20} />
                  <span className="text-sm">متجاوب</span>
                  {website.isResponsive && <CheckCircle size={16} />}
                </div>

                <div className={`flex items-center space-x-2 space-x-reverse p-3 rounded-lg ${
                  website.hasAdminPanel ? 'bg-blue-900/30 text-blue-400' : 'bg-dark-700 text-dark-400'
                }`}>
                  <Settings size={20} />
                  <span className="text-sm">لوحة إدارة</span>
                  {website.hasAdminPanel && <CheckCircle size={16} />}
                </div>

                <div className={`flex items-center space-x-2 space-x-reverse p-3 rounded-lg ${
                  website.hasDatabase ? 'bg-purple-900/30 text-purple-400' : 'bg-dark-700 text-dark-400'
                }`}>
                  <Database size={20} />
                  <span className="text-sm">قاعدة بيانات</span>
                  {website.hasDatabase && <CheckCircle size={16} />}
                </div>

                <div className="flex items-center space-x-2 space-x-reverse p-3 rounded-lg bg-orange-900/30 text-orange-400">
                  <Monitor size={20} />
                  <span className="text-sm">{website.pagesCount || 'متعدد'} صفحة</span>
                </div>
              </div>

              {/* Technologies */}
              {website.technologies && website.technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">التقنيات المستخدمة</h3>
                  <div className="flex flex-wrap gap-2">
                    {website.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features List */}
              {website.features && website.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">المميزات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {website.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-dark-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">معلومات المطور</h3>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-red-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {website.createdBy?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{website.createdBy?.name}</p>
                  <p className="text-dark-400 text-sm">{website.createdBy?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-6 sticky top-6">
              <div className="text-center mb-6">
                {website.discountPercent && website.finalPrice && website.discountPercent > 0 ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                    <span className="text-dark-400 line-through text-lg">
                      {formatCurrency(website.price)}
                    </span>
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                      -{website.discountPercent}%
                    </span>
                  </div>
                ) : null}
                <div className="text-3xl font-bold text-white mb-2">
                  {formatCurrency(website.finalPrice && website.discountPercent && website.discountPercent > 0 ? website.finalPrice : website.price)}
                </div>
                <p className="text-dark-400 text-sm">سعر نهائي شامل كل شيء</p>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={website.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-dark-700 text-white py-3 px-4 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <ExternalLink size={20} />
                  <span>معاينة الموقع</span>
                </a>

                <button
                  onClick={handleContactUs}
                  className="w-full btn-primary flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <MessageCircle size={20} />
                  <span>تواصل للشراء</span>
                </button>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">النوع:</span>
                  <span className="text-white capitalize">{website.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">الحالة:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(website.status)}`}>
                    {website.status === 'available' ? 'متاح' : website.status === 'sold' ? 'مباع' : 'محجوز'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">المشاهدات:</span>
                  <span className="text-white">{website.viewsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">الإعجابات:</span>
                  <span className="text-white">{website.likes?.length || 0}</span>
                </div>
              </div>

              {/* Additional Info */}
              {(website.hostingInfo || website.domainInfo) && (
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <h4 className="text-white font-medium mb-3">معلومات إضافية</h4>
                  {website.hostingInfo && (
                    <p className="text-dark-300 text-sm mb-2">
                      <strong>الاستضافة:</strong> {website.hostingInfo}
                    </p>
                  )}
                  {website.domainInfo && (
                    <p className="text-dark-300 text-sm">
                      <strong>النطاق:</strong> {website.domainInfo}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="bg-dark-800 rounded-xl p-4 border border-dark-700 text-center">
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-400" size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">ضمان الجودة</h4>
              <p className="text-dark-400 text-sm">
                جميع المواقع مفحوصة ومضمونة الجودة مع دعم فني مجاني
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}