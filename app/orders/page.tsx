'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/app/actions';
import { Order } from '@/lib/types';
import { sortOrdersByDateAndTime } from '@/lib/orderUtils';
import { OrderCard } from '@/components/OrderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // Refresh every 5 seconds for multi-worker sync
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered = sortOrdersByDateAndTime(filtered);
    setFilteredOrders(filtered);
  }, [orders, searchQuery]);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: 'jarayonda' | 'bajarildi') {
    await updateOrderStatus(orderId, newStatus);
    await loadOrders();
  }

  async function handleDelete(orderId: string) {
    if (confirm('Buyurtmani oʻchirishga ishonchingiz komilmi?')) {
      await deleteOrder(orderId);
      await loadOrders();
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">Yuklanyapti...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">Buyurtmalar</h1>

          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buyurtma raqami yoki mijoz ismi"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Buyurtma topilmadi
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
