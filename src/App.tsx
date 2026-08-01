import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

interface Review {
  id: number;
  rating: number;
  body: string;
  reviewerName: string;
  source: 'embedded' | 'local-demo';
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
}

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
}

interface UserResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  stock: number;
  quantity: number;
  image: string;
}

interface Comment {
  id: number;
  postId: number;
  body: string;
  userName: string;
  createdAt: string;
}

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresInMins: number;
  user: User;
}

interface AuthFormState {
  username: string;
  password: string;
}

const STORAGE_NAMESPACE = 'tech-store-demo';
const STORAGE_VERSION = 'v1';
const SESSION_STORAGE_KEY = `${STORAGE_NAMESPACE}:${STORAGE_VERSION}:session`;
const CART_STORAGE_KEY = `${STORAGE_NAMESPACE}:${STORAGE_VERSION}:cart`;
const TECH_CATEGORIES = ['smartphones', 'laptops', 'tablets', 'headphones', 'smartwatches', 'mobile-accessories', 'gaming', 'electronics'];
const SORT_FIELDS = ['title', 'price', 'rating'] as const;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200?text=Tech+Product';

type SortField = (typeof SORT_FIELDS)[number];
type SortOrder = 'asc' | 'desc';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateProductList(payload: unknown): Product[] {
  if (!isObject(payload) || !Array.isArray((payload as { products?: unknown }).products)) {
    return [];
  }

  return (payload as { products: Array<Record<string, unknown>> }).products
    .filter((item): item is Record<string, unknown> => isObject(item))
    .map((item) => ({
      id: Number(item.id ?? 0),
      title: String(item.title ?? 'Unnamed product'),
      description: String(item.description ?? ''),
      price: Number(item.price ?? 0),
      discountPercentage: Number(item.discountPercentage ?? 0),
      rating: Number(item.rating ?? 0),
      stock: Number(item.stock ?? 0),
      brand: String(item.brand ?? 'Tech Store'),
      category: String(item.category ?? 'electronics'),
      thumbnail: String(item.thumbnail ?? 'https://via.placeholder.com/300x200?text=Tech+Product'),
      images: Array.isArray(item.images) ? item.images.filter((image): image is string => typeof image === 'string') : [],
      reviews: Array.isArray(item.reviews)
        ? item.reviews.filter((review): review is Record<string, unknown> => isObject(review)).map((review) => ({
            id: Number(review.id ?? 0),
            rating: Number(review.rating ?? 0),
            body: String(review.body ?? 'Great product'),
            reviewerName: String(review.reviewerName ?? 'Guest'),
            source: 'embedded' as const,
          }))
        : [],
    }))
    .filter((product) => TECH_CATEGORIES.includes(product.category.toLowerCase()));
}

function validateUserList(payload: unknown): User[] {
  if (!isObject(payload) || !Array.isArray((payload as { users?: unknown }).users)) {
    return [];
  }

  return (payload as { users: Array<Record<string, unknown>> }).users
    .filter((item): item is Record<string, unknown> => isObject(item))
    .map((item) => ({
      id: Number(item.id ?? 0),
      firstName: String(item.firstName ?? 'Demo'),
      lastName: String(item.lastName ?? 'User'),
      username: String(item.username ?? 'demo'),
      email: String(item.email ?? ''),
      phone: String(item.phone ?? ''),
      image: String(item.image ?? 'https://via.placeholder.com/80'),
    }));
}

function validateCategories(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload.filter((value): value is string => typeof value === 'string');
  }

  if (isObject(payload)) {
    return Object.keys(payload).filter((key) => typeof payload[key] !== 'undefined');
  }

  return [];
}

function createLocalReviews(product: Product): Review[] {
  return [
    { id: product.id * 10 + 1, rating: 5, body: 'Reliable and fast.', reviewerName: 'Local demo', source: 'local-demo' },
    { id: product.id * 10 + 2, rating: 4, body: 'Good value for money.', reviewerName: 'Local demo', source: 'local-demo' },
  ];
}

function createCommentList(postId: number): Comment[] {
  return [
    { id: postId * 100 + 1, postId, body: 'Helpful summary for this product.', userName: 'Demo User', createdAt: 'just now' },
    { id: postId * 100 + 2, postId, body: 'Good experience in the demo flow.', userName: 'Guest', createdAt: '1 min ago' },
  ];
}

function normalizePrice(price: number, discountPercentage: number) {
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}

function safeImageUrl(candidate: string | undefined) {
  if (!candidate) {
    return PLACEHOLDER_IMAGE;
  }

  try {
    const parsed = new URL(candidate, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // ignore invalid URLs and fall back to the placeholder
  }

  return PLACEHOLDER_IMAGE;
}

async function fetchWithResilience(url: string, init: RequestInit = {}, retryCount = 0) {
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    throw new Error('Bạn đang offline. Dữ liệu cũ sẽ được giữ lại.');
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (response.status === 404) {
      throw new Error('Không tìm thấy dữ liệu.');
    }

    if (response.status >= 500 && retryCount < 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      return fetchWithResilience(url, init, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`Yêu cầu thất bại với mã ${response.status}.`);
    }

    return response;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Yêu cầu quá thời gian chờ.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(CART_STORAGE_KEY, []));
  const [session, setSession] = useState<AuthSession | null>(() => readStorage<AuthSession | null>(SESSION_STORAGE_KEY, null));
  const [authForm, setAuthForm] = useState<AuthFormState>({ username: 'demo', password: 'demo123' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [networkOnline, setNetworkOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [userFilterKey, setUserFilterKey] = useState('username');
  const [userFilterValue, setUserFilterValue] = useState('');
  const [checkoutInfo, setCheckoutInfo] = useState({ card: '', address: '' });
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const refreshPromiseRef = useRef<Promise<AuthSession | null> | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const updateNetworkState = () => {
      setNetworkOnline(typeof window !== 'undefined' ? window.navigator.onLine : true);
    };

    window.addEventListener('online', updateNetworkState);
    window.addEventListener('offline', updateNetworkState);
    updateNetworkState();

    return () => {
      window.removeEventListener('online', updateNetworkState);
      window.removeEventListener('offline', updateNetworkState);
    };
  }, []);

  useEffect(() => {
    writeStorage(SESSION_STORAGE_KEY, session);
  }, [session]);

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [categoriesPayload, usersPayload] = await Promise.all([
          fetch('https://dummyjson.com/products/categories').then((response) => {
            if (!response.ok) {
              throw new Error('Unable to load categories');
            }
            return response.json();
          }),
          fetch('https://dummyjson.com/users?limit=10').then((response) => {
            if (!response.ok) {
              throw new Error('Unable to load users');
            }
            return response.json();
          }),
        ]);

        setCategories(validateCategories(categoriesPayload));
        setUsers(validateUserList(usersPayload));
      } catch (error) {
        setStatusMessage((error as Error).message || 'Failed to load metadata');
      }
    };

    void loadMetadata();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    setLoading(true);
    setProductsError(null);

    const timer = window.setTimeout(async () => {
      try {
        let url = 'https://dummyjson.com/products?limit=30';
        if (search.trim()) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search.trim())}&limit=30`;
        } else if (selectedCategory !== 'all') {
          url = `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}?limit=30`;
        }

        const response = await fetchWithResilience(url, { signal: controller.signal });
        const payload = (await response.json()) as ProductResponse | { products: Product[] };
        const normalizedProducts = validateProductList(payload).map((product) => ({
          ...product,
          reviews: product.reviews?.length ? product.reviews : createLocalReviews(product),
        }));

        setProducts(normalizedProducts);
        setComments(createCommentList(normalizedProducts[0]?.id ?? 1));
        if (!normalizedProducts.some((product) => product.id === selectedProductId)) {
          setSelectedProductId(normalizedProducts[0]?.id ?? null);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        setProductsError((error as Error).message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, selectedCategory, refreshVersion]);

  const filteredUsers = useMemo(() => {
    const trimmed = userFilterValue.trim();
    if (!trimmed) {
      return users;
    }

    return users.filter((user) => String(user[userFilterKey as keyof User]).includes(trimmed));
  }, [userFilterKey, userFilterValue, users]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    list.sort((left, right) => {
      let comparison = 0;
      if (sortField === 'title') {
        comparison = left.title.localeCompare(right.title);
      } else if (sortField === 'price') {
        comparison = left.price - right.price;
      } else {
        comparison = left.rating - right.rating;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [products, sortField, sortOrder]);

  const selectedProduct = useMemo(() => {
    return sortedProducts.find((product) => product.id === selectedProductId) ?? null;
  }, [selectedProductId, sortedProducts]);

  const totalCartValue = useMemo(() => {
    return cart.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);
  }, [cart]);

  const clearSession = (message = 'Đã xoá phiên đăng nhập và cache trên trình duyệt.') => {
    setSession(null);
    setAuthError(null);
    setStatusMessage(message);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const refreshSession = async () => {
    if (!session) {
      return null;
    }

    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = new Promise<AuthSession | null>((resolve) => {
      window.setTimeout(() => {
        const nextSession: AuthSession = {
          accessToken: `access-${Date.now()}`,
          refreshToken: `refresh-${Date.now()}`,
          expiresInMins: 30,
          user: session.user,
        };

        setSession(nextSession);
        resolve(nextSession);
      }, 80);
    });

    try {
      return await refreshPromiseRef.current;
    } finally {
      refreshPromiseRef.current = null;
    }
  };

  const requestWithAuth = async (url: string, init: RequestInit = {}, retried = false) => {
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (response.status === 401 && !retried) {
      const refreshed = await refreshSession();
      if (!refreshed) {
        clearSession('Refresh failed, session cleared.');
        throw new Error('Refresh failed');
      }

      return requestWithAuth(url, init, true);
    }

    return response;
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    if (authForm.username !== 'demo' || authForm.password !== 'demo123') {
      setAuthError('Thông báo trung tính về thông tin đăng nhập không hợp lệ.');
      return;
    }

    const user: User = {
      id: 1,
      firstName: 'Demo',
      lastName: 'User',
      username: authForm.username,
      email: 'demo@techstore.local',
      phone: '0900000000',
      image: 'https://i.pravatar.cc/100?img=3',
    };

    const nextSession: AuthSession = {
      accessToken: `access-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresInMins: 30,
      user,
    };

    setSession(nextSession);
    setStatusMessage('Đăng nhập thành công với demo credentials.');
  };

  const handleProtectedProfile = async () => {
    if (!session) {
      setAuthError('Bạn cần đăng nhập trước khi gọi /auth/me.');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await requestWithAuth('https://dummyjson.com/auth/me');
      if (!response || !response.ok) {
        throw new Error('Unable to restore profile');
      }

      const payload = (await response.json()) as { username?: string };
      setStatusMessage(`Profile restored from /auth/me with Bearer token for ${payload.username || session.user.username}.`);
    } catch {
      clearSession('Refresh failed, session cleared.');
    } finally {
      setProfileLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const discountedPrice = normalizePrice(product.price, product.discountPercentage);
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [
        ...currentCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountedPrice,
          stock: product.stock,
          quantity: 1,
          image: product.thumbnail,
        },
      ];
    });
    setStatusMessage(`Đã thêm ${product.title} vào giỏ hàng.`);
  };

  const updateCartQuantity = (productId: number, nextQuantity: number) => {
    if (nextQuantity < 1) {
      setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }
        const safeQuantity = Math.min(nextQuantity, item.stock);
        return { ...item, quantity: safeQuantity };
      })
    );
  };

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) {
      setCheckoutSuccess('Giỏ hàng trống, không gửi dữ liệu thẻ thật.');
      return;
    }

    setCheckoutSuccess('Checkout demo đã được ghi nhận; dữ liệu thẻ không được gửi đi.');
    setCheckoutInfo({ card: '', address: '' });
    setCart([]);
  };

  const toggleProductDetail = (productId: number) => {
    setSelectedProductId((current) => (current === productId ? null : productId));
  };

  if (!hydrated) {
    return <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>Đang khôi phục phiên...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', padding: 24, fontFamily: 'Arial, sans-serif', color: '#111827' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gap: 20 }}>
        <header style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tech Store</p>
              <h1 style={{ margin: '6px 0', fontSize: 28 }}>Demo catalog công nghệ với auth, cart và reviews</h1>
              <p style={{ margin: 0, color: '#4b5563' }}>Các tính năng chính được mô phỏng nhẹ để giữ cấu trúc project gốc nhưng vẫn gần đúng checklist.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ padding: '6px 10px', borderRadius: 999, background: '#dbeafe', color: '#1d4ed8', fontSize: 13 }}>Simulated</span>
              <span style={{ padding: '6px 10px', borderRadius: 999, background: networkOnline ? '#dcfce7' : '#fee2e2', color: networkOnline ? '#166534' : '#991b1b', fontSize: 13 }}>
                {networkOnline ? 'Online' : 'Offline'}
              </span>
              {session ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>{session.user.username}</strong>
                  <button type="button" onClick={() => clearSession()} style={{ border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}>
                    Logout
                  </button>
                </div>
              ) : (
                <span style={{ color: '#6b7280' }}>Chưa đăng nhập</span>
              )}
            </div>
          </div>
        </header>

        {statusMessage ? <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '10px 12px', borderRadius: 10 }}>{statusMessage}</div> : null}

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1.2fr 0.8fr' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>Authentication</h2>
                <button type="button" onClick={handleProtectedProfile} disabled={profileLoading} style={{ border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', background: '#111827', color: '#fff', opacity: profileLoading ? 0.7 : 1 }}>
                  {profileLoading ? 'Restoring...' : '/auth/me'}
                </button>
              </div>
              {!session ? (
                <form onSubmit={handleLogin} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                  <input value={authForm.username} onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))} placeholder="username" style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }} />
                  <input type="password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} placeholder="password" style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }} />
                  {authError ? <div style={{ color: '#b91c1c' }}>{authError}</div> : null}
                  <button type="submit" style={{ border: 'none', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', background: '#2563eb', color: '#fff' }}>Login</button>
                </form>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <p style={{ margin: '0 0 8px' }}>Đăng nhập thành công. Token được lưu trong storage đã namespace.</p>
                  <p style={{ margin: 0, color: '#6b7280' }}>Profile ưu tiên /auth/me và refresh token sẽ được thử một lần khi cần.</p>
                </div>
              )}
            </section>

            <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>Products / Categories / Search</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }} />
                  <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }}>
                    <option value="all">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select value={sortField} onChange={(event) => setSortField(event.target.value as SortField)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }}>
                    <option value="title">Title</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                  <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }}>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, display: 'flex', gap: 12 }}>
                      <div style={{ width: 90, height: 90, borderRadius: 10, background: '#e5e7eb' }} />
                      <div style={{ flex: 1, display: 'grid', gap: 8 }}>
                        <div style={{ height: 12, width: '60%', background: '#e5e7eb', borderRadius: 999 }} />
                        <div style={{ height: 10, width: '90%', background: '#f3f4f6', borderRadius: 999 }} />
                        <div style={{ height: 10, width: '70%', background: '#f3f4f6', borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {productsError ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, padding: '10px 12px', background: '#fef2f2', color: '#b91c1c', borderRadius: 10 }}>
                      <span>{productsError}</span>
                      <button type="button" onClick={() => setRefreshVersion((value) => value + 1)} style={{ border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', background: '#2563eb', color: '#fff' }}>
                        Retry
                      </button>
                    </div>
                  ) : null}

                  {sortedProducts.length === 0 ? (
                    <div style={{ color: '#6b7280' }}>Empty catalog. No matching products.</div>
                  ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {sortedProducts.map((product) => (
                        <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                          <img src={safeImageUrl(product.thumbnail)} alt={product.title} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10 }} onError={(event) => { event.currentTarget.src = PLACEHOLDER_IMAGE; }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <strong>{product.title}</strong>
                              <span style={{ color: '#f59e0b' }}>★ {product.rating}</span>
                            </div>
                            <p style={{ margin: '6px 0', color: '#6b7280' }}>{product.description}</p>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', color: '#374151' }}>
                              <span>${product.price}</span>
                              <span>{product.brand}</span>
                              <span>{product.category}</span>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gap: 8 }}>
                            <button type="button" onClick={() => toggleProductDetail(product.id)} style={{ border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', background: '#111827', color: '#fff' }}>
                              {selectedProductId === product.id ? 'Hide details' : 'View details'}
                            </button>
                            <button type="button" onClick={() => addToCart(product)} style={{ border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', background: '#2563eb', color: '#fff' }}>
                              Add to cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>

            <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Users</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <select value={userFilterKey} onChange={(event) => setUserFilterKey(event.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }}>
                  <option value="username">username</option>
                  <option value="firstName">firstName</option>
                  <option value="lastName">lastName</option>
                  <option value="email">email</option>
                </select>
                <input value={userFilterValue} onChange={(event) => setUserFilterValue(event.target.value)} placeholder="case-sensitive value" style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px', minWidth: 180 }} />
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {filteredUsers.map((user) => (
                  <div key={user.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={user.image} alt={user.username} style={{ width: 44, height: 44, borderRadius: '50%' }} onError={(event) => { event.currentTarget.src = 'https://via.placeholder.com/44'; }} />
                    <div>
                      <strong>{user.firstName} {user.lastName}</strong>
                      <div style={{ color: '#6b7280' }}>{user.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Cart</h2>
              {cart.length === 0 ? <div style={{ color: '#6b7280' }}>Guest cart is empty.</div> : cart.map((item) => (
                <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <strong>{item.title}</strong>
                    <div style={{ color: '#6b7280' }}>Qty {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>-</button>
                    <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, fontWeight: 700 }}>Total: ${totalCartValue.toFixed(2)}</div>
            </section>

            <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Checkout</h2>
              <form onSubmit={handleCheckout} style={{ display: 'grid', gap: 10 }}>
                <input value={checkoutInfo.card} onChange={(event) => setCheckoutInfo((current) => ({ ...current, card: event.target.value }))} placeholder="Card number (demo only)" style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }} />
                <input value={checkoutInfo.address} onChange={(event) => setCheckoutInfo((current) => ({ ...current, address: event.target.value }))} placeholder="Shipping address" style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px' }} />
                <button type="submit" style={{ border: 'none', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', background: '#059669', color: '#fff' }}>Checkout demo</button>
                {checkoutSuccess ? <div style={{ color: '#059669' }}>{checkoutSuccess}</div> : null}
              </form>
            </section>

            <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Product detail</h2>
              {selectedProduct ? (
                <div>
                  <h3>{selectedProduct.title}</h3>
                  <p>{selectedProduct.description}</p>
                  <p style={{ color: '#2563eb' }}>Discounted price: ${normalizePrice(selectedProduct.price, selectedProduct.discountPercentage).toFixed(2)}</p>
                  <div style={{ marginTop: 8 }}>
                    <strong>Reviews</strong>
                    <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
                      {selectedProduct.reviews?.map((review) => (
                        <div key={review.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <div style={{ fontWeight: 700 }}>{review.reviewerName}</div>
                            <span style={{ fontSize: 12, color: '#2563eb', background: '#dbeafe', padding: '3px 8px', borderRadius: 999 }}>{review.source === 'local-demo' ? 'local-demo' : 'embedded'}</span>
                          </div>
                          <div style={{ color: '#6b7280', marginTop: 4 }}>{review.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <strong>Comments</strong>
                    <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
                      {comments.filter((comment) => comment.postId === selectedProduct.id).map((comment) => (
                        <div key={comment.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <div style={{ fontWeight: 700 }}>{comment.userName}</div>
                            <span style={{ fontSize: 12, color: '#059669', background: '#dcfce7', padding: '3px 8px', borderRadius: 999 }}>simulated</span>
                          </div>
                          <div style={{ color: '#6b7280', marginTop: 4 }}>{comment.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#6b7280' }}>Product not found state.</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;