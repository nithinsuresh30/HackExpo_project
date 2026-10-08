import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, Transaction } from '../services/api';
import { CATEGORIES, formatCurrency } from '../utils/calculations';
import { MonthSelector } from '../components/MonthSelector';
import { TransactionList } from '../components/TransactionList';
import { TransactionForm } from '../components/TransactionForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export const Transactions: React.FC = () => {
  const { currentUser } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError('');

    try {
      // Fetch for selected month, or all if selected
      const list = await api.getTransactions({
        userId: currentUser.id,
        month: selectedMonth === 'ALL' ? undefined : selectedMonth,
      });
      setTransactions(list);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser, selectedMonth]);

  useEffect(() => {
    const handleGlobalAdd = () => {
      fetchTransactions();
    };
    window.addEventListener('spendwise:transaction-added', handleGlobalAdd);
    return () => {
      window.removeEventListener('spendwise:transaction-added', handleGlobalAdd);
    };
  }, [currentUser, selectedMonth]);

  // Client-side filtering across Type, Category, and Search term
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type filter
      if (filterType !== 'ALL' && t.type !== filterType) {
        return false;
      }
      // Category filter
      if (filterCategory !== 'ALL' && t.category !== filterCategory) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const noteMatch = (t.note || '').toLowerCase().includes(query);
        const catMatch = (t.category || '').toLowerCase().includes(query);
        const amountMatch = String(t.amount).includes(query);
        if (!noteMatch && !catMatch && !amountMatch) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, filterType, filterCategory, searchQuery]);

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteTransaction(transactionToDelete.id);
      setSuccessNotice('Transaction deleted successfully.');
      setTransactionToDelete(null);
      await fetchTransactions();
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while deleting transaction.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTransactionAdded = () => {
    setSuccessNotice('Transaction added successfully!');
    fetchTransactions();
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const resetFilters = () => {
    setFilterType('ALL');
    setFilterCategory('ALL');
    setSearchQuery('');
  };

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Track all your college income and expenses.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/20 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Notifications */}
      {successNotice && (
        <SuccessMessage message={successNotice} onDismiss={() => setSuccessNotice('')} />
      )}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Filter Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Month Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Month
            </label>
            <MonthSelector
              currentMonth={selectedMonth}
              onChange={(m) => setSelectedMonth(m)}
              className="w-full"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="EXPENSE">Expense Only</option>
              <option value="INCOME">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
              />
            </div>
          </div>
        </div>

        {/* Filter Summary & Quick Reset */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-50 text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-4">
            <span>
              Showing <strong className="text-slate-900">{filteredTransactions.length}</strong>{' '}
              transactions
            </span>
            <span className="text-emerald-600 font-bold">
              + {formatCurrency(totalFilteredIncome)}
            </span>
            <span className="text-rose-600 font-bold">
              - {formatCurrency(totalFilteredExpense)}
            </span>
          </div>

          {(filterType !== 'ALL' || filterCategory !== 'ALL' || searchQuery.trim()) && (
            <button
              onClick={resetFilters}
              type="button"
              className="text-[#6C5CE7] hover:underline font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table / Mobile Cards */}
      {isLoading ? (
        <Loading message="Loading transactions..." />
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onDelete={(tx) => setTransactionToDelete(tx)}
          onAddNewClick={() => setIsAddModalOpen(true)}
          emptyMessage={
            searchQuery || filterCategory !== 'ALL' || filterType !== 'ALL'
              ? 'No transactions matched your selected filters.'
              : 'No transactions recorded for this month yet.'
          }
        />
      )}

      {/* Add Modal */}
      <TransactionForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleTransactionAdded}
        isModal={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!transactionToDelete}
        title="Delete Transaction?"
        message={`Are you sure you want to delete this transaction "${transactionToDelete?.note || transactionToDelete?.category}" of ${formatCurrency(transactionToDelete?.amount || 0)}?`}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
};
