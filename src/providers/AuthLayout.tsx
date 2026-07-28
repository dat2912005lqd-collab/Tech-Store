
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-slate-900">
            Tech Store
          </Link>
          <p className="mt-2 text-sm text-slate-500">
            Đăng nhập hoặc tạo tài khoản để tiếp tục
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;