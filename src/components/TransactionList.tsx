import React from 'react';
import { Transaction, formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/calculations';
import { TransactionCard } from './TransactionCard';
import {
  Utensils,
  Bus,
  GraduationCap,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  MoreHorizontal,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  ReceiptText,
  Plus,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (transaction: Transaction) => void;
  onAddNewClick?: () => void;
  maxItems?: number;
  emptyMessage?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Food: Utensils,
  Travel: Bus,
  Education: GraduationCap,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Film,
  Health: HeartPulse,
  Other: MoreHorizontal,
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onAddNewClick,
  maxItems,
  emptyMessage = 'No transactions found for this period.',
}) => {
  const displayItems = maxItems ? transactions.slice(0, maxItems) : transactions;

  if (displayItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#6C5CE7] flex items-center justify-center mb-4">
          <ReceiptText className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">No transactions yet</h4>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          {emptyMessage || 'Start tracking your spending by adding your first income or expense.'}
        </p>
        {onAddNewClick && (
          <button
            onClick={onAddNewClick}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white font-semibold text-sm transition-all shadow-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card Layout (< 768px) */}
      <div className="md:hidden space-y-3">
        {displayItems.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} onDelete={onDelete} />
        ))}
      </div>

      {/* Desktop / Tablet Table (>= 768px) */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-5">Date</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Note / Description</th>
              <th className="py-3.5 px-5 text-right">Amount</th>
              {onDelete && <th className="py-3.5 px-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {displayItems.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              const Icon = CATEGORY_ICONS[tx.category] || MoreHorizontal;
              const color = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-4 px-5 font-medium text-slate-600 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isIncome ? '#DCFCE7' : color.lightHex,
                          color: isIncome ? '#16A34A' : color.hex,
                        }}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800">{tx.category}</span>
                    </div>
                  </td>

                  {/* Note */}
                  <td className="py-4 px-4 text-slate-600 font-normal max-w-xs truncate">
                    {tx.note || <span className="text-slate-300 italic">No note</span>}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-5 text-right whitespace-nowrap font-extrabold">
                    <span className={isIncome ? 'text-emerald-600' : 'text-slate-900'}>
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Action */}
                  {onDelete && (
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDelete(tx)}
                        type="button"
                        aria-label={`Delete transaction ${tx.note || tx.category}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
