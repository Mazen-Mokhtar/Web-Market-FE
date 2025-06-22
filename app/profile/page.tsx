'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Shield, Edit, Save, X } from 'lucide-react';
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
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
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
          phone: userData.phone || ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
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
          <p className="text-white">لم يتم العثور على بيانات المستخدم</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">الملف الشخصي</h1>
          <p className="text-dark-300">إدارة معلوماتك الشخصية</p>
        </div>

        {/* Profile Card */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-red-gradient p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-white/80">{user.email}</p>
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                    {user.isConfirm ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium text-green-400 bg-green-900/30">
                        مؤكد
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium text-yellow-400 bg-yellow-900/30">
                        غير مؤكد
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <Edit size={20} />
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">المعلومات الشخصية</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      <User size={16} className="inline ml-2" />
                      الاسم
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="أدخل اسمك"
                      />
                    ) : (
                      <p className="text-white bg-dark-700 p-3 rounded-lg">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      <Mail size={16} className="inline ml-2" />
                      البريد الإلكتروني
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    ) : (
                      <p className="text-white bg-dark-700 p-3 rounded-lg">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      <Phone size={16} className="inline ml-2" />
                      رقم الهاتف
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="أدخل رقم هاتفك"
                      />
                    ) : (
                      <p className="text-white bg-dark-700 p-3 rounded-lg">{user.phone || 'غير محدد'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">معلومات الحساب</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      <Shield size={16} className="inline ml-2" />
                      نوع الحساب
                    </label>
                    <p className="text-white bg-dark-700 p-3 rounded-lg">{getRoleText(user.role)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      <Calendar size={16} className="inline ml-2" />
                      تاريخ الانضمام
                    </label>
                    <p className="text-white bg-dark-700 p-3 rounded-lg">{formatDate(user.createdAt)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      حالة التأكيد
                    </label>
                    <div className="bg-dark-700 p-3 rounded-lg">
                      {user.isConfirm ? (
                        <span className="text-green-400">✓ تم تأكيد البريد الإلكتروني</span>
                      ) : (
                        <span className="text-yellow-400">⚠ البريد الإلكتروني غير مؤكد</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex space-x-4 space-x-reverse mt-6 pt-6 border-t border-dark-700">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="btn-primary flex items-center space-x-2 space-x-reverse disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{updating ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary flex items-center space-x-2 space-x-reverse"
                >
                  <X size={16} />
                  <span>إلغاء</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}