const BASE_URL = 'http://localhost:8080/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authApi = {
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  signup: (userData) => apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

export const productApi = {
  getAll: () => apiFetch('/products'),
  getFeatured: () => apiFetch('/products/featured'),
  getByPrice: (price) => apiFetch(`/products/price-less-than/${price}`),
  getByRating: (rating) => apiFetch(`/products/rating-higher-than/${rating}`),
  add: (product) => apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiFetch(`/products/${id}`, {
    method: 'DELETE',
  }),
};
