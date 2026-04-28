import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BiasCardProps {
  label: string;
  value: string | number;
  description?: string;
  type?: 'bias' | 'feature' | 'explanation';
  level?: 'Low' | 'Medium' | 'High';
}

const BiasCard: React.FC<BiasCardProps> = ({ label, value, description, type, level }) => {
  const getLevelColor = (lvl?: string) => {
    switch (lvl) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getIcon = () => {
    if (type === 'bias') {
      if (level === 'Low') return <CheckCircle className="w-5 h-5 text-green-500" />;
      return <AlertTriangle className={cn("w-5 h-5", level === 'High' ? "text-red-500" : "text-yellow-500")} />;
    }
    if (type === 'feature') return <TrendingDown className="w-5 h-5 text-blue-500" />;
    return <Info className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {getIcon()}
      </div>
      <div className="mt-auto">
        {type === 'bias' ? (
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getLevelColor(level)
          )}>
            {value}
          </span>
        ) : (
          <h3 className="text-xl font-bold text-slate-900">{value}</h3>
        )}
        {description && (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default BiasCard;
