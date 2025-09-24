import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className = ''
}) => {
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700
      ${className}
    `}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="h-80">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;