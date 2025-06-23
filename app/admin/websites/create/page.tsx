'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Minus,
  Globe,
  DollarSign,
  Tag,
  Code,
  Database,
  Monitor,
  Smartphone,
  Settings,
  Eye,
  Link,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  demoUrl: string;
  sourceCodeUrl: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  type: string;
  categoryId: string;
  technologies: string[];
  features: string[];
  pagesCount: number;
  isResponsive: boolean;
  hasAdminPanel: boolean;
  hasDatabase: boolean;
  hostingInfo: string;
  domainInfo: string;
}

export default function CreateWebsitePage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    demoUrl: '',
    sourceCodeUrl: '',
    price: 0,
    originalPrice: 0,
    discountPercent: 0,
    type: 'other',
    categoryId: '',
    technologies: [''],
    features: [''],
    pagesCount: 1,
    isResponsive: false,
    hasAdminPanel: false,
    hasDatabase: false,
    hostingInfo: '',
    domainInfo: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();

  const websiteTypes = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    checkAdminAccess();
    fetchCategories();
    
  }, []);

  useEffect(() => {
    // Calculate discount percentage when prices change
    if (formData.originalPrice > 0 && formData.price > 0 && formData.originalPrice > formData.price) {
      const discount = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
      setFormData(prev => ({ ...prev, discountPercent: discount }));
    } else {
      setFormData(prev => ({ ...prev, discountPercent: 0 }));
    }
  }, [formData.originalPrice, formData.price]);

  const checkAdminAccess = () => {
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('admin')) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/login');
      return;
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(buildApiUrl('/category'));
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
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index: number, value: string, field: 'technologies' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'technologies' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'technologies' | 'features') => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Please select only image files');
      return;
    }

    // Limit to 10 images
    if (selectedFiles.length + validFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeFile = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Website name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.demoUrl.trim()) {
      toast.error('Demo URL is required');
      return;
    }
    
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add basic fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('demoUrl', formData.demoUrl);
      if (formData.sourceCodeUrl) submitData.append('sourceCodeUrl', formData.sourceCodeUrl);
      submitData.append('price', formData.price.toString());
      if (formData.originalPrice > 0) submitData.append('originalPrice', formData.originalPrice.toString());
      if (formData.discountPercent > 0) submitData.append('discountPercent', formData.discountPercent.toString());
      submitData.append('type', formData.type);
      submitData.append('categoryId', formData.categoryId);
      
      // Add array fields (filter out empty values)
      const technologies = formData.technologies.filter(tech => tech.trim());
      const features = formData.features.filter(feature => feature.trim());
      
      if (technologies.length > 0) {
        submitData.append('technologies', JSON.stringify(technologies));
      }
      if (features.length > 0) {
        submitData.append('features', JSON.stringify(features));
      }
      
      // Add optional fields
      if (formData.pagesCount > 0) submitData.append('pagesCount', formData.pagesCount.toString());
      submitData.append('isResponsive', formData.isResponsive.toString());
      submitData.append('hasAdminPanel', formData.hasAdminPanel.toString());
      submitData.append('hasDatabase', formData.hasDatabase.toString());
      if (formData.hostingInfo) submitData.append('hostingInfo', formData.hostingInfo);
      if (formData.domainInfo) submitData.append('domainInfo', formData.domainInfo);
      
      // Add images
      selectedFiles.forEach(file => {
        submitData.append('images', file);
      });

      const response = await fetch(buildApiUrl('/websites'), {
        method: 'POST',
        headers: {
          'Authorization': token || '',
        },
        body: submitData
      });

      if (response.ok) {
        toast.success('Website created successfully!');
        router.push('/admin/websites');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create website');
      }
    } catch (error) {
      console.error('Error creating website:', error);
      toast.error('Failed to create website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-gradient rounded-xl flex items-center justify-center">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Website</h1>
              <p className="text-dark-300">Add a new website to the marketplace</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Website Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="Enter website name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="Describe the website features and functionality"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Demo URL *
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                    placeholder="https://demo.example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Source Code URL
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="url"
                    name="sourceCodeUrl"
                    value={formData.sourceCodeUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Website Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                >
                  {websiteTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">Pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Current Price * ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="299.99"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="399.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="25"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center space-x-3 mb-6">
              <Code className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">Technologies</h2>
            </div>
            
            <div className="space-y-3">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                    className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'technologies')}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    disabled={formData.technologies.length === 1}
                  >
                    <Minus size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('technologies')}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus size={16} />
                <span>Add Technology</span>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center space-x-3 mb-6">
              <Tag className="text-orange-400" size={24} />
              <h2 className="text-xl font-bold text-white">Features</h2>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                    className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                    placeholder="e.g., User Authentication, Payment Integration"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'features')}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    disabled={formData.features.length === 1}
                  >
                    <Minus size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus size={16} />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="text-cyan-400" size={24} />
              <h2 className="text-xl font-bold text-white">Technical Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Number of Pages
                </label>
                <input
                  type="number"
                  name="pagesCount"
                  value={formData.pagesCount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="5"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isResponsive"
                    name="isResponsive"
                    checked={formData.isResponsive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 bg-dark-700 border-dark-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isResponsive" className="text-white flex items-center space-x-2">
                    <Smartphone size={16} className="text-green-400" />
                    <span>Responsive Design</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasAdminPanel"
                    name="hasAdminPanel"
                    checked={formData.hasAdminPanel}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 bg-dark-700 border-dark-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="hasAdminPanel" className="text-white flex items-center space-x-2">
                    <Monitor size={16} className="text-blue-400" />
                    <span>Admin Panel</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasDatabase"
                    name="hasDatabase"
                    checked={formData.hasDatabase}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 bg-dark-700 border-dark-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="hasDatabase" className="text-white flex items-center space-x-2">
                    <Database size={16} className="text-purple-400" />
                    <span>Database Integration</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Hosting Information
                </label>
                <textarea
                  name="hostingInfo"
                  value={formData.hostingInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="Hosting requirements or recommendations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Domain Information
                </label>
                <textarea
                  name="domainInfo"
                  value={formData.domainInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-red-500"
                  placeholder="Domain setup instructions or requirements"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center space-x-3 mb-6">
              <ImageIcon className="text-pink-400" size={24} />
              <h2 className="text-xl font-bold text-white">Images *</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="images-upload"
                />
                <label htmlFor="images-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-dark-400 mb-4" />
                  <p className="text-white mb-2">Click to upload images</p>
                  <p className="text-dark-400 text-sm">
                    Upload up to 10 images. First image will be the main image.
                  </p>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Website...' : 'Create Website'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}