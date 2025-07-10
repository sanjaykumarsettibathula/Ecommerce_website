import { useWishlist, Product } from '@/lib/wishlist';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, loading } = useWishlist();

  if (loading) {
    return <div className="p-8 text-center">Loading wishlist...</div>;
  }

  if (!wishlist.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="mb-4">Browse products and add them to your wishlist!</p>
        <Link to="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((product: Product) => (
          <Card key={String(product.id)} className="relative group">
            <Link to={`/products/${product.id}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
            </Link>
            <CardContent className="p-4">
              <h3 className="font-semibold text-secondary mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => toggleWishlist(product)}
                  className="ml-2"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 