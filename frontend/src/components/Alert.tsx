import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2",
      styles[type]
    )}>
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
