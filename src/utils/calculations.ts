export interface Transaction {
  id: string | number;
  userId: number | string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt?: string;
}

export type BudgetStatus = 'normal' | 'warning' | 'exceeded';

export const CATEGORIES = [
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
] as const;

export type CategoryType = typeof CATEGORIES[number];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; hex: string; lightHex: string }> = {
  Food: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-600', hex: '#10B981', lightHex: '#D1FAE5' },
  Travel: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-600', hex: '#3B82F6', lightHex: '#DBEAFE' },
  Education: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-600', hex: '#6366F1', lightHex: '#E0E7FF' },
  Shopping: { bg: 'bg-pink-50 text-pink-700 border-pink-200', text: 'text-pink-600', hex: '#EC4899', lightHex: '#FCE7F3' },
  Bills: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-600', hex: '#F59E0B', lightHex: '#FEF3C7' },
  Entertainment: { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-600', hex: '#8B5CF6', lightHex: '#EDE9FE' },
  Health: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'text-rose-600', hex: '#F43F5E', lightHex: '#FFE4E6' },
  Other: { bg: 'bg-slate-50 text-slate-700 border-slate-200', text: 'text-slate-600', hex: '#64748B', lightHex: '#F1F5F9' },
};

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

export function calculateRemainingBudget(budget: number, totalExpenses: number): number {
  return Math.max(0, (budget || 0) - (totalExpenses || 0));
}

export function calculateBudgetPercentage(totalExpenses: number, budget: number): number {
  if (!budget || budget <= 0) return 0;
  const pct = ((totalExpenses || 0) / budget) * 100;
  return Math.round(pct * 10) / 10; // 1 decimal place
}

export function calculateCategoryTotals(transactions: Transaction[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    result[cat] = 0;
  }

  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      const cat = t.category || 'Other';
      result[cat] = (result[cat] || 0) + (Number(t.amount) || 0);
    });

  return result;
}

export function getBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 80) return 'warning';
  return 'normal';
}
