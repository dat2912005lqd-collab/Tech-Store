import React from 'react';
import CategoryItem from './CategoryItem';

interface CategoryListProps {
  categories: string[];
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CategoryList = ({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryListProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <CategoryItem
          category={category}
          isActive={category === activeCategory}
          onClick={() => onSelectCategory?.(category)}
        />
      ))}
    </div>
  );
};

export default CategoryList;