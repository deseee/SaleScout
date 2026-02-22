const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Add a request interceptor equivalent to include auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token');
  }
  return null;
};

// Generic request function with auth header
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...authHeader,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  // Handle unauthorized access
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const apiClient = {
  get: (url: string) => apiRequest(url, { method: 'GET' }),
  
  post: (url: string, data?: any) => apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (url: string, data: any) => apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (url: string) => apiRequest(url, { method: 'DELETE' }),
};

export default apiClient;
