import { Transaction, calculateCategoryTotals, calculateTotalIncome, calculateTotalExpenses, calculateRemainingBudget, calculateBudgetPercentage } from '../utils/calculations';

export type { Transaction };

export const API_BASE_URL = 'http://localhost:8080/api';

// Set this to true to attempt real Spring Boot calls first.
// When false, or when Spring Boot is offline, it utilizes local persistent mock storage.
export const USE_REAL_BACKEND = false;

export interface User {
  id: number | string;
  fullName: string;
  username: string;
  email: string;
  college?: string;
}

export interface DashboardResponse {
  income: number;
  spent: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  categorySummary: Record<string, number>;
}

export interface BudgetRecord {
  id?: number | string;
  userId: number | string;
  month: string; // YYYY-MM
  amount: number;
}

// Initial Mock Seed Data
const DEFAULT_USER: User & { password?: string } = {
  id: 1,
  fullName: 'Rahul Sharma',
  username: 'student01',
  email: 'student@example.com',
  password: 'password123',
  college: 'National Institute of Technology',
};

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    userId: 1,
    type: 'INCOME',
    amount: 15000,
    category: 'Other',
    date: '2026-10-02',
    note: 'Part-time Web Dev Internship Stipend',
  },
  {
    id: 2,
    userId: 1,
    type: 'INCOME',
    amount: 10000,
    category: 'Other',
    date: '2026-10-04',
    note: 'Monthly Allowance from Parents',
  },
  {
    id: 3,
    userId: 1,
    type: 'EXPENSE',
    amount: 2500,
    category: 'Food',
    date: '2026-10-05',
    note: 'Campus Cafeteria & Grocery stock',
  },
  {
    id: 4,
    userId: 1,
    type: 'EXPENSE',
    amount: 2500,
    category: 'Food',
    date: '2026-10-06',
    note: 'Dinner & Weekend Cafe with friends',
  },
  {
    id: 5,
    userId: 1,
    type: 'EXPENSE',
    amount: 2500,
    category: 'Travel',
    date: '2026-10-05',
    note: 'Monthly Metro & Bus Student Pass',
  },
  {
    id: 6,
    userId: 1,
    type: 'EXPENSE',
    amount: 2000,
    category: 'Shopping',
    date: '2026-10-03',
    note: 'Casual college sneakers & stationery',
  },
  {
    id: 7,
    userId: 1,
    type: 'EXPENSE',
    amount: 1500,
    category: 'Education',
    date: '2026-10-04',
    note: 'Data Structures Textbook & Coursera course',
  },
  {
    id: 8,
    userId: 1,
    type: 'EXPENSE',
    amount: 2000,
    category: 'Bills',
    date: '2026-10-01',
    note: 'Hostel Wi-Fi recharge & mobile bill',
  },
  {
    id: 9,
    userId: 1,
    type: 'EXPENSE',
    amount: 1000,
    category: 'Entertainment',
    date: '2026-10-06',
    note: 'Movie tickets & streaming subscription',
  },
  {
    id: 10,
    userId: 1,
    type: 'EXPENSE',
    amount: 500,
    category: 'Other',
    date: '2026-10-06',
    note: 'Project printing & binding sheets',
  },
];

const SEED_BUDGETS: Record<string, number> = {
  '2026-10': 20000,
  '2026-09': 18000,
  '2026-11': 20000,
};

// Storage keys
const STORAGE_KEYS = {
  USERS: 'spendwise_users_v1',
  CURRENT_USER: 'spendwise_current_user_v1',
  TRANSACTIONS: 'spendwise_transactions_v1',
  BUDGETS: 'spendwise_budgets_v1',
};

// Initialize Mock Store in localStorage
function initializeStore() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_USER]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(SEED_BUDGETS));
  }
}

// Call on startup
initializeStore();

function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock DB helpers
function getStoredUsers(): (User & { password?: string })[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [DEFAULT_USER];
  } catch {
    return [DEFAULT_USER];
  }
}

function getStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : SEED_TRANSACTIONS;
  } catch {
    return SEED_TRANSACTIONS;
  }
}

function saveStoredTransactions(txs: Transaction[]) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
}

function getStoredBudgets(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return raw ? JSON.parse(raw) : SEED_BUDGETS;
  } catch {
    return SEED_BUDGETS;
  }
}

function saveStoredBudgets(budgets: Record<string, number>) {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

// Centralized API Service
export const api = {
  // 1. Register User
  // Expected Backend: POST /api/register
  async registerUser(userData: {
    fullName: string;
    username: string;
    email: string;
    password?: string;
  }): Promise<{ success: boolean; user: User; message?: string }> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Registration failed' }));
          throw new Error(err.message || 'Registration failed');
        }
        const data = await res.json();
        return { success: true, user: data };
      } catch (e: any) {
        console.warn('Backend call failed, using mock registration fallback:', e.message);
      }
    }

    await delay(250);
    const users = getStoredUsers();

    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      throw new Error('Username is already taken. Please choose another.');
    }
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email is already registered. Please login instead.');
    }

    const newUser: User & { password?: string } = {
      id: Date.now(),
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return {
      success: true,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
      },
      message: 'Account created successfully! You can now log in.',
    };
  },

  // 2. Login User
  // Expected Backend: POST /api/login
  async loginUser(credentials: {
    username: string;
    password?: string;
  }): Promise<{ success: boolean; user: User; token?: string }> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
          throw new Error(err.message || 'Invalid username or password');
        }
        const data = await res.json();
        return { success: true, user: data };
      } catch (e: any) {
        console.warn('Backend call failed, using mock login fallback:', e.message);
      }
    }

    await delay(200);
    const users = getStoredUsers();
    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === credentials.username.toLowerCase() ||
          u.email.toLowerCase() === credentials.username.toLowerCase()) &&
        (!credentials.password || u.password === credentials.password)
    );

    if (!user) {
      throw new Error('Invalid username or password. Please try again.');
    }

    const safeUser: User = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      college: user.college,
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  },

  // 3. Get Dashboard Data
  // Expected Backend: GET /api/dashboard?userId=1&month=2026-10
  async getDashboard(params: {
    userId: number | string;
    month: string; // YYYY-MM
  }): Promise<DashboardResponse> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard?userId=${params.userId}&month=${params.month}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e: any) {
        console.warn('Backend call failed, using mock dashboard fallback:', e.message);
      }
    }

    await delay(150);
    const allTxs = getStoredTransactions();
    // Filter by user and month
    const monthTxs = allTxs.filter((t) => {
      const matchUser = String(t.userId) === String(params.userId);
      const matchMonth = t.date ? t.date.startsWith(params.month) : true;
      return matchUser && matchMonth;
    });

    const budgets = getStoredBudgets();
    const budgetAmount = budgets[params.month] ?? 20000;

    const income = calculateTotalIncome(monthTxs);
    const spent = calculateTotalExpenses(monthTxs);
    const remaining = calculateRemainingBudget(budgetAmount, spent);
    const percentUsed = calculateBudgetPercentage(spent, budgetAmount);
    const categorySummary = calculateCategoryTotals(monthTxs);

    return {
      income,
      spent,
      budget: budgetAmount,
      remaining,
      percentUsed,
      categorySummary,
    };
  },

  // 4. Get Transactions
  // Expected Backend: GET /api/transactions?userId=1&month=2026-10
  async getTransactions(params: {
    userId: number | string;
    month?: string;
  }): Promise<Transaction[]> {
    if (USE_REAL_BACKEND) {
      try {
        const url = params.month
          ? `${API_BASE_URL}/transactions?userId=${params.userId}&month=${params.month}`
          : `${API_BASE_URL}/transactions?userId=${params.userId}`;
        const res = await fetch(url);
        if (res.ok) {
          return await res.json();
        }
      } catch (e: any) {
        console.warn('Backend call failed, using mock transactions fallback:', e.message);
      }
    }

    await delay(120);
    const allTxs = getStoredTransactions();
    return allTxs
      .filter((t) => {
        const matchUser = String(t.userId) === String(params.userId);
        const matchMonth = !params.month || t.date.startsWith(params.month);
        return matchUser && matchMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // 5. Add Transaction
  // Expected Backend: POST /api/transactions
  async addTransaction(data: {
    userId: number | string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    category: string;
    date: string;
    note?: string;
  }): Promise<Transaction> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e: any) {
        console.warn('Backend call failed, using mock add transaction fallback:', e.message);
      }
    }

    await delay(180);
    const allTxs = getStoredTransactions();
    const newTx: Transaction = {
      id: Date.now(),
      userId: data.userId,
      type: data.type,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      note: data.note?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    allTxs.unshift(newTx);
    saveStoredTransactions(allTxs);
    return newTx;
  },

  // 6. Delete Transaction
  // Expected Backend: DELETE /api/transactions/{id}
  async deleteTransaction(id: string | number): Promise<{ success: boolean; message: string }> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          return { success: true, message: 'Transaction deleted successfully' };
        }
      } catch (e: any) {
        console.warn('Backend call failed, using mock delete fallback:', e.message);
      }
    }

    await delay(150);
    const allTxs = getStoredTransactions();
    const updated = allTxs.filter((t) => String(t.id) !== String(id));
    saveStoredTransactions(updated);

    return { success: true, message: 'Transaction deleted successfully.' };
  },

  // 7. Get Budget
  // Expected Backend: GET /api/budget?userId=1&month=2026-10
  async getBudget(params: {
    userId: number | string;
    month: string;
  }): Promise<{ userId: number | string; month: string; amount: number }> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/budget?userId=${params.userId}&month=${params.month}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e: any) {
        console.warn('Backend call failed, using mock get budget fallback:', e.message);
      }
    }

    await delay(100);
    const budgets = getStoredBudgets();
    const amount = budgets[params.month] ?? 20000;
    return {
      userId: params.userId,
      month: params.month,
      amount,
    };
  },

  // 8. Save Budget
  // Expected Backend: POST /api/budget
  async saveBudget(data: {
    userId: number | string;
    month: string;
    amount: number;
  }): Promise<{ success: boolean; budget: { userId: number | string; month: string; amount: number } }> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/budget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const result = await res.json();
          return { success: true, budget: result };
        }
      } catch (e: any) {
        console.warn('Backend call failed, using mock save budget fallback:', e.message);
      }
    }

    await delay(200);
    const budgets = getStoredBudgets();
    budgets[data.month] = Number(data.amount);
    saveStoredBudgets(budgets);

    return {
      success: true,
      budget: {
        userId: data.userId,
        month: data.month,
        amount: Number(data.amount),
      },
    };
  },

  // Helper to reset store if user wishes
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(SEED_BUDGETS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_USER]));
  },
};
