'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera,
  MapPin,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Globe,
  Heart,
  Eye,
  Settings
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isConfirm: boolean;
  createdAt: string;
  profileImage?: {
    secure_url: string;
    public_id: string;
  };
  bio?: string;
  location?: string;
  website?: string;
}

interface UserStats {
  websitesCount: number;
  purchasesCount: number;
  totalViews: number;
  totalLikes: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<UserStats>({
    websitesCount: 0,
    purchasesCount: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(buildApiUrl('/user/profile'), {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || ''
        });
      } else {
        toast.error('فشل في تحميل بيانات المستخدم');
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        websitesCount: 12,
        purchasesCount: 8,
        totalViews: 1250,
        totalLikes: 89
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl('/user/profile'), {
        method: 'PUT',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        setEditing(false);
        toast.success('تم تحديث البيانات بنجاح');
      } else {
        toast.error(data.message || 'فشل في تحديث البيانات');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('حدث خطأ في تحديث البيانات');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'user':
        return 'مستخدم';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-900/30';
      case 'user':
        return 'text-blue-400 bg-blue-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-dark-400 mb-4">لم يتم العثور على بيانات المستخدم</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">الملف الشخصي</h1>
          <p className="text-dark-300">إدارة معلوماتك الشخصية</p>
        </div>

        {/* Profile Card */}
        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-red-600 via-red-500 to-red-700 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setEditing(!editing)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Edit size={20} />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16 mb-6">
              {/* Profile Picture */}
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-dark-800 overflow-hidden bg-dark-700">
                  {user.profileImage?.secure_url ? (
                    <img
                      src={user.profileImage.secure_url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-gradient flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 bg-dark-700 hover:bg-dark-600 text-white p-2 rounded-full transition-colors border-2 border-dark-800">
                  <Camera size={16} />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-dark-300 mb-3">{user.email}</p>
                <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                  {user.isConfirm ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-green-400 bg-green-900/30 flex items-center space-x-1 space-x-reverse">
                      <Check size={14} />
                      <span>مؤكد</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-yellow-400 bg-yellow-900/30 flex items-center space-x-1 space-x-reverse">
                      <AlertCircle size={14} />
                      <span>غير مؤكد</span>
                    </span>
                  )}
                </div>
                {user.bio && (
                  <p className="text-dark-300 text-sm max-w-md mx-auto">{user.bio}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.websitesCount}</div>
                <div className="text-xs text-dark-400">مواقع</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.purchasesCount}</div>
                <div className="text-xs text-dark-400">مشتريات</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.totalViews}</div>
                <div className="text-xs text-dark-400">مشاهدة</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.totalLikes}</div>
                <div className="text-xs text-dark-400">إعجاب</div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <Calendar className="text-dark-400" size={16} />
                <span className="text-dark-300">انضم في {formatDate(user.createdAt)}</span>
              </div>
              {user.location && (
                <div className="flex items-center justify-center space-x-3 space-x-reverse">
                  <MapPin className="text-dark-400" size={16} />
                  <span className="text-dark-300">{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center justify-center space-x-3 space-x-reverse">
                  <LinkIcon className="text-dark-400" size={16} />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">تعديل المعلومات الشخصية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="أدخل اسمك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="أدخل موقعك"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  الموقع الشخصي
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  نبذة شخصية
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="اكتب نبذة عن نفسك"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 space-x-reverse mt-8">
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {updating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/my-websites')}
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-red-500 transition-colors text-center"
          >
            <Globe className="mx-auto h-8 w-8 text-blue-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">مواقعي</h3>
            <p className="text-dark-400 text-sm">إدارة مواقعك المنشورة</p>
          </button>

          <button
            onClick={() => router.push('/websites')}
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-red-500 transition-colors text-center"
          >
            <Eye className="mx-auto h-8 w-8 text-green-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">تصفح المواقع</h3>
            <p className="text-dark-400 text-sm">اكتشف مواقع جديدة</p>
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-red-500 transition-colors text-center"
          >
            <Settings className="mx-auto h-8 w-8 text-purple-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">الإعدادات</h3>
            <p className="text-dark-400 text-sm">إدارة حسابك</p>
          </button>
        </div>
      </div>
    </div>
  );
}