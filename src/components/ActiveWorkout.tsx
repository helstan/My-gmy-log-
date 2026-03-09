import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, ChevronUp, ChevronDown, 
  RefreshCw, Plus, Trophy, CheckCircle2, Timer, Camera, Upload, Trash2,
  CheckSquare, Square, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { WorkoutDay, ActiveExercise, SetEntry, PersonalRecord } from '../types';
import { WORKOUT_SPLIT } from '../constants';

interface ActiveWorkoutProps {
  workout: WorkoutDay;
  onClose: () => void;
  onFinish: (exercises: ActiveExercise[], duration: number, notes: string, photo?: string) => void;
  prs: PersonalRecord[];
  customExercises: string[];
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ workout, onClose, onFinish, prs, customExercises }) => {
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  
  const [exercises, setExercises] = useState<ActiveExercise[]>(() => {
    return workout.groups.flatMap(group => {
      const shuffled = [...group.pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, group.count).map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name,
        muscleGroup: group.name,
        isLbs: false,
        sets: [{ id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, rpe: 0, isLbs: false }],
        targetTime: 120, // 2 minutes default
        actualTime: 0,
        isCompleted: false
      }));
    });
  });

  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [initialRest, setInitialRest] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Main session timer
  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, startTime]);

  // Per-exercise timer
  useEffect(() => {
    let interval: any;
    if (!isPaused && activeExerciseId) {
      interval = setInterval(() => {
        setExercises(prev => prev.map(ex => {
          if (ex.id === activeExerciseId && !ex.isCompleted) {
            return { ...ex, actualTime: (ex.actualTime || 0) + 1 };
          }
          return ex;
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, activeExerciseId]);

  // Rest timer
  useEffect(() => {
    let interval: any;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (restTimer === 0) {
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startRest = (seconds: number) => {
    setRestTimer(seconds);
    setInitialRest(seconds);
  };

  const addSet = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { 
            id: Math.random().toString(36).substr(2, 9), 
            weight: lastSet.weight, 
            reps: lastSet.reps, 
            rpe: lastSet.rpe, 
            isLbs: ex.isLbs 
          }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof SetEntry, value: any) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const swapExercise = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const group = workout.groups.find(g => g.name === ex.muscleGroup);
        if (group) {
          const currentIndex = group.pool.indexOf(ex.name);
          const nextIndex = (currentIndex + 1) % group.pool.length;
          return { ...ex, name: group.pool[nextIndex] };
        }
      }
      return ex;
    }));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newExercises = [...exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newExercises.length) {
      [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
      setExercises(newExercises);
    }
  };

  const removeExercise = (id: string) => {
    if (confirm('Remove this exercise?')) {
      setExercises(prev => prev.filter(ex => ex.id !== id));
      if (activeExerciseId === id) setActiveExerciseId(null);
    }
  };

  const addNewExercise = (name: string, muscleGroup: any) => {
    const newEx: ActiveExercise = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      muscleGroup,
      isLbs: false,
      sets: [{ id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, rpe: 0, isLbs: false }],
      targetTime: 120,
      actualTime: 0,
      isCompleted: false
    };
    setExercises(prev => [...prev, newEx]);
    setShowAddExercise(false);
  };

  const toggleUnit = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newIsLbs = !ex.isLbs;
        return {
          ...ex,
          isLbs: newIsLbs,
          sets: ex.sets.map(s => ({ ...s, isLbs: newIsLbs }))
        };
      }
      return ex;
    }));
  };

  const toggleComplete = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newState = !ex.isCompleted;
        if (newState) {
          // Start rest timer if completed
          startRest(60);
          if (activeExerciseId === exerciseId) setActiveExerciseId(null);
        }
        return { ...ex, isCompleted: newState };
      }
      return ex;
    }));
  };

  const startExerciseTimer = (exerciseId: string) => {
    setActiveExerciseId(exerciseId);
    setRestTimer(null); // Stop rest timer when starting an exercise
  };

  const getPR = (exerciseName: string) => prs.find(p => p.exerciseName === exerciseName);

  const isPR = (exercise: ActiveExercise, set: SetEntry) => {
    const pr = getPR(exercise.name);
    if (!pr) return false;
    const weightKg = exercise.isLbs ? set.weight * 0.453592 : set.weight;
    return weightKg * set.reps > pr.bestVolume;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const allExercises = Array.from(new Set([
    ...WORKOUT_SPLIT.flatMap(w => w.groups.flatMap(g => g.pool)),
    ...customExercises
  ])).sort();

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto pb-24">
      <div className="sticky top-0 z-10 bg-bg/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-passion">Session In Progress</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-black text-white tracking-tighter">{formatTime(elapsed)}</span>
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className={`p-2 rounded-xl transition-all ${isPaused ? 'bg-energy text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
            </button>
          </div>
        </div>
        <button 
          onClick={() => onFinish(exercises, Math.floor(elapsed / 60), notes, photo)}
          className="bg-gradient-to-r from-passion to-power hover:scale-105 text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-passion/30"
        >
          Finish
        </button>
      </div>

      <div className="max-w-[520px] mx-auto p-4 space-y-6">
        {/* Rest Timer */}
        <div className="bg-card rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-energy/10 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2 text-energy">
              <Timer size={20} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Rest & Recover</span>
            </div>
            {restTimer !== null && (
              <div className="flex items-center gap-4">
                <span className={`text-3xl font-mono font-black tracking-tighter ${restTimer <= 10 ? 'text-passion animate-pulse' : 'text-white'}`}>
                  {formatTime(restTimer)}
                </span>
                <button onClick={() => setRestTimer(null)} className="bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg text-slate-400 transition-colors">Skip</button>
              </div>
            )}
          </div>
          
          {restTimer !== null && (
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6 relative z-10">
              <motion.div 
                className={`h-full ${restTimer <= 10 ? 'bg-passion' : 'bg-gradient-to-r from-energy to-passion'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${(restTimer / initialRest) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 relative z-10">
            {[30, 60, 90, 120, 180].map(s => (
              <button 
                key={s}
                onClick={() => startRest(s)}
                className="flex-shrink-0 bg-slate-800 hover:bg-energy hover:text-white text-slate-400 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                {s < 60 ? `${s}s` : `${s/60}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Photo Upload */}
        <div className="bg-card rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-passion mb-4">
            <Camera size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Progress Photo</span>
          </div>

          <AnimatePresence mode="wait">
            {photo ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative rounded-2xl overflow-hidden aspect-video group"
              >
                <img src={photo} alt="Progress" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setPhoto(undefined)}
                    className="bg-passion text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                  ${isDragging ? 'border-passion bg-passion/10' : 'border-slate-800 hover:border-passion/50 hover:bg-white/5'}
                `}
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300">Drop your photo here</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">or click to browse</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((ex, exIdx) => {
            const isTargetExceeded = (ex.actualTime || 0) > (ex.targetTime || 0);
            return (
              <div key={ex.id} className={`bg-card rounded-2xl overflow-hidden border transition-all ${ex.isCompleted ? 'opacity-60 border-emerald-500/30' : 'border-white/5 shadow-lg'}`}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveExercise(exIdx, 'up')} className="p-0.5 hover:text-indigo-400 transition-colors"><ChevronUp size={14} /></button>
                      <button onClick={() => moveExercise(exIdx, 'down')} className="p-0.5 hover:text-indigo-400 transition-colors"><ChevronDown size={14} /></button>
                    </div>
                    <button 
                      onClick={() => toggleComplete(ex.id)}
                      className={`p-1 rounded-lg transition-colors ${ex.isCompleted ? 'text-emerald-500' : 'text-slate-600 hover:text-white'}`}
                    >
                      {ex.isCompleted ? <CheckSquare size={24} /> : <Square size={24} />}
                    </button>
                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${ex.isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>{ex.name}</h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ex.muscleGroup}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!ex.isCompleted && (
                      <button 
                        onClick={() => activeExerciseId === ex.id ? setActiveExerciseId(null) : startExerciseTimer(ex.id)}
                        className={`p-2 rounded-xl transition-all ${activeExerciseId === ex.id ? 'bg-passion text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => toggleUnit(ex.id)}
                      className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded-md text-slate-400 hover:text-white transition-colors"
                    >
                      {ex.isLbs ? 'LBS' : 'KG'}
                    </button>
                    <button onClick={() => removeExercise(ex.id)} className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-slate-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Time Tracking Display */}
                  <div className="flex items-center justify-between mb-4 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Target</span>
                      <span className="text-sm font-mono font-bold text-slate-300">{formatTime(ex.targetTime || 0)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Actual</span>
                      <span className={`text-sm font-mono font-bold ${isTargetExceeded ? 'text-passion' : 'text-energy'}`}>
                        {formatTime(ex.actualTime || 0)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Status</span>
                      {isTargetExceeded ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-passion uppercase">
                          <AlertCircle size={10} /> Over
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-energy uppercase">On Track</span>
                      )}
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 font-bold uppercase tracking-wider">
                        <th className="pb-3 w-10">Set</th>
                        <th className="pb-3">Weight</th>
                        <th className="pb-3">Reps</th>
                        <th className="pb-3">RPE</th>
                        <th className="pb-3 text-right">Vol</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {ex.sets.map((set, setIdx) => {
                        const volume = set.weight * set.reps;
                        const hasPR = isPR(ex, set);
                        return (
                          <tr key={set.id} className="group">
                            <td className="py-2 text-slate-400 font-mono">{setIdx + 1}</td>
                            <td className="py-2">
                              <div className="flex flex-col">
                                <input 
                                  type="number" 
                                  value={set.weight || ''} 
                                  onChange={e => updateSet(ex.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                                  className="w-16 bg-input border border-white/5 rounded-lg px-2 py-1.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  disabled={ex.isCompleted}
                                />
                                {ex.isLbs && set.weight > 0 && (
                                  <span className="text-[9px] text-slate-500 mt-0.5">≈ {(set.weight * 0.453592).toFixed(1)}kg</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2">
                              <input 
                                type="number" 
                                value={set.reps || ''} 
                                onChange={e => updateSet(ex.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                                className="w-12 bg-input border border-white/5 rounded-lg px-2 py-1.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                disabled={ex.isCompleted}
                              />
                            </td>
                            <td className="py-2">
                              <input 
                                type="number" 
                                value={set.rpe || ''} 
                                onChange={e => updateSet(ex.id, set.id, 'rpe', parseFloat(e.target.value) || 0)}
                                className="w-12 bg-input border border-white/5 rounded-lg px-2 py-1.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                disabled={ex.isCompleted}
                              />
                            </td>
                            <td className="py-2 text-right">
                              <div className="flex flex-col items-end">
                                <span className="font-mono text-slate-300">{volume}</span>
                                {hasPR && (
                                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-yellow-500 uppercase mt-0.5">
                                    <Trophy size={8} /> PR
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {!ex.isCompleted && (
                    <button 
                      onClick={() => addSet(ex.id)}
                      className="w-full mt-4 py-2 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                    >
                      <Plus size={14} /> Add Set
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Exercise Button */}
        <button 
          onClick={() => setShowAddExercise(true)}
          className="w-full py-4 bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl text-slate-400 hover:text-white hover:border-passion/50 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
        >
          <Plus size={20} /> Add Exercise
        </button>

        <div className="bg-card rounded-2xl p-4 border border-white/5 shadow-lg">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Session Notes</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did it feel? Any injuries?"
            className="w-full bg-input border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
          />
        </div>
      </div>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {showAddExercise && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowAddExercise(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Add Exercise</h3>
              <div className="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar space-y-2">
                {allExercises.map(name => (
                  <button 
                    key={name}
                    onClick={() => addNewExercise(name, 'Custom')}
                    className="w-full text-left p-4 bg-slate-800 hover:bg-passion hover:text-white rounded-2xl text-sm font-bold transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowAddExercise(false)}
                className="w-full mt-6 py-3 bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
