

interface ProductRow {
  id: string;
  title: string;
  price: number;
  category?: string;
  stock?: number;
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
}: {
  products: ProductRow[];
  onEdit?: (p: ProductRow) => void;
  onDelete?: (id: string) => void;
}) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 text-left">
        <tr>
          <th className="p-3">Tên</th>
          <th className="p-3">Danh mục</th>
          <th className="p-3">Giá</th>
          <th className="p-3">Tồn</th>
          <th className="p-3">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-3">{p.title}</td>
            <td className="p-3">{p.category || '—'}</td>
            <td className="p-3">${p.price}</td>
            <td className="p-3">{p.stock ?? '—'}</td>
            <td className="p-3 space-x-2">
              <button onClick={() => onEdit?.(p)} className="text-blue-600">Sửa</button>
              <button onClick={() => onDelete?.(p.id)} className="text-red-600">Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;