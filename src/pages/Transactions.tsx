import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import FilterBar from "../components/UI/FilterBar";
import MoneyInput from "../components/UI/MoneyInput";
import DatePicker from "../components/UI/DatePicker";
import CategorySelect from "../components/UI/CategorySelect";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";
import { Transaction } from "../types";

const Transactions: React.FC = () => {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    refreshData,
  } = useApp();

  console.log(
    "Transactions component rendered, transaction count:",
    transactions.length
  );

  useEffect(() => {
    console.log("Transactions component mounted/changed:", transactions.length);
    // Debug: log first few transaction IDs
    if (transactions.length > 0) {
      console.log(
        "Sample transaction IDs:",
        transactions.slice(0, 3).map((t) => ({
          id: t.id,
          idType: typeof t.id,
          description: t.description.substring(0, 20),
        }))
      );
    }
  }, [transactions]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    amount: 0,
    category: "",
    description: "",
    date: new Date(),
    type: "expense" as "income" | "expense",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || transaction.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, selectedCategory]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Vui lòng nhập số tiền hợp lệ";
    }
    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const transactionData = {
      amount: formData.type === "expense" ? -formData.amount : formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      type: formData.type,
    };

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving transaction:", error);
      // You could show a toast notification here
    }
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      category: "",
      description: "",
      date: new Date(),
      type: "expense",
    });
    setErrors({});
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: Math.abs(transaction.amount),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        console.log("Deleting transaction with ID:", id);
        await deleteTransaction(id);
        console.log("Transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Có lỗi xảy ra khi xóa giao dịch. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Giao dịch
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lý tất cả giao dịch thu chi của bạn ({transactions.length}{" "}
                giao dịch)
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={async () => {
                  const { clearDatabase } = await import("../data/database");
                  await clearDatabase();
                  await refreshData();
                  alert("Database cleared and re-initialized!");
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                title="Clear database (debug)"
              >
                🗑️ Clear DB
              </button>
              <button
                onClick={async () => {
                  console.log("Current categories:", categories.length);
                  console.log("Current transactions:", transactions.length);
                  await refreshData();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                title="Làm mới dữ liệu"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
              >
                <Plus size={20} />
                Thêm giao dịch
              </button>
            </div>
          </div>

          <FilterBar
            onSearch={setSearchTerm}
            onCategoryFilter={setSelectedCategory}
            onDateRange={() => {}}
            onAmountRange={() => {}}
            categories={categories}
          />

          {/* Transaction Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {editingTransaction ? "Sửa giao dịch" : "Thêm giao dịch mới"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Loại giao dịch
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="expense"
                          checked={formData.type === "expense"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              type: e.target.value as "expense",
                            })
                          }
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-gray-900 dark:text-white">
                          Chi tiêu
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="income"
                          checked={formData.type === "income"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              type: e.target.value as "income",
                            })
                          }
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-gray-900 dark:text-white">
                          Thu nhập
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số tiền
                    </label>
                    <MoneyInput
                      value={formData.amount}
                      onChange={(value) =>
                        setFormData({ ...formData, amount: value })
                      }
                      error={errors.amount}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Danh mục
                    </label>
                    <CategorySelect
                      categories={categories}
                      value={formData.category}
                      onChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      type={formData.type}
                      error={errors.category}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className={`
                    w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.description ? "border-red-500" : ""}
                  `}
                      placeholder="Nhập mô tả giao dịch"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày giao dịch
                    </label>
                    <DatePicker
                      value={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      {editingTransaction ? "Cập nhật" : "Thêm mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Danh sách giao dịch ({filteredTransactions.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy giao dịch nào
                  </p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => {
                  const category = categories.find(
                    (c) => c.id === transaction.category
                  );

                  return (
                    <div
                      key={transaction.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-600">
                            {transaction.type === "income" ? (
                              <ArrowUpRight
                                size={20}
                                className="text-green-600"
                              />
                            ) : (
                              <ArrowDownRight
                                size={20}
                                className="text-red-600"
                              />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{category?.icon}</span>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {transaction.description}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category?.name} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div
                            className={`text-lg font-semibold ${
                              transaction.type === "income"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                              title="Chỉnh sửa giao dịch"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                              title="Xóa giao dịch"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;
