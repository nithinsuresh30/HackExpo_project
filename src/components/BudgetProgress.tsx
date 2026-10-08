import React from 'react';
import { formatCurrency, getBudgetStatus } from '../utils/calculations';
import { ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  monthLabel?: string;
  onEditBudgetClick?: () => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  budget,
  monthLabel = 'This Month',
  onEditBudgetClick,
}) => {
  const percent = budget > 0 ? Math.round((spent / budget) * 1000) / 10 : 0;
  const clampedDisplayPercent = Math.min(100, Math.max(0, percent));
  const remaining = Math.max(0, budget - spent);
  const status = getBudgetStatus(percent);

  // Styling based on 0-79% (Normal), 80-99% (Warning), 100%+ (Exceeded)
  const barColor =
    status === 'exceeded'
      ? 'bg-rose-500'
      : status === 'warning'
      ? 'bg-amber-500'
      : 'bg-[#6C5CE7]';

  const badgeConfig = {
    normal: {
      text: 'Healthy Spending',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    warning: {
      text: '80% Warning Limit',
      classes: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
    },
    exceeded: {
      text: 'Budget Exceeded',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Monthly Budget Progress
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badgeConfig[status].classes}`}
            >
              {badgeConfig[status].text}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Spending pace for {monthLabel}
          </p>
        </div>

        {onEditBudgetClick && (
          <button
            onClick={onEditBudgetClick}
            type="button"
            className="self-start sm:self-auto text-xs font-semibold text-[#6C5CE7] hover:text-[#5848c4] hover:underline flex items-center space-x-1"
          >
            <span>Adjust Target</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-baseline justify-between mb-2 gap-2">
        <div className="text-sm font-semibold text-slate-700">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mr-1.5">
            {formatCurrency(spent)}
          </span>
          <span className="text-slate-400 font-normal">spent of</span>{' '}
          <span className="text-slate-700 font-bold">{formatCurrency(budget)}</span>
        </div>
        <div className="text-sm font-extrabold text-slate-800 flex items-center space-x-1.5">
          <span>{percent}%</span>
          <span className="text-xs font-normal text-slate-400">used</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clampedDisplayPercent}%` }}
        />
      </div>

      {/* Footer details */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-1.5">
          {status === 'exceeded' ? (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span className="text-rose-600 font-bold">
                Exceeded by {formatCurrency(spent - budget)}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              <span>
                <strong className="text-slate-800 font-bold">{formatCurrency(remaining)}</strong> remaining safe to spend
              </span>
            </>
          )}
        </div>

        <div className="text-slate-400">
          Recommended daily limit: {formatCurrency(remaining > 0 ? remaining / 25 : 0)}/day
        </div>
      </div>
    </div>
  );
};
