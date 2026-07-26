import React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const users = [
  { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'Admin' },
  { id: '2', name: 'Alice', email: 'alice@techstore.com', role: 'Customer' },
];

const UserSearchPage = () => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tìm người dùng</h1>
        <Link to="/admin/users" className="text-sm text-slate-500">Quay lại</Link>
      </div>

      <input
        className="w-full rounded-md border px-3 py-2"
        placeholder="Nhập tên hoặc email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-2">
        {results.map((user) => (
          <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearchPage;