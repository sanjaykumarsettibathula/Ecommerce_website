import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/lib/wishlist';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export default function ProductCard({ 
  product, 
  showBadge = false, 
  badgeText,
  badgeVariant = 'default'
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    await addToCart(product.id);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Convert database product to frontend format
    const frontendProduct = {
      ...product,
      price: Number(product.price)
    };
    await toggleWishlist(frontendProduct);
  };

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
          
          {showBadge && badgeText && (
            <Badge 
              variant={badgeVariant}
              className="absolute top-3 left-3"
            >
              {badgeText}
            </Badge>
          )}
          
          <Button 
            size="icon" 
            variant="outline" 
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={handleToggleWishlist}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-secondary mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <span className="text-lg font-bold text-primary block mb-2">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full mt-2"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
          {product.stock <= 10 && product.stock > 0 && (
            <p className="text-xs text-orange-500 mt-2">
              Only {product.stock} left in stock
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-500 mt-2">
              Out of stock
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
