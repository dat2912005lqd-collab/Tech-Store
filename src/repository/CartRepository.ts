export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

class CartRepository {
  private key = 'tech-store:cart';

  private read(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  private write(items: CartItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.key, JSON.stringify(items));
    }
  }

  async getCurrent() {
    return this.read();
  }

  async setQuantity(id: string, quantity: number) {
    const items = this.read().map((item) => (item.id === id ? { ...item, quantity } : item));
    this.write(items);
    return items;
  }

  async clear() {
    this.write([]);
    return [];
  }

  async syncDemo() {
    const demo: CartItem[] = [{ id: '1', title: 'Laptop', price: 999, quantity: 1 }];
    this.write(demo);
    return demo;
  }
}

export default new CartRepository();