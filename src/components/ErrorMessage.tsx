import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss, className = '' }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start justify-between p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl shadow-xs transition-all animate-fadeIn ${className}`}
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-sm font-medium leading-relaxed">{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          type="button"
          aria-label="Dismiss error"
          className="text-rose-500 hover:text-rose-700 p-1 -mr-1 rounded-lg hover:bg-rose-100/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
