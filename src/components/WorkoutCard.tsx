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
      className="m3-card w-full p-5 flex items-center justify-between group text-left tap-highlight-none active:scale-[0.98] border border-[var(--outline)]/10 hover:bg-[var(--surface)] transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--outline)]">Day {workout.id}</span>
          <div className="w-1 h-1 rounded-full bg-[var(--outline)]/30" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--outline)]">~{totalSets} Sets</span>
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-3 transition-colors group-hover:text-[var(--primary)]">
          {workout.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {workout.groups.map(g => (
            <span 
              key={g.name}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight bg-[var(--surface)] text-[var(--text)] border border-[var(--outline)]/10"
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md bg-[var(--primary-container)] text-[var(--on-primary-container)]"
      >
        <Play size={20} className="ml-1 fill-current" />
      </div>
    </button>
  );
};
