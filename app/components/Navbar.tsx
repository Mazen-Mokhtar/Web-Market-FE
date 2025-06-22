'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, User, LogOut, Settings } from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isConfirm: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();

    // Listen for login event
    const handleLogin = () => {
      checkAuthStatus();
    };
    window.addEventListener('user-logged-in', handleLogin);

    // Clean up
    return () => {
      window.removeEventListener('user-logged-in', handleLogin);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch user profile to verify token and get user data
      const response = await fetch(buildApiUrl('/user/profile'), {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
        
        // Check if user is admin
        if (token.startsWith('admin')) {
          setIsAdmin(true);
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    toast.success('تم تسجيل الخروج بنجاح');
    router.push('/');
  };

  if (loading) {
    return (
      <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gradient">WebMarket</span>
            </Link>
            <div className="animate-pulse">
              <div className="h-8 w-20 bg-dark-700 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gradient">WebMarket</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-red-400 transition-colors">
              Home
            </Link>
            <Link href="/websites" className="text-white hover:text-red-400 transition-colors">
              Browse Websites
            </Link>
            <Link href="/categories" className="text-white hover:text-red-400 transition-colors">
              Categories
            </Link>
            {isLoggedIn && (
              <Link href="/my-websites" className="text-white hover:text-red-400 transition-colors">
                My Websites
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-red-400 hover:text-red-300 transition-colors font-medium">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-gradient rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-dark-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-white hover:text-red-400 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-400 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User info for mobile */}
            {isLoggedIn && user && (
              <div className="flex items-center space-x-3 px-3 py-3 border-b border-dark-600 mb-2">
                <div className="w-10 h-10 bg-red-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-dark-400 text-sm">{user.email}</p>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/websites"
              className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Browse Websites
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            {isLoggedIn && (
              <Link
                href="/my-websites"
                className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Websites
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2 text-red-400 hover:text-red-300 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            <div className="border-t border-dark-600 pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-white hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-white hover:text-red-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}