import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { FrontendCartItem, FrontendProduct } from '@shared/schema';

interface CartContextType {
  items: FrontendCartItem[];
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
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

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const response = await apiRequest('GET', '/api/cart', undefined);
        return response.json();
      } catch (error: any) {
        if (error.message.includes('Authentication failed')) {
          // Don't show error for auth failures, just return empty cart
          return [];
        }
        throw error;
      }
    },
    enabled: !!user,
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const response = await apiRequest('POST', '/api/cart', { productId, quantity });
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
      if (error.message.includes('Authentication failed')) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to add items to cart',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add to cart',
          variant: 'destructive',
        });
      }
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${itemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      if (error.message.includes('Authentication failed')) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in again',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update quantity',
          variant: 'destructive',
        });
      }
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest('DELETE', `/api/cart/${itemId}`);
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
      if (error.message.includes('Authentication failed')) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in again',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to remove from cart',
          variant: 'destructive',
        });
      }
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/cart');
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
      if (error.message.includes('Authentication failed')) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in again',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to clear cart',
          variant: 'destructive',
        });
      }
    },
  });

  const totalItems = items.reduce((sum: number, item: FrontendCartItem) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: FrontendCartItem) => sum + (item.product.price * item.quantity), 0);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to add items to cart',
        variant: 'destructive',
      });
      return;
    }
    
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = async (itemId: number) => {
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
