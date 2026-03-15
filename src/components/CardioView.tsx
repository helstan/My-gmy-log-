import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Plus, History, Calendar as CalendarIcon, Clock, Zap, MapPin, Trash2, ChevronRight } from 'lucide-react';
import { CardioLog } from '../types';
import { Calendar } from './Calendar';

interface CardioViewProps {
  logs: CardioLog[];
  onSave: (log: CardioLog) => void;
  onDelete: (id: string) => void;
}

export const CardioView: React.FC<CardioViewProps> = ({ logs, onSave, onDelete }) => {
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

  const cardioTypes = [
    { name: 'Swimming', icon: '🏊' },
    { name: 'Jogging', icon: '🏃' },
    { name: 'Zumba', icon: '💃' },
    { name: 'Pilates', icon: '🧘' },
    { name: 'Cycling', icon: '🚴' }
  ];

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

      <Calendar gymDays={cardioDays} onToggleDay={() => {}} history={[]} />

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="m3-card p-6 border border-[var(--outline)]/10 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Quick Select</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {cardioTypes.map(type => (
                    <button
                      key={type.name}
                      onClick={() => setExerciseName(type.name)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        exerciseName === type.name 
                          ? 'bg-[#34A853] text-white border-[#34A853]' 
                          : 'bg-[var(--surface-container)] text-[var(--text)] border-[var(--outline)]/10'
                      }`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

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
