import React, { useState, useEffect } from 'react';
import { formatCurrency, parseCurrency } from '../../utils/currency';

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "0 VND",
  className = "",
  error
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    const numericValue = parseCurrency(inputValue);
    onChange(numericValue);
  };

  const handleBlur = () => {
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default MoneyInput;