import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// --- BẮT ĐẦU: Dữ liệu giả lập (Giống bên ProductListPage) ---
// Trong thực tế, để lấy chi tiết bạn sẽ gọi API: fetch(`/api/products/${id}`)
const MOCK_PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 29990000, image: 'https://via.placeholder.com/300x300?text=iPhone+15', category: 'Điện thoại', description: 'Điện thoại cao cấp với chip A17 Pro, màn hình siêu nét, camera 48MP.' },
  { id: 2, name: 'MacBook Air M2', price: 25990000, image: 'https://via.placeholder.com/300x300?text=MacBook', category: 'Laptop', description: 'Laptop siêu nhẹ, hiệu năng mạnh mẽ với chip M2.' },
  { id: 3, name: 'AirPods Pro 2', price: 5990000, image: 'https://via.placeholder.com/300x300?text=AirPods', category: 'Phụ kiện', description: 'Tai nghe chống ồn chủ động, chất lượng âm thanh đỉnh cao.' },
  { id: 4, name: 'iPad Pro M1', price: 19990000, image: 'https://via.placeholder.com/300x300?text=iPad', category: 'Máy tính bảng', description: 'Máy tính bảng mạnh mẽ, hỗ trợ Apple Pencil và bàn phím Magic Keyboard.' },
];
// --- KẾT THÚC: Dữ liệu giả lập ---

const ProductDetailPage = () => {
  // useParams giúp lấy biến động trên URL. Ở AppRoutes, route là /products/:id nên tên là 'id'
  const { id } = useParams<{ id: string }>();
  
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Tìm sản phẩm trong mảng giả lập dựa trên ID (chuyển id dạng string sang number để so sánh)
      const foundProduct = MOCK_PRODUCTS.find((p) => p.id === Number(id));
      setProduct(foundProduct);
    }
  }, [id]);

  // Xử lý khi không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="container mx-auto p-10 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Không tìm thấy sản phẩm!</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Quay lại danh sách sản phẩm</Link>
      </div>
    );
  }

  // Xử lý khi chưa load xong (nếu gọi API bất đồng bộ, bạn có thể dùng thêm loading state)
  if (!product) return <div className="text-center p-10">Đang tải...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Nút Back */}
      <Link to="/products" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        ← Quay lại danh sách
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-8 p-6">
        {/* Cột Hình ảnh */}
        <div className="md:w-1/2 bg-gray-50 rounded-lg flex items-center justify-center p-4">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full max-h-[500px] object-contain rounded-lg" 
          />
        </div>

        {/* Cột Thông tin */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-blue-600 font-bold text-3xl mb-4">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
            <p className="text-gray-500 mb-4">Danh mục: <span className="font-medium text-gray-700">{product.category}</span></p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mô tả sản phẩm:</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Thêm vào giỏ hàng
            </button>
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;