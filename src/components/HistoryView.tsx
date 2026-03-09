import React, { useState } from 'react';
import { CompletedWorkout } from '../types';
import { WORKOUT_SPLIT } from '../constants';
import { Calendar } from './Calendar';
import { Clock, MapPin, FileText, Camera, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryViewProps {
  history: CompletedWorkout[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<CompletedWorkout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayClick = (date: string) => {
    const workouts = history.filter(h => h.date.startsWith(date));
    setSelectedDateWorkouts(workouts);
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6 pb-20">
      <Calendar 
        gymDays={history.map(h => h.date.split('T')[0])} 
        onToggleDay={handleDayClick} 
        history={history} 
        disableInternalModal={true}
      />

      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <span className="text-[10px] font-bold text-passion uppercase bg-passion/10 px-2 py-0.5 rounded-full">
                {selectedDateWorkouts.length} Session{selectedDateWorkouts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedDateWorkouts.length === 0 ? (
              <div className="bg-card rounded-3xl p-8 border border-white/5 text-center">
                <p className="text-slate-500 text-sm font-bold">No workouts recorded for this day.</p>
              </div>
            ) : (
              selectedDateWorkouts.map(workout => (
                <div 
                  key={workout.id} 
                  className="bg-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-passion transition-colors">
                          {workout.workoutName}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock size={14} />
                            <span className="text-xs font-bold">{workout.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Activity size={14} className="text-energy" />
                            <span className="text-xs font-bold">{workout.exercises.length} Exercises</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {workout.photo && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video">
                          <img src={workout.photo} alt="Progress" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-4">
                        {workout.exercises.map((ex, i) => (
                          <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-black text-white uppercase tracking-tight">{ex.name}</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">{ex.muscleGroup}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {ex.sets.map((s, si) => (
                                <div key={si} className="bg-slate-800 px-2 py-1 rounded-lg flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono font-black text-energy">{s.weight}{s.isLbs ? 'lb' : 'kg'}</span>
                                  <span className="text-[8px] font-bold text-slate-500">×</span>
                                  <span className="text-[10px] font-mono font-black text-white">{s.reps}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {workout.notes && (
                        <div className="bg-passion/5 p-4 rounded-2xl border border-passion/10 flex gap-3">
                          <FileText size={16} className="text-passion flex-shrink-0" />
                          <p className="text-xs text-slate-400 italic leading-relaxed">"{workout.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Activity = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
