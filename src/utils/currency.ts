export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export const formatCurrencyCompact = (amount: number): string => {
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000) {
    return `${(absAmount / 1000000000).toFixed(1)}B VND`;
  }
  if (absAmount >= 1000000) {
    return `${(absAmount / 1000000).toFixed(1)}M VND`;
  }
  if (absAmount >= 1000) {
    return `${(absAmount / 1000).toFixed(0)}K VND`;
  }
  
  return formatCurrency(amount);
};

export const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/[^\d]/g, '')) || 0;
};