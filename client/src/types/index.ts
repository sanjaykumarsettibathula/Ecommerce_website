// Frontend type definitions for consistency with server schema
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
}

export interface FrontendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
}

export interface FrontendCartItem {
  id: number;
  productId: number;
  quantity: number;
  product: FrontendProduct;
}

export interface FrontendUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: number;
  userId: number;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  paymentIntentId: string | null;
  createdAt: string;
} 