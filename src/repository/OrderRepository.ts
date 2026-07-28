 import {Order} from '@/types';
class OrderRepository {
  async list() {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json() as Promise<Order[]>;
  }

  async detail(id: string) {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Failed to load order');
    return res.json() as Promise<Order>;
  }

  async create(payload: Partial<Order>) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json() as Promise<Order>;
  }
}

export default new OrderRepository();