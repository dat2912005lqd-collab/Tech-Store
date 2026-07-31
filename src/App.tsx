import React, { useEffect, useState } from 'react';

// Định nghĩa interface cho sản phẩm
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
}

// Định nghĩa interface cho response từ API
interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

function App() {
  // SỬA: Khai báo kiểu dữ liệu cho state
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=10')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        console.log('Data loaded:', data);
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
        console.error('Error fetching data:', error.message);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🛒 Tech Store</h1>
      
      {loading && <p>⏳ Đang tải dữ liệu...</p>}
      
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px' }}>
          ❌ Lỗi: {error}
        </div>
      )}
      
      {data && (
        <div>
          <p>✅ Đã tải {data.products?.length || 0} sản phẩm</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {data.products.map((product) => (
              <div key={product.id} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <h3 style={{ fontSize: '16px', margin: '8px 0' }}>{product.title}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>{product.brand}</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;