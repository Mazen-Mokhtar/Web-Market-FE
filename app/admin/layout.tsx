'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  FolderOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('admin')) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/login');
      return;
    }
    
    // You can fetch user data here if needed
    setUser({ name: 'Admin User', email: 'admin@example.com' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Websites', href: '/admin/websites', icon: Globe },
    { name: 'Sales', href: '/admin/sales', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-dark-800 border-r border-dark-700">
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gradient">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-dark-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-dark-800 border-r border-dark-700 overflow-hidden">
          <div className="flex items-center px-4 py-6 border-b border-dark-700 mt-12">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gradient">Admin Panel</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-dark-800 border-b border-dark-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-dark-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-gradient rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-lg font-bold text-gradient">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Page content with proper spacing */}
        <main className="flex-1 pt-20 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}