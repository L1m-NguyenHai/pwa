import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, Category, Budget } from "../types";
import { DataService } from "../data/dataService";

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, "id">) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from IndexedDB on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, categoriesData, budgetsData] = await Promise.all(
        [
          DataService.getTransactions(),
          DataService.getCategories(),
          DataService.getBudgets(),
        ]
      );

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setBudgets(budgetsData);

      console.log(
        `Data loaded - Transactions: ${transactionsData.length}, Categories: ${categoriesData.length}, Budgets: ${budgetsData.length}`
      );
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Refreshing data...`);
    await loadData();
    console.log(`[${timestamp}] Data refreshed`);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      await DataService.addTransaction(transaction);
      await refreshData(); // Refresh data after adding
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (
    id: string,
    updatedTransaction: Partial<Transaction>
  ) => {
    try {
      await DataService.updateTransaction(id, updatedTransaction);
      await refreshData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      console.log(`[${timestamp}] Deleting transaction from context:`, id);
      await DataService.deleteTransaction(id);
      console.log(
        `[${timestamp}] Transaction deleted from database, refreshing...`
      );
      await refreshData(); // Refresh data after deleting
      console.log(`[${timestamp}] Data refresh completed`);
    } catch (error) {
      console.error(`[${timestamp}] Error deleting transaction:`, error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      await DataService.addCategory(category);
      await refreshData(); // Refresh data after adding
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const updateCategory = async (
    id: string,
    updatedCategory: Partial<Category>
  ) => {
    try {
      await DataService.updateCategory(id, updatedCategory);
      await refreshData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await DataService.deleteCategory(id);
      await refreshData(); // Refresh data after deleting
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  const addBudget = async (budget: Omit<Budget, "id">) => {
    try {
      await DataService.addBudget(budget);
      await refreshData(); // Refresh data after adding
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  };

  const updateBudget = async (id: string, updatedBudget: Partial<Budget>) => {
    try {
      await DataService.updateBudget(id, updatedBudget);
      await refreshData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await DataService.deleteBudget(id);
      await refreshData(); // Refresh data after deleting
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
