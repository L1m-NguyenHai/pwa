import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrencyCompact } from '../../utils/currency';

interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  const getTrendIcon = () => {
    if (changeType === 'increase') return TrendingUp;
    if (changeType === 'decrease') return TrendingDown;
    return null;
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700
      hover:shadow-xl transition-all duration-200 ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrencyCompact(value)}
        </p>
        
        {change !== undefined && TrendIcon && (
          <div className={`flex items-center gap-1 text-sm ${
            changeType === 'increase' ? 'text-green-600 dark:text-green-400' :
            changeType === 'decrease' ? 'text-red-600 dark:text-red-400' :
            'text-gray-600 dark:text-gray-400'
          }`}>
            <TrendIcon size={16} />
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-500 dark:text-gray-400">so với tháng trước</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;