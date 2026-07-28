
import { Link, useParams } from 'react-router-dom';

const users = [
  { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'Admin' },
  { id: '2', name: 'Alice', email: 'alice@techstore.com', role: 'Customer' },
];

const UserDetailPage = () => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chi tiết người dùng</h1>
        <Link to="/admin/users" className="text-sm text-slate-500">Quay lại</Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">ID: {user.id}</p>
        <h2 className="mt-2 text-xl font-semibold">{user.name}</h2>
        <p className="mt-2 text-slate-600">{user.email}</p>
        <p className="mt-2 text-sm text-blue-600">{user.role}</p>
      </div>
    </div>
  );
};

export default UserDetailPage;