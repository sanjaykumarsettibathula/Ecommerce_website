import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string | number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!user) return [];
      const response = await apiRequest('GET', '/api/cart', undefined);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      return response.json();
    },
    enabled: !!user,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string | number; quantity?: number }) => {
      const response = await apiRequest('POST', '/api/cart', { productId, quantity });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to cart');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Success',
        description: 'Item added to cart',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add to cart',
        variant: 'destructive',
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${itemId}`, { quantity });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update quantity');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update quantity',
        variant: 'destructive',
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest('DELETE', `/api/cart/${itemId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove from cart');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Success',
        description: 'Item removed from cart',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove from cart',
        variant: 'destructive',
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/cart');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clear cart');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Success',
        description: 'Cart cleared',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clear cart',
        variant: 'destructive',
      });
    },
  });

  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0);

  const addToCart = async (productId: string | number, quantity = 1) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to add items to cart',
        variant: 'destructive',
      });
      return;
    }
    
    await addToCartMutation.mutateAsync({ productId: Number(productId), quantity });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = async (itemId: string) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
