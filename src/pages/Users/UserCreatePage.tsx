
import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserCreatePage = () => {
  const [form, setForm] = useState({ name: '', email: '', role: 'Customer' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý submit
    console.log('Create user:', form);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tạo người dùng</h1>
        <Link to="/admin/users" className="text-sm text-slate-500">Quay lại</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <select
          className="w-full rounded-md border px-3 py-2"
          value={form.role}
          onChange={handleChange}
        >
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
        </select>

        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">
          Tạo
        </button>
      </form>
    </div>
  );
};

export default UserCreatePage;