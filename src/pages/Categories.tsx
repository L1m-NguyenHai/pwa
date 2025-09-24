import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { Category, CategoryType } from "../types";

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    type: "expense",
    name: "",
    icon: "💰",
    color: "#3B82F6",
  });

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const handleAddCategory = async () => {
    if (!newCategory.name?.trim()) return;

    await addCategory({
      name: newCategory.name,
      type: newCategory.type as CategoryType,
      icon: newCategory.icon || "💰",
      color: newCategory.color || "#3B82F6",
    });

    setNewCategory({ type: "expense", name: "", icon: "💰", color: "#3B82F6" });
    setIsAddingCategory(false);
  };

  const handleEditCategory = async (
    id: string,
    updatedData: Partial<Category>
  ) => {
    await updateCategory(id, updatedData);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      await deleteCategory(id);
    }
  };

  const commonIcons = [
    "💰",
    "🍽️",
    "🚗",
    "🏠",
    "🛍️",
    "💊",
    "🎓",
    "🎮",
    "📱",
    "✈️",
    "👕",
    "🏃‍♂️",
  ];
  const commonColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
    "#14B8A6",
  ];

  const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(category);

    if (isEditing) {
      return (
        <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <div className="space-y-3">
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full p-2 text-sm border rounded"
              placeholder="Tên danh mục"
            />

            <div className="flex flex-wrap gap-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setEditData({ ...editData, icon })}
                  className={`p-2 rounded ${
                    editData.icon === icon
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setEditData({ ...editData, color })}
                  className={`w-6 h-6 rounded-full border-2 ${
                    editData.color === color
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEditCategory(category.id, editData)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded text-sm"
              >
                <Check size={16} />
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-500 text-white rounded text-sm"
              >
                <X size={16} />
                Hủy
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white text-xl"
          style={{ backgroundColor: category.color }}
        >
          {category.icon}
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
          {category.name}
        </span>
      </div>
    );
  };

  const AddCategoryCard: React.FC<{ type: CategoryType }> = ({ type }) => {
    if (isAddingCategory && newCategory.type === type) {
      return (
        <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <div className="space-y-3">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full p-2 text-sm border rounded"
              placeholder="Tên danh mục"
              autoFocus
            />

            <div className="flex flex-wrap gap-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewCategory({ ...newCategory, icon })}
                  className={`p-2 rounded ${
                    newCategory.icon === icon
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newCategory.color === color
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddCategory}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded text-sm"
              >
                <Check size={16} />
                Thêm
              </button>
              <button
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategory({
                    type: "expense",
                    name: "",
                    icon: "💰",
                    color: "#3B82F6",
                  });
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-500 text-white rounded text-sm"
              >
                <X size={16} />
                Hủy
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          setIsAddingCategory(true);
          setNewCategory({ ...newCategory, type });
        }}
        className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
          <Plus size={24} className="text-gray-500" />
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Thêm danh mục
        </span>
      </button>
    );
  };

  const CategoryGrid: React.FC<{
    title: string;
    categories: Category[];
    type: CategoryType;
  }> = ({ title, categories, type }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AddCategoryCard type={type} />
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Danh mục
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý các danh mục thu chi của bạn
        </p>
      </div>

      <CategoryGrid
        title="Danh mục thu nhập"
        categories={incomeCategories}
        type="income"
      />
      <CategoryGrid
        title="Danh mục chi tiêu"
        categories={expenseCategories}
        type="expense"
      />
    </div>
  );
};

export default Categories;
