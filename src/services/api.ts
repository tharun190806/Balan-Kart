import { Product, CartData, Order, User, AdminStats, OrderStatus } from '../types/index.ts';

const API_BASE = '/api';

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const activeToken = token || localStorage.getItem('balan_token') || localStorage.getItem('balan_admin_token');
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// ----------------- Auth API -----------------
export const authApi = {
  register: async (userData: any): Promise<{ token: string; user: User; message: string }> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  login: async (credentials: { email: string; password: string }): Promise<{ token: string; user: User; message: string }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  adminLogin: async (credentials: { email: string; password: string }): Promise<{ token: string; user: User; message: string }> => {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  getMe: async (token?: string): Promise<{ user: User }> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },
};

// ----------------- Products API -----------------
export const productsApi = {
  getProducts: async (params?: { search?: string; category?: string; sort?: string; inStock?: boolean }): Promise<{ products: Product[]; count: number }> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All Products') query.append('category', params.category);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.inStock) query.append('inStock', 'true');

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${queryString}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getCategories: async (): Promise<{ categories: string[] }> => {
    const res = await fetch(`${API_BASE}/products/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getProductById: async (id: string): Promise<{ product: Product }> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createProduct: async (productData: Partial<Product>): Promise<{ product: Product; message: string }> => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<{ product: Product; message: string }> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ----------------- Cart API -----------------
export const cartApi = {
  getCart: async (): Promise<{ cart: CartData }> => {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  addItem: async (productId: string, quantity = 1): Promise<{ cart: CartData; message: string }> => {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(res);
  },

  updateQuantity: async (productId: string, quantity: number): Promise<{ cart: CartData; message: string }> => {
    const res = await fetch(`${API_BASE}/cart/update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(res);
  },

  removeItem: async (productId: string): Promise<{ cart: CartData; message: string }> => {
    const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  clearCart: async (): Promise<{ cart: CartData; message: string }> => {
    const res = await fetch(`${API_BASE}/cart/clear`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ----------------- Orders API -----------------
export const ordersApi = {
  createOrder: async (orderPayload: {
    customerDetails: { fullName: string; email: string; phone: string };
    deliveryAddress: { street: string; city: string; state: string; pincode: string };
    items: Array<{ product: string; quantity: number }>;
    notes?: string;
  }): Promise<{ order: Order; message: string }> => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderPayload),
    });
    return handleResponse(res);
  },

  getUserOrders: async (): Promise<{ orders: Order[]; count: number }> => {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getOrderById: async (id: string): Promise<{ order: Order }> => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ----------------- Admin API -----------------
export const adminApi = {
  getStats: async (): Promise<{ stats: AdminStats }> => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getOrders: async (status?: string): Promise<{ orders: Order[]; count: number }> => {
    const url = status && status !== 'All' ? `${API_BASE}/admin/orders?status=${status}` : `${API_BASE}/admin/orders`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<{ order: Order; message: string }> => {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  getCustomers: async (): Promise<{ customers: any[]; count: number }> => {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ----------------- System API -----------------
export const systemApi = {
  getStatus: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/system/status`);
    return handleResponse(res);
  },
  reconnectDb: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/system/reconnect-db`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
