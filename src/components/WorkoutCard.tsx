import React from 'react';
import { Play } from 'lucide-react';
import { WorkoutDay } from '../types';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onStart: (workout: WorkoutDay) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart }) => {
  const totalSets = workout.groups.reduce((acc, g) => acc + g.count * 3, 0);

  return (
    <button
      onClick={() => onStart(workout)}
      className="w-full relative overflow-hidden bg-card hover:bg-slate-700/50 transition-all p-5 rounded-2xl flex items-center justify-between group text-left mb-4 shadow-xl border border-white/5"
    >
      {/* Background Gradient Glow */}
      <div 
        className="absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"
        style={{ backgroundColor: workout.accentColor }}
      />
      
      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Day {workout.id}</span>
          <div className="h-1 w-1 rounded-full bg-slate-500 opacity-50" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">~{totalSets} Sets</span>
        </div>
        <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
            style={{ backgroundImage: `linear-gradient(to right, white, ${workout.accentColor})` }}>
          {workout.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {workout.groups.map(g => (
            <span 
              key={g.name}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${workout.accentColor}15`, color: workout.accentColor, border: `1px solid ${workout.accentColor}30` }}
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg relative z-10"
        style={{ backgroundColor: workout.accentColor, boxShadow: `0 8px 20px ${workout.accentColor}40` }}
      >
        <Play size={20} fill="white" className="ml-1 text-white" />
      </div>
    </button>
  );
};
