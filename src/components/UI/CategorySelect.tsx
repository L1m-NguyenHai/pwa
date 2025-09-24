import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Category } from '../../types';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  className?: string;
  error?: string;
  type?: 'income' | 'expense' | 'all';
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  value,
  onChange,
  className = "",
  error,
  type = 'all'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = type === 'all' 
    ? categories 
    : categories.filter(cat => cat.type === type);

  const selectedCategory = categories.find(cat => cat.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          flex items-center justify-between
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedCategory ? (
            <>
              <span className="text-xl">{selectedCategory.icon}</span>
              <span>{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Chọn danh mục</span>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredCategories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onChange(category.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
            >
              <span className="text-xl">{category.icon}</span>
              <span className="text-gray-900 dark:text-white">{category.name}</span>
              <div 
                className="w-3 h-3 rounded-full ml-auto"
                style={{ backgroundColor: category.color }}
              />
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default CategorySelect;