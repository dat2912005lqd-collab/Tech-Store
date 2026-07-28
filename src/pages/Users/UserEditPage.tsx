
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const users = [
  { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'Admin' },
  { id: '2', name: 'Alice', email: 'alice@techstore.com', role: 'Customer' },
];

const UserEditPage = () => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  const [form, setForm] = useState({ name: '', email: '', role: 'Customer' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role });
    }
  }, [user]);

  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chỉnh sửa người dùng</h1>
        <Link to="/admin/users" className="text-sm text-slate-500">Quay lại</Link>
      </div>

      <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <input
          className="w-full rounded-md border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-md border px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select
          className="w-full rounded-md border px-3 py-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
        </select>

        <button type="submit" className="rounded-md bg-amber-600 px-4 py-2 text-white">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default UserEditPage;