import type { Product } from '../models/product';

class ProductRepository {
  async list(params: { limit?: number; skip?: number; search?: string; category?: string; sort?: string; order?: string } = {}) {
    const query = new URLSearchParams();

    if (params.limit) query.set('limit', String(params.limit));
    if (params.skip) query.set('skip', String(params.skip));
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.sort) query.set('sort', params.sort);
    if (params.order) query.set('order', params.order);

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json() as Promise<{ products: Product[]; total: number; skip: number; limit: number }>;
  }

  async detail(id: string) {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to load product');
    return res.json() as Promise<Product>;
  }

  async search(query: string, params?: { limit?: number; skip?: number; category?: string }) {
    return this.list({ ...params, search: query });
  }
}

export default new ProductRepository();