import {ChangeEvent} from 'react';

type SortField = 'title' | 'price' | 'rating' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortFields: Array<{ value: SortField; label: string }> = [
  { value: 'title', label: 'Tên' },
  { value: 'price', label: 'Giá' },
  { value: 'rating', label: 'Đánh giá' },
  { value: 'createdAt', label: 'Mới nhất' },
];

const sortOrders: Array<{ value: SortOrder; label: string }> = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' },
];

const ProductSort = ({ value, onChange }: ProductSortProps) => {
  const handleFieldChange = (field: string) => {
    onChange({
      field: field as SortField,
      order: value.order,
    });
  };

  const handleOrderChange = (order: string) => {
    onChange({
      field: value.field,
      order: order as SortOrder,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <label className="text-sm font-medium text-slate-700">
        Sắp xếp
        <select
          value={value.order}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleOrderChange(e.target.value)}
          className="ml-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {sortFields.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Thứ tự
        <select
          value={value.order}
           onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleOrderChange(e.target.value)}
          className="ml-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {sortOrders.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ProductSort;