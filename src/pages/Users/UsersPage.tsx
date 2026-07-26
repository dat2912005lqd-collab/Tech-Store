import React from 'react';
import { Link } from 'react-router-dom';

const users = [
  { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'Admin' },
  { id: '2', name: 'Alice', email: 'alice@techstore.com', role: 'Customer' },
];

const UsersPage = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
        <p className="text-sm text-slate-500">Danh sách tài khoản</p>
      </div>
      <Link to="/admin/users/create" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
        + Thêm
      </Link>
    </div>

    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link to={`/admin/users/${user.id}`} className="text-blue-600">Chi tiết</Link>
            <Link to={`/admin/users/${user.id}/edit`} className="text-amber-600">Sửa</Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UsersPage;