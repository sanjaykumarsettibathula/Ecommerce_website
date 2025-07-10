import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Conversion rate
  const USD_TO_INR = 83;

  const subtotal = totalPrice;
  const shipping = subtotal > 4150 ? 0 : 830; // 50 USD = 4150 INR, 9.99 USD = 830 INR
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }
      return response.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/orders',
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(error.message);
      }

      // Create order in database
      await createOrderMutation.mutateAsync({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: formData,
      });

      await clearCart();
      
      toast({
        title: 'Order Placed Successfully!',
        description: 'Thank you for your purchase. You will receive an email confirmation shortly.',
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'There was an error processing your payment.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Place Order - ${total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Check if Stripe is configured
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      return; // Don't try to create payment intent without Stripe
    }

    // Conversion rate
    const USD_TO_INR = 83;
    const subtotal = totalPrice;
    const shipping = subtotal > 4150 ? 0 : 830;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create PaymentIntent
    const token = localStorage.getItem('token');
    // Ensure total is a number and not a string with commas
    const cleanTotal = typeof total === 'string' ? Number(total.replace(/,/g, '')) : total;
    console.log('[Checkout] Sending amount to backend:', cleanTotal, typeof cleanTotal);
    apiRequest('POST', '/api/create-payment-intent', { amount: cleanTotal }, {
      Authorization: `Bearer ${token}`
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to create payment intent');
        return response.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        console.error('Error creating payment intent:', error);
        toast({
          title: 'Payment Error',
          description: error.message || 'Failed to create payment intent',
          variant: 'destructive',
        });
      });
  }, [user, items, totalPrice, navigate]);

  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  // Show Stripe configuration message if not configured
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-4">Payment Setup Required</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            To enable checkout functionality, Stripe payment keys need to be configured. 
            This is a demo limitation - in production, payments would work normally.
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-8">
            <p>Items in cart: {items.length}</p>
            <p>Total value: ${totalPrice.toFixed(2)}</p>
          </div>
          <div className="space-x-4">
            <Link to="/cart">
              <Button variant="outline">Back to Cart</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  // Conversion rate
  const USD_TO_INR = 83;

  const subtotal = totalPrice;
  const shipping = subtotal > 4150 ? 0 : 830; // 50 USD = 4150 INR, 9.99 USD = 830 INR
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm">
                      {(item.product.price * item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : shipping.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{tax.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
