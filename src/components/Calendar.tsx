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
    <div className="bg-card rounded-3xl p-5 shadow-2xl mb-8 border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-passion via-energy to-power" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
          {monthNames[currentMonth.getMonth()]} <span className="text-passion">{currentMonth.getFullYear()}</span>
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
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
                aspect-square flex items-center justify-center rounded-xl text-sm relative transition-all font-bold
                ${gym ? 'bg-gradient-to-br from-passion to-power text-white shadow-lg shadow-passion/30 scale-105 z-10' : 'hover:bg-slate-800 text-slate-500'}
                ${today ? 'ring-2 ring-energy ring-offset-2 ring-offset-bg' : ''}
              `}
            >
              {day}
              {gym && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-1 -right-1 bg-white text-passion rounded-full p-0.5 shadow-sm"
                >
                  <Check size={8} strokeWidth={4} />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedWorkout && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedWorkout(null)}
          >
            <div 
              className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedWorkout.workoutName}</h3>
                  <p className="text-slate-400 text-sm">{new Date(selectedWorkout.date).toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                  {selectedWorkout.duration}m
                </div>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                {selectedWorkout.exercises.map((ex, i) => (
                  <div key={i} className="border-l-2 border-indigo-500 pl-3">
                    <p className="text-sm font-semibold text-slate-200">{ex.name}</p>
                    <p className="text-xs text-slate-400">
                      {ex.sets.map(s => `${s.weight}${s.isLbs ? 'lb' : 'kg'} × ${s.reps}`).join(' · ')}
                    </p>
                  </div>
                ))}
                {selectedWorkout.notes && (
                  <div className="bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-xs text-slate-400 italic">"{selectedWorkout.notes}"</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedWorkout(null)}
                className="w-full mt-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
