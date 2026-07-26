import React from 'react';
import { Product } from '../../models/product';

interface ProductDetailProps {
  product: Product & {
    description?: string;
    brand?: string;
    category?: string;
    stock?: number;
    discountPercentage?: number;
  };
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  return (
    <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr]">
      <div>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-[320px] w-full rounded-xl object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">{product.category || 'Sản phẩm'}</p>
          <h2 className="text-3xl font-semibold text-slate-900">{product.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            ⭐ {product.rating}
          </span>
          {product.stock !== undefined && (
            <span className="text-sm text-slate-500">Còn {product.stock} sản phẩm</span>
          )}
        </div>

        <p className="leading-7 text-slate-600">
          {product.description || 'Chưa có mô tả cho sản phẩm này.'}
        </p>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-slate-900">${product.price}</span>
          {product.discountPercentage && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
              Giảm {product.discountPercentage}%
            </span>
          )}
        </div>

        {product.brand && (
          <p className="text-sm text-slate-500">Thương hiệu: {product.brand}</p>
        )}

        <button
          type="button"
          className="w-fit rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;