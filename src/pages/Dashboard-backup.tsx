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
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
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

  // Show loading spinner while data is being fetched
  if (appLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }
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
      .reduce((acc, t) => {
        const category = categories.find((c) => c.id === t.category);
        if (category) {
          acc[category.id] = (acc[category.id] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {} as Record<string, number>);

    return categories
      .filter((c) => c.type === "expense" && expensesByCategory[c.id])
      .map((category) => ({
        name: category.name,
        value: expensesByCategory[category.id],
        color: category.color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trang chủ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tổng quan tình hình tài chính của bạn
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Số dư hiện tại
          </p>
          <p
            className={`text-2xl font-bold ${
              stats.balance >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(stats.balance)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Thu nhập"
          value={stats.totalIncome}
          change={15}
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Chi tiêu"
          value={stats.totalExpense}
          change={8}
          changeType="increase"
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Số dư"
          value={stats.balance}
          change={23}
          changeType="increase"
          icon={Wallet}
          color="blue"
        />
        <StatsCard
          title="Ngân sách"
          value={stats.totalBudget}
          change={5}
          changeType="decrease"
          icon={Target}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Chi tiêu theo danh mục"
          subtitle="Phân bố chi tiêu trong tháng này"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Xu hướng thu chi" subtitle="6 tháng gần nhất">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={3}
                name="Thu nhập"
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={3}
                name="Chi tiêu"
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Chi tiêu hàng tuần"
          subtitle="7 ngày qua"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="day"
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Số tiền"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Giao dịch gần đây
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = categories.find(
                (c) => c.id === transaction.category
              );
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{category?.icon}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
