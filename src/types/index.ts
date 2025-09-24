export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: "income" | "expense";
}

export type CategoryType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface Budget {
  id: string;
  categoryId: string;
  name: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface DailyData {
  day: string;
  amount: number;
}

export type Theme = "light" | "dark" | "system";

export interface AppSettings {
  theme: Theme;
  currency: string;
  language: string;
  notifications: boolean;
}
