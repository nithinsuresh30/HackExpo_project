import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onDismiss,
  className = '',
}) => {
  if (!message) return null;

  return (
    <div
      role="status"
      className={`flex items-start justify-between p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl shadow-xs transition-all animate-fadeIn ${className}`}
    >
      <div className="flex items-start space-x-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm font-medium leading-relaxed">{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          type="button"
          aria-label="Dismiss message"
          className="text-emerald-500 hover:text-emerald-700 p-1 -mr-1 rounded-lg hover:bg-emerald-100/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
