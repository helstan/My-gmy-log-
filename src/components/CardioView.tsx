import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Plus, History, Calendar as CalendarIcon, Clock, Zap, MapPin, Trash2, Play } from 'lucide-react';
import { CardioLog, CardioWorkout } from '../types';
import { Calendar } from './Calendar';

interface CardioViewProps {
  logs: CardioLog[];
  routines: CardioWorkout[];
  customRoutines: CardioWorkout[];
  onSave: (log: CardioLog) => void;
  onDelete: (id: string) => void;
  onStartRoutine: (routine: CardioWorkout) => void;
}

const CardioRoutineCard = ({ routine, onStart }: { routine: CardioWorkout, onStart: (r: CardioWorkout) => void, key?: React.Key }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onStart(routine)}
    className="m3-card p-5 border border-[var(--outline)]/10 cursor-pointer group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-[var(--primary)]/10" />
    
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: routine.accentColor }}
        >
          <Activity size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">{routine.name}</h3>
          <p className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">
            {routine.exercises.length} Exercises • {Math.round(routine.exercises.reduce((acc, ex) => acc + (ex.duration || 0), 0) / 60)} min
          </p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
        <Play size={18} fill="currentColor" />
      </div>
    </div>
  </motion.div>
);

export const CardioView: React.FC<CardioViewProps> = ({ logs, routines, customRoutines, onSave, onDelete, onStartRoutine }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState(''); // minutes
  const [distance, setDistance] = useState('');
  const [speed, setSpeed] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!exerciseName || !duration) return;

    const newLog: CardioLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      exerciseName,
      duration: parseFloat(duration) * 60,
      distance: distance ? parseFloat(distance) : undefined,
      speed: speed ? parseFloat(speed) : undefined,
      calories: calories ? parseFloat(calories) : undefined,
      notes
    };

    onSave(newLog);
    setExerciseName('');
    setDuration('');
    setDistance('');
    setSpeed('');
    setCalories('');
    setNotes('');
    setShowAdd(false);
  };

  const cardioDays = logs.map(l => l.date.split('T')[0]);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#34A853] mb-1">
            <Activity size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Endurance</span>
          </div>
          <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Cardio Log</h2>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-12 h-12 rounded-2xl bg-[#34A853] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Plus size={28} className={`transition-transform duration-300 ${showAdd ? 'rotate-45' : ''}`} />
        </button>
      </header>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <CalendarIcon size={16} className="text-[var(--outline)]" />
          <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Activity Calendar</h3>
        </div>
        <Calendar gymDays={cardioDays} onToggleDay={() => {}} history={[]} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Zap size={16} className="text-[var(--outline)]" />
          <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Saved Routines</h3>
        </div>
        <div className="grid gap-4">
          {routines.map(routine => (
            <CardioRoutineCard key={routine.id} routine={routine} onStart={onStartRoutine} />
          ))}
          {customRoutines.map(routine => (
            <CardioRoutineCard key={routine.id} routine={routine} onStart={onStartRoutine} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="m3-card p-6 border border-[var(--outline)]/10 space-y-6">
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Quick Log</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Activity Name</label>
                  <input 
                    type="text" 
                    value={exerciseName}
                    onChange={e => setExerciseName(e.target.value)}
                    placeholder="e.g. Morning Run"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#34A853]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Duration (min)</label>
                  <input 
                    type="number" 
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="30"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#34A853]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Distance (km)</label>
                  <input 
                    type="number" 
                    value={distance}
                    onChange={e => setDistance(e.target.value)}
                    placeholder="5.0"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#34A853]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Speed (km/h)</label>
                  <input 
                    type="number" 
                    value={speed}
                    onChange={e => setSpeed(e.target.value)}
                    placeholder="10"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#34A853]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Calories</label>
                  <input 
                    type="number" 
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    placeholder="300"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#34A853]/20"
                  />
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="w-full bg-[#34A853] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-all shadow-md"
              >
                Save Activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History size={16} className="text-[var(--outline)]" />
          <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Activity History</h3>
        </div>
        
        {logs.length === 0 ? (
          <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
            <p className="text-[var(--outline)] font-bold">No cardio activities logged yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="m3-card p-4 border border-[var(--outline)]/10 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface-container)] flex items-center justify-center text-[#34A853]">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">{log.exerciseName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--outline)]">
                        <Clock size={10} />
                        {Math.round(log.duration / 60)}m
                      </div>
                      {log.distance && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--outline)]">
                          <MapPin size={10} />
                          {log.distance}km
                        </div>
                      )}
                      {log.calories && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--outline)]">
                          <Zap size={10} />
                          {log.calories}cal
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="text-[10px] font-bold text-[var(--outline)] uppercase">
                      {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(log.id)}
                    className="p-2 text-[var(--outline)] hover:text-[#EA4335] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
