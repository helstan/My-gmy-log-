import React from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { PersonalRecord } from '../types';

interface PRViewProps {
  prs: PersonalRecord[];
}

export const PRView: React.FC<PRViewProps> = ({ prs }) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="m3-card p-6 mb-8 relative overflow-hidden group border border-[var(--outline)]/10">
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[var(--energy)]/10 flex items-center justify-center shadow-sm border border-[var(--energy)]/20 group-hover:rotate-6 transition-transform">
            <Trophy size={32} className="text-[var(--energy)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight">Hall of Fame</h2>
            <p className="text-xs font-bold text-[var(--outline)] uppercase tracking-wider">Your Personal Records</p>
          </div>
        </div>
      </div>

      {prs.length === 0 ? (
        <div className="text-center py-20 text-[var(--outline)]">
          <p className="font-bold uppercase tracking-wider text-sm">No Legends Yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {prs.map((pr, i) => (
            <div key={i} className="m3-card p-5 flex items-center justify-between group active:scale-[0.98] transition-all border border-[var(--outline)]/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-xs font-bold text-[var(--outline)] group-hover:bg-[var(--energy)]/10 group-hover:text-[var(--energy)] transition-colors">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{pr.exerciseName}</h3>
                  <p className="text-[10px] text-[var(--outline)] font-bold uppercase tracking-wider mt-0.5">{new Date(pr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{pr.bestVolume.toFixed(0)}</span>
                    <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">KG</span>
                  </div>
                  <span className="text-[9px] font-bold text-[var(--outline)] uppercase tracking-wider">Max Volume</span>
                </div>
                <ArrowUpRight size={18} className="text-[var(--outline)]/30 group-hover:text-[var(--primary)] transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
