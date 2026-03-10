import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CompletedWorkout } from '../types';

interface CalendarProps {
  gymDays: string[];
  onToggleDay: (date: string) => void;
  history: CompletedWorkout[];
  disableInternalModal?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ gymDays, onToggleDay, history, disableInternalModal }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
  };

  const isGymDay = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    return gymDays.includes(dateStr);
  };

  const getWorkoutForDay = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    return history.find(h => h.date.startsWith(dateStr));
  };

  const handleDayClick = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    const workout = getWorkoutForDay(day);
    
    if (disableInternalModal) {
      onToggleDay(dateStr);
      return;
    }

    if (workout) {
      setSelectedWorkout(workout);
    } else {
      onToggleDay(dateStr);
    }
  };

  return (
    <div className="m3-card p-5 mb-8 relative overflow-hidden border border-[var(--outline)]/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">
          {monthNames[currentMonth.getMonth()]} <span className="text-[var(--primary)]">{currentMonth.getFullYear()}</span>
        </h2>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors text-[var(--outline)]"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors text-[var(--outline)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {days.map(day => {
          const gym = isGymDay(day);
          const today = isToday(day);
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square flex items-center justify-center rounded-full text-sm relative transition-all font-semibold tap-highlight-none
                ${gym ? 'bg-[var(--primary)] text-[var(--on-primary)] shadow-md' : 'hover:bg-[var(--surface-container)] text-[var(--text)]'}
                ${today && !gym ? 'text-[var(--primary)] ring-1 ring-[var(--primary)]' : ''}
              `}
            >
              {day}
              {gym && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-0.5 -right-0.5 bg-[var(--surface)] text-[var(--primary)] rounded-full p-0.5 shadow-sm border border-[var(--outline)]/10"
                >
                  <Check size={6} strokeWidth={4} />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedWorkout && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedWorkout(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[var(--surface)] w-full max-w-sm rounded-[32px] p-6 shadow-2xl overflow-hidden text-[var(--text)] border border-[var(--outline)]/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{selectedWorkout.workoutName}</h3>
                  <p className="text-[var(--outline)] text-sm font-medium">{new Date(selectedWorkout.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="bg-[var(--surface-container)] px-3 py-1.5 rounded-full text-xs font-bold text-[var(--text)] border border-[var(--outline)]/10">
                  {selectedWorkout.duration}m
                </div>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                {selectedWorkout.exercises.map((ex, i) => (
                  <div key={i} className="bg-[var(--surface-container)] p-4 rounded-2xl border border-[var(--outline)]/10">
                    <p className="text-sm font-bold text-[var(--text)] mb-1">{ex.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {ex.sets.map((s, si) => (
                        <span key={si} className="text-[10px] font-bold text-[var(--outline)] bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--outline)]/10">
                          {s.weight}{s.isLbs ? 'lb' : 'kg'} × {s.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedWorkout.notes && (
                  <div className="bg-[var(--primary)]/5 p-4 rounded-2xl border border-[var(--primary)]/10">
                    <p className="text-xs text-[var(--primary)] font-medium italic">"{selectedWorkout.notes}"</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedWorkout(null)}
                className="w-full mt-6 py-4 bg-[var(--primary)] text-[var(--on-primary)] rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
