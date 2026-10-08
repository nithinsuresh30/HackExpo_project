import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency, getBudgetStatus, calculateBudgetPercentage } from '../utils/calculations';
import { MonthSelector } from '../components/MonthSelector';
import { BudgetAlert } from '../components/BudgetAlert';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  Save,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Target,
} from 'lucide-react';

export const Budget: React.FC = () => {
  const { currentUser } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [budgetAmount, setBudgetAmount] = useState<number>(20000);
  const [inputBudget, setInputBudget] = useState<string>('20000');
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadBudgetData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const [budgetRes, dashRes] = await Promise.all([
        api.getBudget({ userId: currentUser.id, month: selectedMonth }),
        api.getDashboard({ userId: currentUser.id, month: selectedMonth }),
      ]);

      setBudgetAmount(budgetRes.amount);
      setInputBudget(String(budgetRes.amount));
      setTotalSpent(dashRes.spent);
    } catch (err: any) {
      setErrorMsg('Failed to load budget data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, [currentUser, selectedMonth]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const parsed = parseFloat(inputBudget);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMsg('Please enter a valid monthly budget amount greater than ₹0.');
      return;
    }

    setIsSaving(true);
    try {
      await api.saveBudget({
        userId: currentUser?.id || 1,
        month: selectedMonth,
        amount: parsed,
      });

      setBudgetAmount(parsed);
      setSuccessMsg(`Budget for ${selectedMonth} updated to ${formatCurrency(parsed)} successfully!`);
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while saving your budget.');
    } finally {
      setIsSaving(false);
    }
  };

  const percentUsed = calculateBudgetPercentage(totalSpent, budgetAmount);
  const remaining = Math.max(0, budgetAmount - totalSpent);
  const status = getBudgetStatus(percentUsed);

  const statusTheme = {
    normal: {
      label: 'Normal Spending Pace',
      barColor: 'bg-[#6C5CE7]',
      textColor: 'text-slate-900',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    warning: {
      label: 'Warning (80%+ Consumed)',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-900',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
    },
    exceeded: {
      label: 'Budget Limit Exceeded!',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-900',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Monthly Budget
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Set your limits, track spending progress, and maintain college financial discipline.
          </p>
        </div>

        <MonthSelector
          currentMonth={selectedMonth}
          onChange={(m) => setSelectedMonth(m)}
        />
      </div>

      {/* Notifications */}
      {successMsg && <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg('')} />}
      {errorMsg && <ErrorMessage message={errorMsg} onDismiss={() => setErrorMsg('')} />}

      {/* 80% / 100% Budget Warning */}
      <BudgetAlert spent={totalSpent} budget={budgetAmount} percentUsed={percentUsed} />

      {isLoading ? (
        <Loading message="Loading budget details..." />
      ) : (
        <>
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Current Budget
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatCurrency(budgetAmount)}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-50 flex items-center space-x-1.5 text-xs text-slate-400">
                <Target className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Monthly ceiling</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Total Spent
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatCurrency(totalSpent)}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-50 flex items-center space-x-1.5 text-xs text-slate-400">
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                <span>Actual outflows</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Remaining
              </span>
              <p className={`text-2xl sm:text-3xl font-extrabold ${remaining <= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {formatCurrency(remaining)}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-50 flex items-center space-x-1.5 text-xs text-slate-400">
                <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />
                <span>Surplus buffer</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Budget Used
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {percentUsed}%
              </p>
              <div className="mt-3 pt-2 border-t border-slate-50">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${statusTheme[status].badge}`}>
                  {statusTheme[status].label}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar & Status Display */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Budget Utilization Meter
              </h3>
              <div className="text-sm font-semibold text-slate-600">
                {formatCurrency(totalSpent)} spent of {formatCurrency(budgetAmount)}
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden p-1 border border-slate-200/60 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${statusTheme[status].barColor}`}
                style={{ width: `${Math.min(100, Math.max(0, percentUsed))}%` }}
              />
            </div>

            {/* Threshold Guide */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
              <span>0% (Start)</span>
              <span className="text-amber-600 font-bold">80% Warning Limit</span>
              <span className="text-rose-600 font-bold">100% Exceeded</span>
            </div>
          </div>

          {/* Set / Update Budget Form Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Set Monthly Budget
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update the target budget for {selectedMonth}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveBudget} className="space-y-4">
                <div>
                  <label htmlFor="budget-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Monthly Budget (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                      ₹
                    </span>
                    <input
                      id="budget-input"
                      type="number"
                      min="100"
                      step="500"
                      placeholder="e.g. 20000"
                      value={inputBudget}
                      onChange={(e) => setInputBudget(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-bold text-lg focus:outline-hidden focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Typical monthly budget for college students is ₹15,000 - ₹25,000.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5848c4] disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Budget</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Smart Student Budgeting Tips */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#6C5CE7]/5 via-white to-indigo-50/30 rounded-3xl p-6 sm:p-8 border border-[#6C5CE7]/15 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-[#6C5CE7] font-bold text-sm mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>Student Money Guidelines</span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2">
                  The 50/30/20 Rule for College Life
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0"></span>
                    <span>
                      <strong className="text-slate-800">50% Needs:</strong> Hostel fees, mess food, textbooks, campus transport pass.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8E7CF8] mt-1.5 shrink-0"></span>
                    <span>
                      <strong className="text-slate-800">30% Wants:</strong> Weekend outings, coffee shops, movie screenings, clothes.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong className="text-slate-800">20% Savings:</strong> Emergency buffer for semester end exams & laptop repairs.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SpendWise alerts trigger automatically whenever you reach 80% usage.</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
