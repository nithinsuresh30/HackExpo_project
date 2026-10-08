import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from '../utils/calculations';
import {
  Utensils,
  Bus,
  GraduationCap,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  MoreHorizontal,
  PieChart as PieChartIcon,
} from 'lucide-react';

interface CategorySummaryProps {
  categorySummary: Record<string, number>;
  totalExpenses?: number;
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

export const CategorySummary: React.FC<CategorySummaryProps> = ({
  categorySummary,
  totalExpenses: explicitTotal,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Compute total spent
  const computedTotal = CATEGORIES.reduce(
    (sum, cat) => sum + (categorySummary[cat] || 0),
    0
  );
  const total = explicitTotal !== undefined ? explicitTotal : computedTotal;

  // Filter categories with values > 0 and sort by amount descending
  const activeCategories = CATEGORIES.map((cat) => ({
    name: cat,
    amount: categorySummary[cat] || 0,
    percentage: total > 0 ? Math.round(((categorySummary[cat] || 0) / total) * 1000) / 10 : 0,
    color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other,
    Icon: CATEGORY_ICONS[cat] || MoreHorizontal,
  }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (activeCategories.length === 0 || total === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center py-12">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <PieChartIcon className="w-7 h-7" />
        </div>
        <h4 className="font-bold text-slate-800 text-base mb-1">Expense by Category</h4>
        <p className="text-sm text-slate-400 max-w-xs">
          No expense data available for this month.
        </p>
      </div>
    );
  }

  // Generate SVG Donut Segments
  let cumulativePercentage = 0;
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  const donutSegments = activeCategories.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
    cumulativePercentage += item.percentage;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeHoverItem = hoveredCategory
    ? activeCategories.find((c) => c.name === hoveredCategory)
    : activeCategories[0];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Expense by Category
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown across your spending habits
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
          {activeCategories.length} Categories
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center py-2">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.name}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={segment.color.hex}
                  strokeWidth={hoveredCategory === segment.name ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(segment.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[100px]">
                {activeHoverItem?.name || 'Total Spent'}
              </span>
              <span className="text-lg font-extrabold text-slate-900 leading-tight">
                {activeHoverItem ? formatCurrency(activeHoverItem.amount) : formatCurrency(total)}
              </span>
              <span className="text-xs font-semibold text-[#6C5CE7]">
                {activeHoverItem ? `${activeHoverItem.percentage}%` : '100%'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Hover over a segment to inspect details
          </p>
        </div>

        {/* Category List & Progress Bars */}
        <div className="lg:col-span-7 space-y-3">
          {activeCategories.map((item) => {
            const { Icon } = item;
            const isHovered = hoveredCategory === item.name;

            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isHovered ? 'bg-slate-50 ring-1 ring-slate-200' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color.lightHex, color: item.color.hex }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-400">
                      {item.percentage}%
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>

                {/* Horizontal Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color.hex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
