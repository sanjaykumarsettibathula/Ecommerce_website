import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  sku: string;
}

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add items to wishlist',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Implement wishlist functionality
    toast({
      title: 'Coming Soon',
      description: 'Wishlist feature coming soon!',
    });
  };

  return (
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
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-secondary mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
        
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
  );
}
