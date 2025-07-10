import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  sku: string;
};

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      setWishlist(data);
      console.log('Fetched wishlist:', data);
    } catch (e: any) {
      setWishlist([]);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      console.error('Wishlist fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((item) => Number(item.id) === Number(productId));
  };

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use wishlist',
        variant: 'destructive',
      });
      return;
    }
    const token = localStorage.getItem('token');
    try {
      if (isInWishlist(product.id)) {
        const res = await fetch(`/api/wishlist/${Number(product.id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to remove from wishlist');
        setWishlist((prev) => prev.filter((item) => Number(item.id) !== Number(product.id)));
        toast({ title: 'Removed from Wishlist', description: product.name });
        console.log('Removed from wishlist:', product.id);
      } else {
        const res = await fetch(`/api/wishlist/${Number(product.id)}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to add to wishlist');
        setWishlist((prev) => [...prev, product]);
        toast({ title: 'Added to Wishlist', description: product.name });
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