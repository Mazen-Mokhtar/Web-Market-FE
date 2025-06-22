'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Plus,
  Settings,
  BarChart3,
  ShoppingCart,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  usersCount: number;
  salesCount: number;
  totalRevenue: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isConfirm: boolean;
  createdAt: string;
}

interface Sale {
  _id: string;
  saleId: string;
  websiteId: {
    name: string;
    price: number;
  };
  buyerId: {
    name: string;
    email: string;
  };
  sellerId: {
    name: string;
    email: string;
  };
  finalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    usersCount: 0,
    salesCount: 0,
    totalRevenue: 0
  });
  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [latestSales, setLatestSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, []);

  const checkAdminAccess = () => {
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('admin')) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/login');
      return;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      };

      // Fetch dashboard stats
      const statsResponse = await fetch(buildApiUrl('/dashboard/stats'), { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Fetch latest users
      const usersResponse = await fetch(buildApiUrl('/dashboard/latest-users'), { headers });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setLatestUsers(usersData.data);
      }

      // Fetch latest sales
      const salesResponse = await fetch(buildApiUrl('/dashboard/latest-sales'), { headers });
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setLatestSales(salesData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
      case 'completed':
        return 'text-green-400 bg-green-900/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-400 bg-red-900/30';
      case 'refunded':
        return 'text-purple-400 bg-purple-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-dark-300">Welcome back! Here's what's happening with your marketplace.</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin/websites/create')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Website</span>
              </button>
              <button
                onClick={() => router.push('/admin/settings')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.usersCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="text-blue-400" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-white">{stats.salesCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-green-400" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+8% from last month</span>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="text-red-400" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+15% from last month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-dark-800 rounded-xl p-4 border border-dark-700 hover:border-red-500 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Users className="text-blue-400" size={20} />
              <span className="text-white font-medium">Manage Users</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/websites')}
            className="bg-dark-800 rounded-xl p-4 border border-dark-700 hover:border-red-500 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Globe className="text-green-400" size={20} />
              <span className="text-white font-medium">Manage Websites</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/sales')}
            className="bg-dark-800 rounded-xl p-4 border border-dark-700 hover:border-red-500 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-purple-400" size={20} />
              <span className="text-white font-medium">View Sales</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/categories')}
            className="bg-dark-800 rounded-xl p-4 border border-dark-700 hover:border-red-500 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Settings className="text-orange-400" size={20} />
              <span className="text-white font-medium">Categories</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Users */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Latest Users</h3>
              <button
                onClick={() => router.push('/admin/users')}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {latestUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-dark-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isConfirm ? 'text-green-400 bg-green-900/30' : 'text-yellow-400 bg-yellow-900/30'
                      }`}>
                        {user.isConfirm ? 'Verified' : 'Pending'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'text-red-400 bg-red-900/30' : 'text-blue-400 bg-blue-900/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-dark-400 text-xs mt-1">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Sales */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Latest Sales</h3>
              <button
                onClick={() => router.push('/admin/sales')}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {latestSales.map((sale) => (
                <div key={sale._id} className="p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{sale.websiteId?.name || 'Unknown Website'}</p>
                      <p className="text-dark-400 text-sm">
                        Buyer: {sale.buyerId?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">{formatCurrency(sale.finalAmount)}</p>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-dark-400">
                    <span>Sale ID: {sale.saleId}</span>
                    <span>{formatDate(sale.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}