import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  icon: Icon,
  badge,
  badgeType = 'neutral',
  subtitle,
  iconBgColor = 'bg-[#6C5CE7]/10',
  iconColor = 'text-[#6C5CE7]',
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {amount}
          </h3>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 shadow-2xs`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 font-medium truncate">{subtitle}</span>}
          {badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles[badgeType]}`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
