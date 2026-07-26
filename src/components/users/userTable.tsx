import React from 'react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const UserTable = ({
  users,
  onEdit,
  onDelete,
}: {
  users: UserRow[];
  onEdit?: (u: UserRow) => void;
  onDelete?: (id: string) => void;
}) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 text-left">
        <tr>
          <th className="p-3">Tên</th>
          <th className="p-3">Email</th>
          <th className="p-3">Vai trò</th>
          <th className="p-3">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-t">
            <td className="p-3">{u.name}</td>
            <td className="p-3">{u.email}</td>
            <td className="p-3">{u.role || '—'}</td>
            <td className="p-3 space-x-2">
              <button onClick={() => onEdit?.(u)} className="text-blue-600">Sửa</button>
              <button onClick={() => onDelete?.(u.id)} className="text-red-600">Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;