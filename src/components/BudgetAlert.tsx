import React from 'react';
import { AlertTriangle, AlertOctagon, TrendingDown, ArrowRight } from 'lucide-react';
import { getBudgetStatus } from '../utils/calculations';

interface BudgetAlertProps {
  spent: number;
  budget: number;
  percentUsed?: number;
  onManageBudgetClick?: () => void;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({
  spent,
  budget,
  percentUsed,
  onManageBudgetClick,
}) => {
  const percentage =
    percentUsed !== undefined
      ? percentUsed
      : budget > 0
      ? Math.round((spent / budget) * 1000) / 10
      : 0;

  const status = getBudgetStatus(percentage);

  // When spending is below 80%, don't show the warning.
  if (status === 'normal') {
    return null;
  }

  const isExceeded = status === 'exceeded';

  return (
    <div
      role="alert"
      className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all animate-fadeIn ${
        isExceeded
          ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-100'
          : 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isExceeded
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-amber-500 text-white shadow-xs'
            }`}
          >
            {isExceeded ? (
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-base tracking-tight">
                {isExceeded ? '🚨 Budget Exceeded' : '⚠️ Budget Alert'}
              </h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isExceeded
                    ? 'bg-rose-200/80 text-rose-800'
                    : 'bg-amber-200/80 text-amber-800'
                }`}
              >
                {percentage}% used
              </span>
            </div>
            <p className="text-sm mt-1 text-slate-700 leading-relaxed">
              {isExceeded ? (
                <>
                  You have exceeded your monthly budget by{' '}
                  <strong className="text-rose-700">₹{(spent - budget).toLocaleString('en-IN')}</strong>. Please pause non-essential expenses immediately.
                </>
              ) : (
                <>
                  You have used <strong>{percentage}%</strong> of your monthly budget.
                  Consider reducing your spending for the rest of the month.
                </>
              )}
            </p>
          </div>
        </div>

        {onManageBudgetClick && (
          <button
            onClick={onManageBudgetClick}
            type="button"
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-2xs self-end sm:self-auto ${
              isExceeded
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            <span>Review Budget</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
