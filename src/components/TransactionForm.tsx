import React, { useState } from 'react';
import { CATEGORIES, CategoryType } from '../utils/calculations';
import { api, Transaction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Plus, AlertCircle, CheckCircle2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (newTx: Transaction) => void;
  isModal?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen = true,
  onClose,
  onSuccess,
  isModal = true,
}) => {
  const { currentUser } = useAuth();

  const getTodayDate = () => {
    const today = new Date();
    // Default to the month of the prompt (2026-10-06) if year aligns, or local ISO date
    return '2026-10-06';
  };

  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [date, setDate] = useState<string>(getTodayDate());
  const [note, setNote] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (isModal && !isOpen) {
    return null;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!type) {
      errs.type = 'Transaction type is required';
    }
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Amount must be greater than ₹0';
    }
    if (!category) {
      errs.category = 'Category is required';
    }
    if (!date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.addTransaction({
        userId: currentUser?.id || 1,
        type,
        amount: parseFloat(amount),
        category,
        date,
        note: note.trim(),
      });

      setSuccessMsg('Transaction added successfully!');
      // Reset form fields
      setAmount('');
      setNote('');
      setErrors({});

      if (onSuccess) {
        onSuccess(created);
      }

      if (isModal && onClose) {
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-100 relative">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Add New Transaction</h3>
          <p className="text-xs text-slate-400">Record your income or college expense</p>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Segmented Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                if (category === 'Other') setCategory('Food');
              }}
              className={`py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                type === 'EXPENSE'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('INCOME');
                setCategory('Other');
              }}
              className={`py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                type === 'INCOME'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Amount (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
              ₹
            </span>
            <input
              id="amount-input"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 250"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: '' });
              }}
              className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-slate-900 font-semibold text-base transition-colors focus:outline-hidden focus:ring-2 ${
                errors.amount
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-600 font-medium mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category & Date in 2 columns on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Category *
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Date *
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors({ ...errors, date: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 ${
                errors.date
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/20'
              }`}
            />
            {errors.date && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Note / Description <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="note-input"
            type="text"
            placeholder="e.g. Lunch at college canteen"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-hidden focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-end space-x-3">
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5848c4] disabled:bg-slate-300 text-white text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {content}
      </div>
    );
  }

  return content;
};
