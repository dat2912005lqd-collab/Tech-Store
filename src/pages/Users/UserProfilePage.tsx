import React from 'react';
import { Link, useParams } from 'react-router-dom';

const users = [
  { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'Admin' },
  { id: '2', name: 'Alice', email: 'alice@techstore.com', role: 'Customer' },
];

const UserProfilePage = () => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hồ sơ người dùng</h1>
        <Link to="/admin/users" className="text-sm text-slate-500">Quay lại</Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-600">Vai trò: {user.role}</div>
      </div>
    </div>
  );
};

export default UserProfilePage;