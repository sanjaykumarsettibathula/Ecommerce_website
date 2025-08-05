import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from './queryClient';
import { FrontendProduct } from '@/types';

interface WishlistContextType {
  wishlist: FrontendProduct[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: FrontendProduct) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlist([]);
        return;
      }
      
      const res = await apiRequest('GET', '/api/wishlist');
      
      if (res.status === 401 || res.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('token');
        setWishlist([]);
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      setWishlist(data);
      console.log('Fetched wishlist:', data);
    } catch (e: any) {
      setWishlist([]);
      console.error('Wishlist fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: FrontendProduct) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use wishlist',
        variant: 'destructive',
      });
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use wishlist',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isInWishlist(product.id)) {
        const res = await apiRequest('DELETE', `/api/wishlist/${product.id}`);
        
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          toast({
            title: 'Authentication Required',
            description: 'Please log in again',
            variant: 'destructive',
          });
          return;
        }
        
        if (!res.ok) throw new Error('Failed to remove from wishlist');
        setWishlist(prev => prev.filter(item => item.id !== product.id));
        toast({
          title: 'Success',
          description: 'Removed from wishlist',
        });
        console.log('Removed from wishlist:', product.id);
      } else {
        const res = await apiRequest('POST', `/api/wishlist/${product.id}`);
        
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          toast({
            title: 'Authentication Required',
            description: 'Please log in again',
            variant: 'destructive',
          });
          return;
        }
        
        if (!res.ok) throw new Error('Failed to add to wishlist');
        setWishlist(prev => [...prev, product]);
        toast({
          title: 'Success',
          description: 'Added to wishlist',
        });
        console.log('Added to wishlist:', product.id);
      }
      await fetchWishlist();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      console.error('Wishlist toggle error:', e);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, refreshWishlist: fetchWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}

// Export the Product type for backward compatibility
export type Product = FrontendProduct; 