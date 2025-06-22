'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  DollarSign,
  Calendar,
  User,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Sale {
  _id: string;
  saleId: string;
  websiteId: {
    _id: string;
    name: string;
    price: number;
    mainImage?: {
      secure_url: string;
    };
  };
  buyerId: {
    _id: string;
    name: string;
    email: string;
  };
  sellerId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  discountAmount?: number;
  finalAmount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  paidAt?: string;
  completedAt?: string;
  notes?: string;
  deliveryMethod?: string;
  deliveryDetails?: string;
  deliveredAt?: string;
  isDelivered: boolean;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  createdAt: string;
}

export default function AdminSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleModal, setShowSaleModal] = useState(false);

  const saleStatuses = [
    'pending',
    'completed',
    'cancelled',
    'refunded'
  ];

  useEffect(() => {
    fetchSales();
  }, [statusFilter]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(buildApiUrl(`/sales?${params.toString()}`), {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSales(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to fetch sales');
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  const markSaleAsCompleted = async (saleId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/sales/${saleId}/complete`), {
        method: 'POST',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Sale marked as completed');
        fetchSales();
      } else {
        toast.error('Failed to complete sale');
      }
    } catch (error) {
      console.error('Error completing sale:', error);
      toast.error('Failed to complete sale');
    }
  };

  const processRefund = async (saleId: string, refundAmount: number, refundReason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/sales/${saleId}/refund`), {
        method: 'POST',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refundAmount, refundReason })
      });

      if (response.ok) {
        toast.success('Refund processed successfully');
        fetchSales();
      } else {
        toast.error('Failed to process refund');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      case 'refunded':
        return <RefreshCw size={16} className="text-purple-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.websiteId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.sellerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sales Management</h1>
              <p className="text-dark-300">Monitor and manage all sales transactions</p>
            </div>
            <div className="flex items-center space-x-2 text-dark-400">
              <ShoppingCart size={20} />
              <span>{sales.length} sales</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search sales..."
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
              <option value="">All Status</option>
              {saleStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-dark-400">Loading sales...</p>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-dark-400 mb-4" />
              <p className="text-dark-400">No sales found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Sale Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-dark-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{sale.saleId}</div>
                          <div className="text-sm text-dark-400">
                            Payment: {sale.paymentMethod}
                          </div>
                          {sale.transactionId && (
                            <div className="text-xs text-dark-500">
                              TX: {sale.transactionId.slice(-8)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {sale.websiteId?.mainImage?.secure_url ? (
                            <img
                              src={sale.websiteId.mainImage.secure_url}
                              alt={sale.websiteId.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-red-gradient rounded-lg flex items-center justify-center mr-3">
                              <Globe size={16} className="text-white" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">
                              {sale.websiteId?.name || 'Unknown Website'}
                            </div>
                            <div className="text-sm text-dark-400">
                              Original: {formatCurrency(sale.websiteId?.price || 0)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {sale.buyerId?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-dark-400">
                            {sale.buyerId?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-green-400">
                            {formatCurrency(sale.finalAmount)}
                          </div>
                          {sale.discountAmount && sale.discountAmount > 0 && (
                            <div className="text-xs text-dark-400">
                              Discount: -{formatCurrency(sale.discountAmount)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(sale.status)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sale.status)}`}>
                            {sale.status}
                          </span>
                        </div>
                        {sale.isDelivered && (
                          <div className="text-xs text-green-400 mt-1">
                            Delivered
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-400">
                          {formatDate(sale.createdAt)}
                        </div>
                        {sale.completedAt && (
                          <div className="text-xs text-green-400">
                            Completed: {formatDate(sale.completedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowSaleModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {sale.status === 'pending' && (
                            <button
                              onClick={() => markSaleAsCompleted(sale._id)}
                              className="text-green-400 hover:text-green-300 p-1"
                              title="Mark as completed"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {sale.status === 'completed' && (
                            <button
                              onClick={() => {
                                const refundAmount = prompt('Enter refund amount:', sale.finalAmount.toString());
                                const refundReason = prompt('Enter refund reason:');
                                if (refundAmount && refundReason) {
                                  processRefund(sale._id, parseFloat(refundAmount), refundReason);
                                }
                              }}
                              className="text-purple-400 hover:text-purple-300 p-1"
                              title="Process refund"
                            >
                              <RefreshCw size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sale Details Modal */}
        {showSaleModal && selectedSale && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Sale Details</h3>
                  <button
                    onClick={() => setShowSaleModal(false)}
                    className="text-dark-400 hover:text-white"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Sale Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Sale Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-dark-400">Sale ID:</span>
                      <span className="text-white ml-2">{selectedSale.saleId}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedSale.status)}`}>
                        {selectedSale.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-dark-400">Payment Method:</span>
                      <span className="text-white ml-2">{selectedSale.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">Final Amount:</span>
                      <span className="text-green-400 ml-2 font-semibold">
                        {formatCurrency(selectedSale.finalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Website Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Website</h4>
                  <div className="text-sm">
                    <div className="text-white font-medium">
                      {selectedSale.websiteId?.name || 'Unknown Website'}
                    </div>
                    <div className="text-dark-400">
                      Original Price: {formatCurrency(selectedSale.websiteId?.price || 0)}
                    </div>
                  </div>
                </div>

                {/* Buyer & Seller Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Buyer</h4>
                    <div className="text-sm">
                      <div className="text-white">{selectedSale.buyerId?.name || 'Unknown'}</div>
                      <div className="text-dark-400">{selectedSale.buyerId?.email || 'No email'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Seller</h4>
                    <div className="text-sm">
                      <div className="text-white">{selectedSale.sellerId?.name || 'Unknown'}</div>
                      <div className="text-dark-400">{selectedSale.sellerId?.email || 'No email'}</div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                {selectedSale.deliveryMethod && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Delivery</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-dark-400">Method:</span>
                        <span className="text-white ml-2">{selectedSale.deliveryMethod}</span>
                      </div>
                      {selectedSale.deliveryDetails && (
                        <div>
                          <span className="text-dark-400">Details:</span>
                          <span className="text-white ml-2">{selectedSale.deliveryDetails}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-dark-400">Status:</span>
                        <span className={`ml-2 ${selectedSale.isDelivered ? 'text-green-400' : 'text-yellow-400'}`}>
                          {selectedSale.isDelivered ? 'Delivered' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedSale.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Notes</h4>
                    <div className="text-sm text-dark-300 bg-dark-700 p-3 rounded-lg">
                      {selectedSale.notes}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-dark-400">Created:</span>
                      <span className="text-white ml-2">{formatDate(selectedSale.createdAt)}</span>
                    </div>
                    {selectedSale.paidAt && (
                      <div>
                        <span className="text-dark-400">Paid:</span>
                        <span className="text-white ml-2">{formatDate(selectedSale.paidAt)}</span>
                      </div>
                    )}
                    {selectedSale.completedAt && (
                      <div>
                        <span className="text-dark-400">Completed:</span>
                        <span className="text-white ml-2">{formatDate(selectedSale.completedAt)}</span>
                      </div>
                    )}
                    {selectedSale.deliveredAt && (
                      <div>
                        <span className="text-dark-400">Delivered:</span>
                        <span className="text-white ml-2">{formatDate(selectedSale.deliveredAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}