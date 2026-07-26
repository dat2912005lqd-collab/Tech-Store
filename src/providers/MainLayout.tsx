import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
            Tech Store
          </Link>

          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link to="/products" className="hover:text-blue-600">
              Sản phẩm
            </Link>
            <Link to="/about" className="hover:text-blue-600">
              Giới thiệu
            </Link>
            <Link to="/cart" className="hover:text-blue-600">
              Giỏ hàng
            </Link>
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Tech Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-blue-600">
              Chính sách
            </Link>
            <Link to="/contact" className="hover:text-blue-600">
              Liên hệ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;