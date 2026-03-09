import React from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { PersonalRecord } from '../types';

interface PRViewProps {
  prs: PersonalRecord[];
}

export const PRView: React.FC<PRViewProps> = ({ prs }) => {
  return (
    <div className="space-y-4 pb-10">
      <div className="bg-gradient-to-br from-passion to-power rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30 group-hover:rotate-6 transition-transform">
            <Trophy size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Hall of Fame</h2>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Your Ultimate Personal Records</p>
          </div>
        </div>
      </div>

      {prs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="font-bold uppercase tracking-widest">No Legends Yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prs.map((pr, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 border border-white/5 shadow-xl flex items-center justify-between group hover:border-passion/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-passion to-power opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-passion group-hover:text-white transition-colors shadow-inner">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-passion transition-colors">{pr.exerciseName}</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4 relative z-10">
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-black text-white group-hover:text-passion transition-colors">{pr.bestVolume.toFixed(0)}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">KG</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Max Volume</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-700 group-hover:text-passion group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
