import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories, priceRanges } from '../data/products';

interface CategorySidebarProps {
  selectedCategory: string;
  selectedPriceRange: string[];
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  selectedPriceRange,
  onCategoryChange,
  onPriceRangeChange,
}) => {
  const location = useLocation();

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  const handlePriceRangeChange = (rangeId: string) => {
    onPriceRangeChange(rangeId);
  };

  return (
    <aside className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`flex justify-between items-center w-full py-2 px-3 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">{category.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Price Range</h2>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.id} className="flex items-center">
              <input
                type="checkbox"
                id={range.id}
                checked={selectedPriceRange.includes(range.id)}
                onChange={() => handlePriceRangeChange(range.id)}
                className="h-4 w-4 text-red-600 border-gray-600 rounded focus:ring-red-500"
              />
              <label
                htmlFor={range.id}
                className="ml-2 text-gray-300 cursor-pointer hover:text-white"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;