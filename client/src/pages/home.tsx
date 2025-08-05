import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/product-card';
import { Product } from '@/types';
import { ArrowRight, Laptop, Shirt, Home, Gamepad2, Bot, ShoppingCart, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/lib/wishlist';
import React from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Use the proxy configuration
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json() as Promise<Product[]>;
    },
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return [];
      
      const response = await fetch('/api/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json() as Promise<Product[]>;
    },
    enabled: !!user,
  });

  const featuredProducts = products.slice(0, 4);
  const categories = [
    { name: 'Electronics', icon: Laptop, count: '1,234 products', link: '/products?category=Electronics' },
    { name: 'Clothing', icon: Shirt, count: '856 products', link: '/products?category=Clothing' },
    { name: 'Home & Garden', icon: Home, count: '642 products', link: '/products?category=Home%20%26%20Garden' },
    { name: 'Sports & Fitness', icon: Gamepad2, count: '423 products', link: '/products?category=Sports%20%26%20Fitness' },
    { name: 'Wishlist', icon: Bot, count: '', link: '/wishlist' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <section className="mb-8">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (search.trim()) {
              navigate(`/products?search=${encodeURIComponent(search.trim())}`);
            }
          }}
          className="max-w-xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </section>

      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-2xl overflow-hidden h-96 gradient-hero flex items-center">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Shop the latest trends with our AI-powered recommendations
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Explore Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-secondary mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} to={category.link || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-secondary mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">Featured Products</h2>
          <Link to="/products">
            <Button variant="ghost">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48 rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            featuredProducts.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                showBadge={product.stock <= 10}
                badgeText={product.stock <= 10 ? 'Low Stock' : undefined}
                badgeVariant="destructive"
              />
            ))
          )}
        </div>
      </section>

      {/* AI Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary">AI Recommendations</h2>
              <p className="text-gray-600">Personalized just for you</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((product: Product) => (
              <Card key={product.id} className="border border-gray-200 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-secondary">{product.name}</h3>
                        <p className="text-sm text-gray-600">Based on your recent purchases</p>
                        <span className="text-primary font-semibold">₹{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={async (e) => {
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
                      }}
                    >
                      <span className="flex items-center"><ShoppingCart className="w-4 h-4 mr-1" />Add to Cart</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={async (e) => {
                        e.stopPropagation();
                        // Convert database product to frontend format
                        const frontendProduct = {
                          ...product,
                          price: Number(product.price)
                        };
                        await toggleWishlist(frontendProduct);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
