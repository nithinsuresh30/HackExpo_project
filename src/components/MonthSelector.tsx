import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface MonthSelectorProps {
  currentMonth: string; // format: 'YYYY-MM'
  onChange: (newMonth: string) => void;
  className?: string;
}

export const MONTH_OPTIONS = [
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-09', label: 'September 2026' },
  { value: '2026-08', label: 'August 2026' },
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-12', label: 'December 2026' },
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonth,
  onChange,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs text-slate-700 hover:border-[#8E7CF8] transition-all cursor-pointer">
        <Calendar className="w-4 h-4 text-[#6C5CE7]" />
        <select
          value={currentMonth}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Select month"
          className="appearance-none bg-transparent font-semibold text-sm pr-6 focus:outline-hidden cursor-pointer text-slate-700"
        >
          {MONTH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3" />
      </div>
    </div>
  );
};
