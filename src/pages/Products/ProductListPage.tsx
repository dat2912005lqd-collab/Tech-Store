import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Dùng để chuyển trang khi click vào sản phẩm

// --- BẮT ĐẦU: Phần dữ liệu giả lập (Mock Data) ---
// Trong thực tế, bạn sẽ gọi API ở đây (ví dụ: await fetch('/api/products'))
const MOCK_PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 29990000, image: 'https://via.placeholder.com/300x300?text=iPhone+15', category: 'Điện thoại' },
  { id: 2, name: 'MacBook Air M2', price: 25990000, image: 'https://via.placeholder.com/300x300?text=MacBook', category: 'Laptop' },
  { id: 3, name: 'AirPods Pro 2', price: 5990000, image: 'https://via.placeholder.com/300x300?text=AirPods', category: 'Phụ kiện' },
  { id: 4, name: 'iPad Pro M1', price: 19990000, image: 'https://via.placeholder.com/300x300?text=iPad', category: 'Máy tính bảng' },
];
// --- KẾT THÚC: Phần dữ liệu giả lập ---

const ProductListPage = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Hàm lọc sản phẩm khi người dùng gõ tìm kiếm
  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setProducts(MOCK_PRODUCTS);
    } else {
      const filtered = MOCK_PRODUCTS.filter((p) => 
        p.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [searchKeyword]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh sách sản phẩm</h1>

      {/* Thanh tìm kiếm */}
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchKeyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* Danh sách sản phẩm dạng lưới (Grid) */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            // Link bao quanh để dẫn đến trang chi tiết sản phẩm
            <Link 
              key={product.id} 
              to={`/products/${product.id}`} 
              className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                <p className="text-blue-600 font-bold text-xl mt-2">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;