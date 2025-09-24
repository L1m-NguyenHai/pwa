import React, { useState } from "react";
import { Plus, Target, Edit, Trash2, X, Check } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { formatCurrency } from "../utils/currency";
import { Budget } from "../types";
import CategorySelect from "../components/UI/CategorySelect";
import MoneyInput from "../components/UI/MoneyInput";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Budgets: React.FC = () => {
  const {
    budgets,
    categories,
    addBudget,
    updateBudget,
    deleteBudget,
    loading,
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    limit: 0,
    period: "monthly" as "weekly" | "monthly" | "yearly",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên ngân sách";
    if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (!formData.limit || formData.limit <= 0)
      newErrors.limit = "Vui lòng nhập số tiền hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const budgetData = {
      name: formData.name,
      categoryId: formData.categoryId,
      limit: formData.limit,
      spent: editingBudget?.spent || 0,
      period: formData.period,
      startDate: new Date(),
      endDate: new Date(
        Date.now() +
          (formData.period === "weekly"
            ? 7
            : formData.period === "monthly"
            ? 30
            : 365) *
            24 *
            60 *
            60 *
            1000
      ),
    };

    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", categoryId: "", limit: 0, period: "monthly" });
    setErrors({});
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      categoryId: budget.categoryId,
      limit: budget.limit,
      period: budget.period,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa ngân sách này?")) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ngân sách
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi và quản lý ngân sách chi tiêu
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
        >
          <Plus size={20} />
          Tạo ngân sách
        </button>
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingBudget ? "Sửa ngân sách" : "Tạo ngân sách mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên ngân sách
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="VD: Ăn uống tháng 1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Danh mục
                </label>
                <CategorySelect
                  categories={categories.filter((c) => c.type === "expense")}
                  value={formData.categoryId}
                  onChange={(categoryId) =>
                    setFormData({ ...formData, categoryId })
                  }
                />
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số tiền ngân sách
                </label>
                <MoneyInput
                  value={formData.limit}
                  onChange={(value) =>
                    setFormData({ ...formData, limit: value })
                  }
                  placeholder="Nhập số tiền"
                />
                {errors.limit && (
                  <p className="text-red-500 text-sm mt-1">{errors.limit}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chu kỳ
                </label>
                <select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period: e.target.value as "weekly" | "monthly" | "yearly",
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingBudget ? "Cập nhật" : "Tạo ngân sách"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const remaining = budget.limit - budget.spent;

          return (
            <div
              key={budget.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-xl">{category?.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {budget.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {budget.period === "monthly"
                        ? "Hàng tháng"
                        : budget.period === "weekly"
                        ? "Hàng tuần"
                        : "Hàng năm"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Đã chi
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage > 90
                        ? "bg-red-500"
                        : percentage > 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {percentage.toFixed(0)}% đã sử dụng
                  </span>
                  <span
                    className={`font-medium ${
                      remaining >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {remaining >= 0 ? "Còn lại: " : "Vượt quá: "}
                    {formatCurrency(Math.abs(remaining))}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Ngân sách
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(budget.limit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có ngân sách nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tạo ngân sách đầu tiên để theo dõi chi tiêu của bạn
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200"
          >
            <Plus size={20} />
            Tạo ngân sách
          </button>
        </div>
      )}
    </div>
  );
};

export default Budgets;
