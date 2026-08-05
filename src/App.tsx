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

  const featuredProducts = useMemo(() => sortedProducts.slice(0, 4), [sortedProducts]);

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
    <div className="app-shell" style={{ minHeight: '100vh', padding: 24, fontFamily: 'Inter, Arial, sans-serif', color: '#111827' }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', display: 'grid', gap: 20 }}>
        <nav className="top-nav" style={{ background: '#fff', borderRadius: 24, padding: '16px 20px', boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 800, boxShadow: '0 12px 24px rgba(37, 99, 235, 0.25)' }}>T</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', letterSpacing: '0.08em' }}>TECHSTORE</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Premium electronics • curated experience</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600, padding: '8px 10px', borderRadius: 999, background: '#f8fafc' }}>Điện thoại</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, padding: '8px 10px', borderRadius: 999 }}>Laptop</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, padding: '8px 10px', borderRadius: 999 }}>Tablet</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, padding: '8px 10px', borderRadius: 999 }}>Âm thanh</a>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setSelectedCategory('all')} style={{ background: '#f8fafc', color: '#0f172a', fontWeight: 700 }}>Danh mục</button>
            <button type="button" style={{ background: '#111827', color: '#fff', fontWeight: 700 }}>Giỏ hàng ({cart.length})</button>
          </div>
        </nav>

        {statusMessage ? <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '12px 14px', borderRadius: 14, border: '1px solid #bfdbfe' }}>{statusMessage}</div> : null}

        <section style={{ display: 'grid', gap: 20, gridTemplateColumns: '1.15fr 0.85fr' }}>
          <div className="hero-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%)', borderRadius: 30, padding: 28, color: '#fff', display: 'grid', gap: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 'auto -30px -30px auto', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', filter: 'blur(0px)' }} />
            <div className="hero-pills" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span>Bảo hành chính hãng</span>
              <span>Giao hàng nội thành</span>
              <span>Ưu đãi cuối tuần</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.12, maxWidth: 620 }}>Thiết bị công nghệ tốt hơn cho mỗi ngày</h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.86)', fontSize: 16, maxWidth: 660 }}>Khám phá điện thoại, laptop, tai nghe và phụ kiện với trải nghiệm mua sắm hiện đại, bố cục rõ ràng và cảm giác chuyên nghiệp.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" style={{ background: '#fff', color: '#0f172a', fontWeight: 700, padding: '12px 16px' }}>Mua ngay</button>
              <button type="button" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, padding: '12px 16px' }}>Xem ưu đãi</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 6 }}>
              <div className="stat-pill" style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>4.9/5</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)' }}>Đánh giá khách hàng</div>
              </div>
              <div className="stat-pill" style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>30 ngày</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)' }}>Đổi trả dễ dàng</div>
              </div>
              <div className="stat-pill" style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>24/7</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)' }}>Hỗ trợ kỹ thuật</div>
              </div>
            </div>
          </div>

          <div className="hero-side-card" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #eef4ff 100%)', borderRadius: 30, padding: 24, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(148, 163, 184, 0.18)', display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hot deal</div>
                <h3 style={{ margin: '4px 0 0', fontSize: 24, color: '#0f172a' }}>iPhone 15 Pro</h3>
              </div>
              <div style={{ padding: '6px 10px', borderRadius: 999, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, fontSize: 12 }}>Mới</div>
            </div>
            <div style={{ borderRadius: 24, overflow: 'hidden', background: '#e2e8f0', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80" alt="iPhone" style={{ width: '100%', height: 270, objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.28) 100%)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: '#0f172a' }}>29.990.000 ₫</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Tiết kiệm 3 triệu</div>
              </div>
              <button type="button" onClick={() => setSelectedCategory('smartphones')} style={{ background: '#2563eb', color: '#fff', fontWeight: 700, padding: '10px 14px' }}>Xem điện thoại</button>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div className="feature-card" style={{ background: '#fff', borderRadius: 18, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🚚</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>Giao hàng siêu tốc</div>
            <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Nội thành trong 2 giờ cho các đơn gần bạn.</div>
          </div>
          <div className="feature-card" style={{ background: '#fff', borderRadius: 18, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🛡️</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>Thanh toán an toàn</div>
            <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Mã hóa dữ liệu và trải nghiệm checkout demo rõ ràng.</div>
          </div>
          <div className="feature-card" style={{ background: '#fff', borderRadius: 18, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>✨</div>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>Tư vấn chuyên sâu</div>
            <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Đội ngũ hỗ trợ chọn thiết bị phù hợp nhất cho bạn.</div>
          </div>
        </div>

        <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0 }}>Khám phá theo loại</h2>
              <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Lọc sản phẩm theo nhóm thiết bị yêu thích</div>
            </div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Bấm vào nhóm để xem sản phẩm phù hợp</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 16 }}>
            {['all', ...categories].filter((category, index, list) => list.indexOf(category) === index).slice(0, 8).map((category) => {
              const label = category === 'all' ? 'Tất cả' : category.replace(/-/g, ' ').replace(/\b\w/g, (value) => value.toUpperCase());
              const active = selectedCategory === category;
              const icon = category === 'all' ? '🧭' : category.includes('phone') ? '📱' : category.includes('lap') ? '💻' : category.includes('watch') ? '⌚' : category.includes('head') ? '🎧' : '📦';
              return (
                <button key={category} type="button" onClick={() => setSelectedCategory(category)} className="category-pill" style={{ background: active ? 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)' : '#f8fafc', color: active ? '#fff' : '#0f172a', padding: '14px 14px', borderRadius: 18, fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0 }}>Sản phẩm được yêu thích</h2>
              <div style={{ color: '#64748b', marginTop: 4 }}>Các thiết bị nổi bật và đáng chú ý nhất hiện nay</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm sản phẩm" style={{ minWidth: 220 }} />
              <select value={sortField} onChange={(event) => setSortField(event.target.value as SortField)} style={{ minWidth: 140 }}>
                <option value="title">Tên</option>
                <option value="price">Giá</option>
                <option value="rating">Đánh giá</option>
              </select>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} style={{ minWidth: 120 }}>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {featuredProducts.map((product) => {
              const finalPrice = normalizePrice(product.price, product.discountPercentage);
              return (
                <div key={product.id} className="product-card" style={{ display: 'grid', gap: 10, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, padding: '6px 8px', borderRadius: 999, background: '#dbeafe', color: '#1d4ed8', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best seller</div>
                  <div style={{ borderRadius: 20, overflow: 'hidden', background: '#f8fafc' }}>
                    <img src={safeImageUrl(product.thumbnail)} alt={product.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} onError={(event) => { event.currentTarget.src = PLACEHOLDER_IMAGE; }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.category}</span>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {product.rating}</span>
                  </div>
                  <strong style={{ fontSize: 16, color: '#0f172a' }}>{product.title}</strong>
                  <p style={{ margin: 0, color: '#64748b', minHeight: 44 }}>{product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{finalPrice.toLocaleString('vi-VN')} ₫</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toLocaleString('vi-VN')} ₫</div>
                    </div>
                    <button type="button" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: '#fff', fontWeight: 700 }}>Thêm vào giỏ</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1.25fr 0.75fr' }}>
          <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <h2 style={{ margin: 0 }}>Danh sách sản phẩm</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} style={{ minWidth: 160 }}>
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 12, display: 'flex', gap: 12 }}>
                    <div style={{ width: 84, height: 84, borderRadius: 14, background: '#e2e8f0' }} />
                    <div style={{ flex: 1, display: 'grid', gap: 8 }}>
                      <div style={{ height: 10, width: '60%', background: '#e2e8f0', borderRadius: 999 }} />
                      <div style={{ height: 10, width: '80%', background: '#f8fafc', borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {sortedProducts.map((product) => (
                  <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: 18, padding: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <img src={safeImageUrl(product.thumbnail)} alt={product.title} style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: 14 }} onError={(event) => { event.currentTarget.src = PLACEHOLDER_IMAGE; }} />
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <strong>{product.title}</strong>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {product.rating}</span>
                      </div>
                      <p style={{ margin: '6px 0', color: '#64748b' }}>{product.description}</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{product.brand}</span>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{product.category}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => toggleProductDetail(product.id)} style={{ background: '#111827', color: '#fff', fontWeight: 700 }}>Chi tiết</button>
                      <button type="button" onClick={() => addToCart(product)} style={{ background: '#2563eb', color: '#fff', fontWeight: 700 }}>Giỏ hàng</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: 'grid', gap: 20 }}>
            <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0 }}>Đăng nhập</h2>
                <button type="button" onClick={handleProtectedProfile} disabled={profileLoading} style={{ background: '#111827', color: '#fff', fontWeight: 700 }}>
                  {profileLoading ? 'Đang tải...' : '/auth/me'}
                </button>
              </div>
              {!session ? (
                <form onSubmit={handleLogin} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                  <input value={authForm.username} onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))} placeholder="Tên đăng nhập" />
                  <input type="password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} placeholder="Mật khẩu" />
                  {authError ? <div style={{ color: '#b91c1c' }}>{authError}</div> : null}
                  <button type="submit" style={{ background: '#2563eb', color: '#fff', fontWeight: 700 }}>Đăng nhập</button>
                </form>
              ) : (
                <div style={{ marginTop: 12, color: '#475569' }}>
                  <p style={{ marginBottom: 8 }}>Bạn đang đăng nhập với {session.user.username}.</p>
                  <button type="button" onClick={() => clearSession()} style={{ background: '#f8fafc', color: '#0f172a', fontWeight: 700 }}>Đăng xuất</button>
                </div>
              )}
            </section>

            <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Giỏ hàng</h2>
              {cart.length === 0 ? <div style={{ color: '#64748b' }}>Giỏ hàng đang trống.</div> : cart.map((item) => (
                <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <strong>{item.title}</strong>
                    <div style={{ color: '#64748b', fontSize: 12 }}>SL {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} style={{ background: '#f8fafc', color: '#0f172a' }}>-</button>
                    <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} style={{ background: '#f8fafc', color: '#0f172a' }}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, fontWeight: 800, color: '#0f172a' }}>Tổng: ${totalCartValue.toFixed(2)}</div>
            </section>

            <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Thanh toán</h2>
              <form onSubmit={handleCheckout} style={{ display: 'grid', gap: 10 }}>
                <input value={checkoutInfo.card} onChange={(event) => setCheckoutInfo((current) => ({ ...current, card: event.target.value }))} placeholder="Số thẻ demo" />
                <input value={checkoutInfo.address} onChange={(event) => setCheckoutInfo((current) => ({ ...current, address: event.target.value }))} placeholder="Địa chỉ giao hàng" />
                <button type="submit" style={{ background: '#059669', color: '#fff', fontWeight: 700 }}>Thanh toán demo</button>
                {checkoutSuccess ? <div style={{ color: '#059669' }}>{checkoutSuccess}</div> : null}
              </form>
            </section>

            <section style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)' }}>
              <h2 style={{ marginTop: 0 }}>Chi tiết sản phẩm</h2>
              {selectedProduct ? (
                <div style={{ display: 'grid', gap: 8 }}>
                  <strong>{selectedProduct.title}</strong>
                  <p style={{ margin: 0, color: '#64748b' }}>{selectedProduct.description}</p>
                  <div style={{ color: '#2563eb', fontWeight: 700 }}>Giá ưu đãi: ${normalizePrice(selectedProduct.price, selectedProduct.discountPercentage).toFixed(2)}</div>
                  <div style={{ marginTop: 6 }}>
                    <strong>Đánh giá</strong>
                    <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                      {selectedProduct.reviews?.map((review) => (
                        <div key={review.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>{review.reviewerName}</span>
                            <span style={{ fontSize: 12, color: '#2563eb', background: '#dbeafe', padding: '3px 8px', borderRadius: 999 }}>{review.source === 'local-demo' ? 'local-demo' : 'embedded'}</span>
                          </div>
                          <div style={{ color: '#64748b', marginTop: 4 }}>{review.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#64748b' }}>Chọn một sản phẩm để xem chi tiết.</div>
              )}
            </section>
          </div>
        </div>

        <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)', borderRadius: 28, padding: 28, color: '#fff', display: 'grid', gap: 20, gridTemplateColumns: '1fr 0.9fr' }}>
          <div>
            <div style={{ color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>Đăng ký nhận ưu đãi</div>
            <h2 style={{ margin: '8px 0 10px', fontSize: 28, color: '#fff' }}>Nhận thông tin khuyến mãi mới nhất</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', maxWidth: 520 }}>Cập nhật ngay các chương trình giảm giá, sản phẩm mới và chính sách giao hàng.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 18, display: 'grid', gap: 10 }}>
            <input placeholder="Email của bạn" style={{ background: '#fff', color: '#0f172a' }} />
            <button type="button" style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>Đăng ký demo</button>
          </div>
        </section>

        <footer style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)', display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>TechStore</div>
              <div style={{ color: '#64748b', marginTop: 4 }}>Demo React với dữ liệu DummyJSON cho mục đích học tập.</div>
            </div>
            <div style={{ display: 'flex', gap: 12, color: '#475569', flexWrap: 'wrap' }}>
              <span>Điện thoại</span>
              <span>Laptop</span>
              <span>Tablet</span>
              <span>Phụ kiện</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;