import { format, isToday, isYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Hôm nay';
  }
  if (isYesterday(date)) {
    return 'Hôm qua';
  }
  return format(date, 'dd/MM/yyyy', { locale: vi });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MM/yyyy', { locale: vi });
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
};

export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};