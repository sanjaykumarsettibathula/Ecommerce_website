import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { WishlistProvider } from '@/lib/wishlist';
import Navbar from '@/components/navbar';
import HomePage from '@/pages/home';
import ProductsPage from '@/pages/products';
import CartPage from '@/pages/cart';
import CheckoutPage from '@/pages/checkout';
import AdminPage from '@/pages/admin';
import AuthPage from '@/pages/auth';
import NotFoundPage from '@/pages/not-found';
import WishlistPage from '@/pages/wishlist';
import ProductDetailsPage from '@/pages/product-details';
import ProfilePage from '@/pages/profile';
import OrdersPage from '@/pages/orders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Toaster />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
