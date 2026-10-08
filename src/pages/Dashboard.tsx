import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, DashboardResponse, Transaction } from '../services/api';
import { formatCurrency } from '../utils/calculations';
import { MonthSelector } from '../components/MonthSelector';
import { SummaryCard } from '../components/SummaryCard';
import { BudgetProgress } from '../components/BudgetProgress';
import { BudgetAlert } from '../components/BudgetAlert';
import { CategorySummary } from '../components/CategorySummary';
import { TransactionList } from '../components/TransactionList';
import { TransactionForm } from '../components/TransactionForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading, CardSkeleton } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');

  // Transaction modals & delete dialog
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboard = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError('');

    try {
      const [dash, txs] = await Promise.all([
        api.getDashboard({ userId: currentUser.id, month: selectedMonth }),
        api.getTransactions({ userId: currentUser.id, month: selectedMonth }),
      ]);
      setDashboardData(dash);
      setRecentTransactions(txs);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, selectedMonth]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const handleGlobalAdd = () => {
      fetchDashboard();
    };
    window.addEventListener('spendwise:transaction-added', handleGlobalAdd);
    return () => {
      window.removeEventListener('spendwise:transaction-added', handleGlobalAdd);
    };
  }, [fetchDashboard]);

  const handleTransactionAdded = () => {
    setSuccessNotice('Transaction added successfully!');
    fetchDashboard();
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteTransaction(transactionToDelete.id);
      setSuccessNotice('Transaction deleted successfully.');
      setTransactionToDelete(null);
      await fetchDashboard();
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Unable to delete transaction.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const studentFirstName = currentUser?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {studentFirstName} 👋
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Here's your college financial overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MonthSelector
            currentMonth={selectedMonth}
            onChange={(m) => setSelectedMonth(m)}
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="px-4 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/20 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {successNotice && (
        <SuccessMessage
          message={successNotice}
          onDismiss={() => setSuccessNotice('')}
        />
      )}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* 80% / 100% Budget Warning Alert */}
      {dashboardData && (
        <BudgetAlert
          spent={dashboardData.spent}
          budget={dashboardData.budget}
          percentUsed={dashboardData.percentUsed}
          onManageBudgetClick={() => navigate('/budget')}
        />
      )}

      {/* 4 Summary Metric Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Income"
            amount={formatCurrency(dashboardData?.income ?? 0)}
            icon={TrendingUp}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            badge="Received"
            badgeType="success"
            subtitle="Campus + Allowance"
          />

          <SummaryCard
            title="Total Spent"
            amount={formatCurrency(dashboardData?.spent ?? 0)}
            icon={TrendingDown}
            iconBgColor="bg-rose-50"
            iconColor="text-rose-600"
            badge={`${dashboardData?.percentUsed ?? 0}% of budget`}
            badgeType={
              (dashboardData?.percentUsed ?? 0) >= 100
                ? 'danger'
                : (dashboardData?.percentUsed ?? 0) >= 80
                ? 'warning'
                : 'neutral'
            }
            subtitle="Expenses recorded"
          />

          <SummaryCard
            title="Monthly Budget"
            amount={formatCurrency(dashboardData?.budget ?? 0)}
            icon={Wallet}
            iconBgColor="bg-indigo-50"
            iconColor="text-[#6C5CE7]"
            badge="Target"
            badgeType="info"
            subtitle="Configured limit"
          />

          <SummaryCard
            title="Remaining Budget"
            amount={formatCurrency(dashboardData?.remaining ?? 0)}
            icon={PiggyBank}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
            badge={
              (dashboardData?.remaining ?? 0) <= 0
                ? 'Exhausted'
                : 'Available'
            }
            badgeType={(dashboardData?.remaining ?? 0) <= 0 ? 'danger' : 'success'}
            subtitle="Safe to spend"
          />
        </div>
      )}

      {/* Large Budget Progress Component */}
      {dashboardData && (
        <BudgetProgress
          spent={dashboardData.spent}
          budget={dashboardData.budget}
          monthLabel={selectedMonth === '2026-10' ? 'October 2026' : selectedMonth}
          onEditBudgetClick={() => navigate('/budget')}
        />
      )}

      {/* Category Expense Summary (Donut Chart & Bars) */}
      {dashboardData && (
        <CategorySummary
          categorySummary={dashboardData.categorySummary}
          totalExpenses={dashboardData.spent}
        />
      )}

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400">
              Latest activity recorded for this period
            </p>
          </div>
          <button
            onClick={() => navigate('/transactions')}
            type="button"
            className="text-xs sm:text-sm font-bold text-[#6C5CE7] hover:text-[#5848c4] flex items-center space-x-1 group"
          >
            <span>View All Transactions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <TransactionList
          transactions={recentTransactions}
          maxItems={5}
          onDelete={(tx) => setTransactionToDelete(tx)}
          onAddNewClick={() => setIsAddModalOpen(true)}
          emptyMessage="No recent transactions yet for this month."
        />
      </div>

      {/* Add Transaction Modal */}
      <TransactionForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleTransactionAdded}
        isModal={true}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!transactionToDelete}
        title="Delete Transaction?"
        message={`Are you sure you want to delete the transaction "${transactionToDelete?.note || transactionToDelete?.category}" of ${formatCurrency(transactionToDelete?.amount || 0)}?`}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
};
