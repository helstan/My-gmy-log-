import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  color: string;
  progress?: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon: Icon, color, progress, className = '' }) => {
  return (
    <div className={`gamified-card flex flex-col justify-between min-h-[140px] ${className}`}>
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ background: color }}>
          <Icon size={20} />
        </div>
        {progress !== undefined && (
          <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
            {progress}%
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">{title}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-[var(--text)] tracking-tight">{value}</span>
          {unit && <span className="text-xs font-bold text-[var(--text-muted)]">{unit}</span>}
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-3 h-1.5 w-full bg-[var(--surface-container)] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500" 
            style={{ width: `${progress}%`, background: color }}
          />
        </div>
      )}
    </div>
  );
};
