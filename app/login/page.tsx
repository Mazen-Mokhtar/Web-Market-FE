'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_CONFIG, buildApiUrl } from '@/lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkIfAlreadyLoggedIn();
  }, []);

  const checkIfAlreadyLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      // Verify token by calling profile endpoint
      const response = await fetch(buildApiUrl('/user/profile'), {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // User is already logged in, redirect to home
        toast.success('أنت مسجل دخول بالفعل');
        router.push('/');
        return;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('token');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.data?.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        toast.success('تم تسجيل الدخول بنجاح!');
        window.dispatchEvent(new Event('user-logged-in'));
        
        // Redirect based on user role
        if (data.data.accessToken.startsWith('admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        toast.error(data.message || 'فشل في تسجيل الدخول');
      }
    } catch (error) {
      toast.error('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking auth status
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">جاري التحقق من حالة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">
            مرحباً بعودتك
          </h2>
          <p className="mt-2 text-dark-300">
            سجل دخولك للمتابعة
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 pointer-events-none" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 pointer-events-none" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg py-3 pl-10 pr-10 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-dark-300">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="text-red-400 hover:text-red-300 transition-colors">
                سجل هنا
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}