import React from 'react';
import { Transaction, formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/calculations';
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
} from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete?: (transaction: Transaction) => void;
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

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onDelete,
}) => {
  const isIncome = transaction.type === 'INCOME';
  const Icon = CATEGORY_ICONS[transaction.category] || MoreHorizontal;
  const color = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.Other;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
            style={{
              backgroundColor: isIncome ? '#DCFCE7' : color.lightHex,
              color: isIncome ? '#16A34A' : color.hex,
            }}
          >
            {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 text-sm truncate">
                {transaction.note || transaction.category}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                  isIncome
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {transaction.category}
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-1 text-xs text-slate-400">
              <span>{formatDate(transaction.date)}</span>
              <span>•</span>
              <span
                className={`font-semibold ${
                  isIncome ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {transaction.type}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div
            className={`font-extrabold text-base ${
              isIncome ? 'text-emerald-600' : 'text-slate-900'
            }`}
          >
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(transaction)}
              type="button"
              aria-label="Delete transaction"
              className="mt-1 text-slate-300 hover:text-rose-600 p-1 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
