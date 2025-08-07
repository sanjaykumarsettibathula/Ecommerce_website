import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/lib/wishlist';
import { FrontendProduct } from '@/types';
import { apiRequest } from '@/lib/queryClient';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json() as Promise<FrontendProduct>;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product) return <div className="p-8 text-center text-red-500">Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full md:w-80 h-80 object-cover rounded-t-lg"
          />
          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="mb-4">
                <span className="text-lg font-semibold text-primary">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="ml-4 text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  Category: {product.category}
                </span>
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">
                  SKU: {product.sku}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
                <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => toggleWishlist(product)}
                className={isInWishlist(product.id) ? 'bg-red-100' : ''}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            <Link to="/products" className="mt-6 inline-block text-blue-600 hover:underline">
              ← Back to Products
            </Link>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}