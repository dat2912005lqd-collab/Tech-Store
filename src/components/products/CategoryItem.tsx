import React from 'react';

interface CategoryItemProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryItem = ({ category, isActive = false, onClick }: CategoryItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        isActive
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600'
      }`}
    >
      {category}
    </button>
  );
};

export default CategoryItem;