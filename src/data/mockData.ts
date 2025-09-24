import { Transaction, Category, Budget } from '../types';
import { subDays, subMonths } from 'date-fns';

export const categories: Category[] = [
  { id: '1', name: 'Ăn uống', icon: '🍽️', color: '#EF4444', type: 'expense' },
  { id: '2', name: 'Giao thông', icon: '🚗', color: '#F97316', type: 'expense' },
  { id: '3', name: 'Mua sắm', icon: '🛍️', color: '#8B5CF6', type: 'expense' },
  { id: '4', name: 'Giải trí', icon: '🎮', color: '#06B6D4', type: 'expense' },
  { id: '5', name: 'Y tế', icon: '🏥', color: '#EF4444', type: 'expense' },
  { id: '6', name: 'Giáo dục', icon: '📚', color: '#3B82F6', type: 'expense' },
  { id: '7', name: 'Tiết kiệm', icon: '💰', color: '#10B981', type: 'expense' },
  { id: '8', name: 'Lương', icon: '💵', color: '#10B981', type: 'income' },
  { id: '9', name: 'Thưởng', icon: '🎁', color: '#F59E0B', type: 'income' },
  { id: '10', name: 'Đầu tư', icon: '📈', color: '#3B82F6', type: 'income' },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    amount: 15000000,
    category: '8',
    description: 'Lương tháng 12',
    date: subDays(new Date(), 1),
    type: 'income'
  },
  {
    id: '2',
    amount: -250000,
    category: '1',
    description: 'Ăn trưa tại nhà hàng',
    date: subDays(new Date(), 1),
    type: 'expense'
  },
  {
    id: '3',
    amount: -150000,
    category: '2',
    description: 'Xăng xe máy',
    date: subDays(new Date(), 2),
    type: 'expense'
  },
  {
    id: '4',
    amount: -850000,
    category: '3',
    description: 'Mua áo khoác mùa đông',
    date: subDays(new Date(), 3),
    type: 'expense'
  },
  {
    id: '5',
    amount: -200000,
    category: '4',
    description: 'Vé xem phim',
    date: subDays(new Date(), 4),
    type: 'expense'
  },
  {
    id: '6',
    amount: 2000000,
    category: '9',
    description: 'Thưởng dự án',
    date: subDays(new Date(), 5),
    type: 'income'
  },
  {
    id: '7',
    amount: -500000,
    category: '5',
    description: 'Khám sức khỏe định kỳ',
    date: subDays(new Date(), 7),
    type: 'expense'
  },
  {
    id: '8',
    amount: -1200000,
    category: '6',
    description: 'Khóa học online',
    date: subDays(new Date(), 10),
    type: 'expense'
  },
  {
    id: '9',
    amount: -300000,
    category: '1',
    description: 'Đi chợ cuối tuần',
    date: subDays(new Date(), 14),
    type: 'expense'
  },
  {
    id: '10',
    amount: 1500000,
    category: '10',
    description: 'Cổ tức cổ phiếu',
    date: subDays(new Date(), 15),
    type: 'income'
  },
];

export const budgets: Budget[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'Ngân sách ăn uống',
    limit: 3000000,
    spent: 2100000,
    period: 'monthly',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
  },
  {
    id: '2',
    categoryId: '2',
    name: 'Ngân sách giao thông',
    limit: 1500000,
    spent: 850000,
    period: 'monthly',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
  },
  {
    id: '3',
    categoryId: '3',
    name: 'Ngân sách mua sắm',
    limit: 2000000,
    spent: 1650000,
    period: 'monthly',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
  },
  {
    id: '4',
    categoryId: '4',
    name: 'Ngân sách giải trí',
    limit: 1000000,
    spent: 450000,
    period: 'monthly',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
  },
];

export const monthlyData = [
  { month: 'T7/2024', income: 18500000, expense: 12300000 },
  { month: 'T8/2024', income: 17200000, expense: 13800000 },
  { month: 'T9/2024', income: 19100000, expense: 11900000 },
  { month: 'T10/2024', income: 16800000, expense: 14500000 },
  { month: 'T11/2024', income: 20300000, expense: 13200000 },
  { month: 'T12/2024', income: 22100000, expense: 15600000 },
];

export const weeklyData = [
  { day: 'T2', amount: 350000 },
  { day: 'T3', amount: 180000 },
  { day: 'T4', amount: 420000 },
  { day: 'T5', amount: 280000 },
  { day: 'T6', amount: 650000 },
  { day: 'T7', amount: 320000 },
  { day: 'CN', amount: 480000 },
];