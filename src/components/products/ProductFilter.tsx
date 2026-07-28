import {ChangeEvent} from 'react';

export interface ProductFilterValue {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

interface ProductFilterProps {
  value: ProductFilterValue;
  categories: Array<{ slug: string; label: string }>;
  onChange: (next: ProductFilterValue) => void;
  onApply?: (next: ProductFilterValue) => void;
}

const ProductFilter = ({
  value,
  categories,
  onChange,
  onApply,
}: ProductFilterProps) => {
  const update = (changes: Partial<ProductFilterValue>) => {
    onChange({
      ...value,
      ...changes,
    });
  };

  const normalizeNumber = (raw: string) => {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Danh mục
          <select
            value={value.categorySlug ?? ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => update({ categorySlug: e.target.value || undefined })}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Giá từ
          <input
            type="number"
            min="0"
            step="0.01"
            value={value.minPrice ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ minPrice: normalizeNumber(e.target.value) })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Giá đến
          <input
            type="number"
            min="0"
            step="0.01"
            value={value.maxPrice ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ inStockOnly: e.target.checked })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(value.inStockOnly)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          Chỉ còn hàng
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onApply?.(value)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;