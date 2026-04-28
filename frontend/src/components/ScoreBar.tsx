import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ScoreBarProps {
  score: number;
  label: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, label }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
          <div className="text-3xl font-bold text-slate-900 mt-1">{score}%</div>
        </div>
        <div className={cn(
          "px-2 py-1 rounded text-xs font-bold text-white",
          getScoreColor(score)
        )}>
          {score >= 80 ? 'EXCELLENT' : score >= 50 ? 'AVERAGE' : 'POOR'}
        </div>
      </div>
      <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("absolute left-0 top-0 h-full transition-all duration-1000 ease-out rounded-full", getScoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default ScoreBar;
