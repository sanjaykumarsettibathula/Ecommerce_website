import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    apiRequest('GET', '/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading || loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (!user) return <div className="p-8 text-center">Not logged in.</div>;
  if (!orders.length) return <div className="p-8 text-center">You have no orders yet.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm">Status: <span className="font-medium">{order.status}</span></span>
                <span className="ml-4 text-sm">Total: <span className="font-medium">₹{Number(order.total).toLocaleString('en-IN')}</span></span>
              </div>
              <div>
                <span className="text-sm font-medium">Items:</span>
                <ul className="list-disc ml-6">
                  {order.items && Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                    <li key={idx} className="text-sm">
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}