'use client';

import { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  logo: {
    secure_url: string;
    public_id: string;
  };
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/category'), {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.documents || data.data || []);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!selectedFile) {
      toast.error('Category logo is required');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('file', selectedFile);

      const response = await fetch(buildApiUrl('/category'), {
        method: 'POST',
        headers: {
          'Authorization': token || '',
        },
        body: formDataToSend
      });

      if (response.ok) {
        toast.success('Category created successfully');
        setShowCreateModal(false);
        setFormData({ name: '' });
        setSelectedFile(null);
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const updateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await fetch(buildApiUrl(`/category/${selectedCategory._id}`), {
        method: 'PATCH',
        headers: {
          'Authorization': token || '',
        },
        body: formDataToSend
      });

      if (response.ok) {
        toast.success('Category updated successfully');
        setShowEditModal(false);
        setFormData({ name: '' });
        setSelectedFile(null);
        setSelectedCategory(null);
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/category/${categoryId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setSelectedFile(null);
    setShowEditModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Category Management</h1>
              <p className="text-dark-300">Organize your websites with categories</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-dark-400">
                <FolderOpen size={20} />
                <span>{categories.length} categories</span>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-dark-400">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-dark-400 mb-4" />
            <p className="text-dark-400 mb-4">No categories found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-red-500 transition-colors"
              >
                {/* Category Logo */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-dark-700">
                  {category.logo?.secure_url ? (
                    <img
                      src={category.logo.secure_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-gradient flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="text-center mb-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-dark-400 text-sm">/{category.slug}</p>
                  <p className="text-dark-500 text-xs mt-2">
                    Created {formatDate(category.createdAt)}
                  </p>
                  <p className="text-dark-500 text-xs">
                    by {category.createdBy?.name || 'Unknown'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Category Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Create Category</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-dark-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category Logo
                  </label>
                  <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-dark-400 mb-2" />
                      <p className="text-dark-400">
                        {selectedFile ? selectedFile.name : 'Click to upload logo'}
                      </p>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCategory}
                    className="flex-1 btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Edit Category</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-dark-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category Logo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo-upload-edit"
                    />
                    <label htmlFor="logo-upload-edit" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-dark-400 mb-2" />
                      <p className="text-dark-400">
                        {selectedFile ? selectedFile.name : 'Click to upload new logo'}
                      </p>
                    </label>
                  </div>
                  {selectedCategory.logo?.secure_url && !selectedFile && (
                    <div className="mt-2 text-center">
                      <img
                        src={selectedCategory.logo.secure_url}
                        alt="Current logo"
                        className="w-16 h-16 mx-auto rounded-lg object-cover"
                      />
                      <p className="text-dark-400 text-sm mt-1">Current logo</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateCategory}
                    className="flex-1 btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}