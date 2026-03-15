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
              <h3 className="text-sm font-bold text-[var(--outline)] uppercase tracking-wider">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <span className="text-[10px] font-bold text-[var(--primary)] uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
                {selectedDateWorkouts.length} Session{selectedDateWorkouts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedDateWorkouts.length === 0 ? (
              <div className="m3-card p-10 text-center border border-[var(--outline)]/10">
                <p className="text-[var(--outline)] text-sm font-bold">No workouts recorded for this day.</p>
              </div>
            ) : (
              selectedDateWorkouts.map(workout => (
                <div 
                  key={workout.id} 
                  className="m3-card overflow-hidden group border border-[var(--outline)]/10"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-2xl font-bold text-[var(--text)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                          {workout.workoutName}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-[var(--outline)]">
                            <Clock size={14} />
                            <span className="text-xs font-bold">{workout.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--outline)]">
                            <Activity size={14} className="text-[var(--primary)]" />
                            <span className="text-xs font-bold">{workout.exercises.length} Exercises</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {workout.photo && (
                        <div className="rounded-2xl overflow-hidden border border-[var(--outline)]/10 aspect-video">
                          <img src={workout.photo} alt="Progress" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        {workout.exercises.map((ex, i) => (
                          <div key={i} className="bg-[var(--surface-container)] rounded-2xl p-4 border border-[var(--outline)]/10">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold text-[var(--text)] uppercase tracking-tight">{ex.name}</span>
                              <span className="text-[10px] font-bold text-[var(--outline)] uppercase">{ex.muscleGroup}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {ex.sets.map((s, si) => (
                                <div key={si} className="bg-[var(--surface)] px-2 py-1 rounded-lg flex items-center gap-1.5 border border-[var(--outline)]/10">
                                  {ex.muscleGroup === 'Cardio' ? (
                                    <>
                                      <span className="text-[10px] font-bold text-[var(--primary)]">{s.duration ? (s.duration / 60).toFixed(1) : 0}m</span>
                                      <span className="text-[8px] font-bold text-[var(--outline)]">|</span>
                                      <span className="text-[10px] font-bold text-[var(--text)]">{s.distance || 0}km</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-[10px] font-bold text-[var(--primary)]">{s.weight}{s.isLbs ? 'lb' : 'kg'}</span>
                                      <span className="text-[8px] font-bold text-[var(--outline)]">×</span>
                                      <span className="text-[10px] font-bold text-[var(--text)]">{s.reps}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {workout.notes && (
                        <div className="bg-[var(--primary)]/5 p-4 rounded-2xl border border-[var(--primary)]/10 flex gap-3">
                          <FileText size={16} className="text-[var(--primary)] flex-shrink-0" />
                          <p className="text-xs text-[var(--text)] italic leading-relaxed">"{workout.notes}"</p>
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
