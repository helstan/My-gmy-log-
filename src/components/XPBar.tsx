import React from 'react';
import { motion } from 'motion/react';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, requiredXP, level, className = '' }) => {
  const progress = Math.min((currentXP / requiredXP) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-xp)] flex items-center justify-center text-white font-black text-sm shadow-sm">
            {level}
          </div>
          <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Level</span>
        </div>
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          {currentXP} / {requiredXP} XP
        </span>
      </div>
      <div className="h-4 w-full bg-[var(--surface-container)] rounded-full overflow-hidden p-1 border border-[var(--outline)]/10 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-[var(--gradient-xp)] shadow-[0_0_10px_rgba(249,212,35,0.5)]"
        />
      </div>
    </div>
  );
};
