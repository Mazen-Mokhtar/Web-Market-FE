// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      REGISTER: '/auth/singup',
      LOGIN: '/auth/login',
      CONFIRM_EMAIL: '/auth/confirm-email',
      LOGOUT: '/auth/logout',
    },
    // Website endpoints
    WEBSITES: {
      BASE: '/websites',
      AVAILABLE: '/websites/available',
      BY_SLUG: (slug: string) => `/websites/slug/${slug}`,
      BY_ID: (id: string) => `/websites/${id}`,
      BUY: (id: string) => `/websites/${id}/buy`,
      MY_WEBSITES: '/websites/my-websites',
    },
    // Category endpoints
    CATEGORIES: {
      BASE: '/category',
      ALL: '/category',
      BY_ID: (id: string) => `/category/${id}`,
    },
    // User endpoints
    USERS: {
      PROFILE: '/user/profile',
      ALL: '/user/all',
      BY_ID: (id: string) => `/user/${id}`,
    },
    // Sales endpoints
    SALES: {
      BASE: '/sales',
      MY_PURCHASES: '/sales/my-purchases',
      MY_SALES: '/sales/my-sales',
      BY_ID: (id: string) => `/sales/${id}`,
    },
  },
  // WhatsApp configuration
  WHATSAPP: {
    NUMBER: '+201234567890',
    getUrl: (message: string) => `https://wa.me/+201234567890?text=${encodeURIComponent(message)}`,
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API request helper
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = buildApiUrl(endpoint);
  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};