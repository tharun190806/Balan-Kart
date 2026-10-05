export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  image: string;
  stock: number;
  availability: boolean;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  _id: string;
  orderId: string;
  user?: string;
  customerDetails: CustomerDetails;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  paymentMethod: 'Cash on Delivery';
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: DeliveryAddress;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}
