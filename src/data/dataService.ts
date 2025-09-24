import { Transaction, Category, Budget } from "../types";
import {
  transactionDB,
  categoryDB,
  budgetDB,
  initializeDefaultData,
} from "./database";
import { subDays, startOfMonth, endOfMonth, format } from "date-fns";

// Service layer to replace mockData usage
export class DataService {
  private static initialized = false;

  // Initialize database with default data
  static async initialize() {
    if (!this.initialized) {
      await initializeDefaultData();
      this.initialized = true;
    }
  }

  // Reset initialization flag (for clearing database)
  static resetInitialization() {
    this.initialized = false;
  }

  // Transaction services
  static async getTransactions(): Promise<Transaction[]> {
    await this.initialize();
    return await transactionDB.getAll();
  }

  static async getTransactionsByType(
    type: "income" | "expense"
  ): Promise<Transaction[]> {
    await this.initialize();
    return await transactionDB.getByType(type);
  }

  static async getTransactionsByCategory(
    categoryId: string
  ): Promise<Transaction[]> {
    await this.initialize();
    return await transactionDB.getByCategory(categoryId);
  }

  static async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    await this.initialize();
    return await transactionDB.getByDateRange(startDate, endDate);
  }

  static async addTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<string> {
    await this.initialize();
    const id = await transactionDB.add(transaction);

    // Update budget spent amount if it's an expense
    if (transaction.type === "expense") {
      await budgetDB.updateSpent(
        transaction.category,
        Math.abs(transaction.amount)
      );
    }

    return id;
  }

  static async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<void> {
    await this.initialize();
    await transactionDB.update(id, updates);
  }

  static async deleteTransaction(id: string): Promise<void> {
    await this.initialize();
    await transactionDB.delete(id);
  }

  static async getTransactionById(
    id: string
  ): Promise<Transaction | undefined> {
    await this.initialize();
    return await transactionDB.getById(id);
  }

  // Category services
  static async getCategories(): Promise<Category[]> {
    await this.initialize();
    return await categoryDB.getAll();
  }

  static async getCategoriesByType(
    type: "income" | "expense"
  ): Promise<Category[]> {
    await this.initialize();
    return await categoryDB.getByType(type);
  }

  static async addCategory(category: Omit<Category, "id">): Promise<string> {
    await this.initialize();
    return await categoryDB.add(category);
  }

  static async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<void> {
    await this.initialize();
    await categoryDB.update(id, updates);
  }

  static async deleteCategory(id: string): Promise<void> {
    await this.initialize();
    await categoryDB.delete(id);
  }

  static async getCategoryById(id: string): Promise<Category | undefined> {
    await this.initialize();
    return await categoryDB.getById(id);
  }

  // Budget services
  static async getBudgets(): Promise<Budget[]> {
    await this.initialize();
    return await budgetDB.getAll();
  }

  static async getBudgetsByCategory(categoryId: string): Promise<Budget[]> {
    await this.initialize();
    return await budgetDB.getByCategory(categoryId);
  }

  static async addBudget(budget: Omit<Budget, "id">): Promise<string> {
    await this.initialize();
    return await budgetDB.add(budget);
  }

  static async updateBudget(
    id: string,
    updates: Partial<Budget>
  ): Promise<void> {
    await this.initialize();
    await budgetDB.update(id, updates);
  }

  static async deleteBudget(id: string): Promise<void> {
    await this.initialize();
    await budgetDB.delete(id);
  }

  static async getBudgetById(id: string): Promise<Budget | undefined> {
    await this.initialize();
    return await budgetDB.getById(id);
  }

  // Analytics and reporting
  static async getMonthlyData(): Promise<
    { month: string; income: number; expense: number }[]
  > {
    await this.initialize();
    const transactions = await transactionDB.getAll();
    const monthlyData: { [key: string]: { income: number; expense: number } } =
      {};

    // Group transactions by month
    transactions.forEach((transaction) => {
      const monthKey = format(transaction.date, "MM/yyyy");
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += Math.abs(transaction.amount);
      }
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: `T${month}`,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Get last 6 months
  }

  static async getWeeklyData(): Promise<{ day: string; amount: number }[]> {
    await this.initialize();
    const weekAgo = subDays(new Date(), 7);
    const transactions = await transactionDB.getByDateRange(
      weekAgo,
      new Date()
    );

    const weeklyData: { [key: string]: number } = {
      T2: 0,
      T3: 0,
      T4: 0,
      T5: 0,
      T6: 0,
      T7: 0,
      CN: 0,
    };

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const dayName = dayNames[transaction.date.getDay()];
        weeklyData[dayName] += Math.abs(transaction.amount);
      }
    });

    return Object.entries(weeklyData).map(([day, amount]) => ({ day, amount }));
  }

  static async getCurrentMonthSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }> {
    await this.initialize();
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    const transactions = await transactionDB.getByDateRange(startDate, endDate);

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += Math.abs(transaction.amount);
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  // Database management
  static async clearAllData(): Promise<void> {
    await transactionDB.delete;
    await categoryDB.delete;
    await budgetDB.delete;
    this.initialized = false;
  }

  static async exportData(): Promise<{
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
  }> {
    await this.initialize();
    const transactions = await transactionDB.getAll();
    const categories = await categoryDB.getAll();
    const budgets = await budgetDB.getAll();

    return { transactions, categories, budgets };
  }

  static async importData(data: {
    transactions?: Transaction[];
    categories?: Category[];
    budgets?: Budget[];
  }): Promise<void> {
    await this.clearAllData();

    if (data.categories) {
      await Promise.all(
        data.categories.map((category) => categoryDB.add(category))
      );
    }

    if (data.transactions) {
      await Promise.all(
        data.transactions.map((transaction) => transactionDB.add(transaction))
      );
    }

    if (data.budgets) {
      await Promise.all(data.budgets.map((budget) => budgetDB.add(budget)));
    }

    this.initialized = true;
  }
}
