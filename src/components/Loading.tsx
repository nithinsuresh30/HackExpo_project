import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} animate-spin text-[#6C5CE7]`} />
      <p className="text-slate-500 font-medium animate-pulse">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-xs flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-24 h-4 bg-slate-200 rounded-md"></div>
        <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="w-32 h-7 bg-slate-200 rounded-lg mb-2"></div>
      <div className="w-20 h-3 bg-slate-100 rounded-md"></div>
    </div>
  );
};
