import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useAnalytics } from "../hooks/useAnalytics";
import StatsCard from "../components/UI/StatsCard";
import ChartCard from "../components/UI/ChartCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";

const Dashboard: React.FC = () => {
  const { transactions, categories, budgets, loading: appLoading } = useApp();
  const {
    monthlyData,
    weeklyData,
    currentMonthSummary,
    loading: analyticsLoading,
  } = useAnalytics();

  const stats = useMemo(() => {
    // Use analytics data if available, otherwise calculate from transactions
    if (currentMonthSummary && currentMonthSummary.totalIncome > 0) {
      return {
        balance: currentMonthSummary.balance,
        totalIncome: currentMonthSummary.totalIncome,
        totalExpense: currentMonthSummary.totalExpense,
        totalBudget: budgets.reduce((sum, b) => sum + b.limit, 0),
      };
    }

    // Fallback calculation from transactions
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpense;
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

    return {
      balance,
      totalIncome,
      totalExpense,
      totalBudget,
    };
  }, [transactions, budgets, currentMonthSummary]);

  const categoryData = useMemo(() => {
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, transaction) => {
        const category = categories.find((c) => c.id === transaction.category);
        if (category) {
          const existing = acc.find((item) => item.name === category.name);
          if (existing) {
            existing.value += Math.abs(transaction.amount);
          } else {
            acc.push({
              name: category.name,
              value: Math.abs(transaction.amount),
              color: category.color,
            });
          }
        }
        return acc;
      }, [] as { name: string; value: number; color: string }[]);

    return expensesByCategory.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [transactions, categories]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const budgetData = useMemo(() => {
    return budgets.map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      return {
        name: category?.name || "Unknown",
        budget: budget.limit,
        spent: budget.spent,
        remaining: Math.max(0, budget.limit - budget.spent),
        percentage: Math.round((budget.spent / budget.limit) * 100),
      };
    });
  }, [budgets, categories]);

  // Show loading spinner while data is being fetched
  if (appLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const COLORS = ["#3B82F6", "#EF4444", "#F59E0B", "#10B981", "#8B5CF6"];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tổng quan tài chính
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Theo dõi thu chi và ngân sách của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Số dư"
          value={stats.balance}
          icon={Wallet}
          changeType={stats.balance >= 0 ? "increase" : "decrease"}
          color={stats.balance >= 0 ? "green" : "red"}
        />
        <StatsCard
          title="Thu nhập"
          value={stats.totalIncome}
          icon={TrendingUp}
          changeType="increase"
          color="green"
        />
        <StatsCard
          title="Chi tiêu"
          value={stats.totalExpense}
          icon={TrendingDown}
          changeType="decrease"
          color="red"
        />
        <StatsCard
          title="Ngân sách"
          value={stats.totalBudget}
          icon={Target}
          changeType="neutral"
          color="blue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expense */}
        <ChartCard title="Thu chi theo tháng">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                name="Thu nhập"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                name="Chi tiêu"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Expenses */}
        <ChartCard title="Chi tiêu trong tuần">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <ChartCard
          title="Chi tiêu theo danh mục"
          className="lg:col-span-1 relative pb-10 min-h-[400px]"
        >
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend bị ẩn để tránh tràn - thông tin hiển thị qua tooltip */}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              Chưa có dữ liệu chi tiêu
            </div>
          )}
        </ChartCard>

        {/* Budget Overview */}
        <ChartCard title="Tình trạng ngân sách" className="lg:col-span-1">
          {budgetData.length > 0 ? (
            <div className="space-y-4">
              {budgetData.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{budget.name}</span>
                    <span>{budget.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        budget.percentage > 100
                          ? "bg-red-500"
                          : budget.percentage > 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(budget.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Đã chi: {formatCurrency(budget.spent)}</span>
                    <span>Ngân sách: {formatCurrency(budget.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              Chưa có ngân sách nào
            </div>
          )}
        </ChartCard>

        {/* Recent Transactions */}
        <ChartCard title="Giao dịch gần đây" className="lg:col-span-1">
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const category = categories.find(
                  (c) => c.id === transaction.category
                );
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{category?.icon || "💰"}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {category?.name} • {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              Chưa có giao dịch nào
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
