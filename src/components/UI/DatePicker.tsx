import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = "",
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  const formatForInput = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="date"
          value={formatForInput(value)}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
        />
        <Calendar
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;