import Dexie, { Table } from "dexie";
import { Transaction, Category, Budget } from "../types";

export class ExpenseDB extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  budgets!: Table<Budget>;

  constructor() {
    super("ExpenseDB");
    this.version(2).stores({
      transactions: "id, amount, category, date, type, description",
      categories: "id, name, icon, color, type",
      budgets: "id, categoryId, name, limit, spent, period, startDate, endDate",
    });
  }
}

export const db = new ExpenseDB();

// Clear database (for debugging)
export const clearDatabase = async () => {
  console.log("Clearing database...");
  await db.delete();
  console.log("Database deleted");

  // Reset DataService initialization flag
  const { DataService } = await import("./dataService");
  DataService.resetInitialization();
  console.log("DataService reset");

  await db.open();
  console.log("Database reopened");

  // Force re-initialization
  await initializeDefaultData();
  console.log("Default data re-initialized");
};

// Helper function to generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Initialize default data if database is empty
export const initializeDefaultData = async () => {
  try {
    console.log("Checking if default data exists...");
    // Check if data already exists
    const categoryCount = await db.categories.count();
    console.log(`Found ${categoryCount} existing categories`);

    if (categoryCount > 0) {
      console.log("Data already exists, skipping initialization");
      return; // Data already exists, no need to initialize
    }

    console.log("Importing mock data...");
    // Import initial data from mock data
    const {
      categories: defaultCategories,
      transactions: defaultTransactions,
      budgets: defaultBudgets,
    } = await import("./mockData");

    console.log(`Importing ${defaultCategories.length} categories...`);
    // Add default categories
    await db.categories.bulkAdd(defaultCategories);
    console.log("Default categories added to database");

    console.log(`Importing ${defaultTransactions.length} transactions...`);
    // Add default transactions
    await db.transactions.bulkAdd(defaultTransactions);
    console.log("Default transactions added to database");

    console.log(`Importing ${defaultBudgets.length} budgets...`);
    // Add default budgets
    await db.budgets.bulkAdd(defaultBudgets);
    console.log("Default budgets added to database");
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
};

// Transaction operations
export const transactionDB = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    return await db.transactions.orderBy("date").reverse().toArray();
  },

  // Get transactions by type
  getByType: async (type: "income" | "expense"): Promise<Transaction[]> => {
    return await db.transactions.where("type").equals(type).toArray();
  },

  // Get transactions by category
  getByCategory: async (categoryId: string): Promise<Transaction[]> => {
    return await db.transactions.where("category").equals(categoryId).toArray();
  },

  // Get transactions by date range
  getByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> => {
    return await db.transactions
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  },

  // Add new transaction
  add: async (transaction: Omit<Transaction, "id">): Promise<string> => {
    const id = generateId();
    const newTransaction = { ...transaction, id };
    await db.transactions.add(newTransaction);
    return id;
  },

  // Update transaction
  update: async (id: string, updates: Partial<Transaction>): Promise<void> => {
    await db.transactions.update(id, updates);
  },

  // Delete transaction
  delete: async (id: string): Promise<void> => {
    console.log("Database: Attempting to delete transaction with ID:", id);
    console.log("ID type:", typeof id);

    // Check if transaction exists first
    const existing = await db.transactions.get(id);
    console.log("Found existing transaction:", existing);

    if (!existing) {
      console.log("Transaction not found in database!");
      return;
    }

    const result = await db.transactions.delete(id);
    console.log("Delete result:", result);

    // Verify deletion
    const afterDelete = await db.transactions.get(id);
    console.log("Transaction after delete:", afterDelete);
  },

  // Get transaction by ID
  getById: async (id: string): Promise<Transaction | undefined> => {
    return await db.transactions.get(id);
  },
};

// Category operations
export const categoryDB = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    return await db.categories.toArray();
  },

  // Get categories by type
  getByType: async (type: "income" | "expense"): Promise<Category[]> => {
    return await db.categories.where("type").equals(type).toArray();
  },

  // Add new category
  add: async (category: Omit<Category, "id">): Promise<string> => {
    const id = generateId();
    const newCategory = { ...category, id };
    await db.categories.add(newCategory);
    return id;
  },

  // Update category
  update: async (id: string, updates: Partial<Category>): Promise<void> => {
    await db.categories.update(id, updates);
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await db.categories.delete(id);
  },

  // Get category by ID
  getById: async (id: string): Promise<Category | undefined> => {
    return await db.categories.get(id);
  },
};

// Budget operations
export const budgetDB = {
  // Get all budgets
  getAll: async (): Promise<Budget[]> => {
    return await db.budgets.toArray();
  },

  // Get budgets by category
  getByCategory: async (categoryId: string): Promise<Budget[]> => {
    return await db.budgets.where("categoryId").equals(categoryId).toArray();
  },

  // Add new budget
  add: async (budget: Omit<Budget, "id">): Promise<string> => {
    const id = generateId();
    const newBudget = { ...budget, id };
    await db.budgets.add(newBudget);
    return id;
  },

  // Update budget
  update: async (id: string, updates: Partial<Budget>): Promise<void> => {
    await db.budgets.update(id, updates);
  },

  // Delete budget
  delete: async (id: string): Promise<void> => {
    await db.budgets.delete(id);
  },

  // Get budget by ID
  getById: async (id: string): Promise<Budget | undefined> => {
    return await db.budgets.get(id);
  },

  // Update spent amount for a budget
  updateSpent: async (categoryId: string, amount: number): Promise<void> => {
    const budgets = await db.budgets
      .where("categoryId")
      .equals(categoryId)
      .toArray();
    for (const budget of budgets) {
      await db.budgets.update(budget.id, { spent: budget.spent + amount });
    }
  },
};
