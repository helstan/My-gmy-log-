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
      return shuffled.slice(0, group.count).map(name => {
        const isCardio = group.name === 'Cardio';
        return {
          id: Math.random().toString(36).substr(2, 9),
          name,
          muscleGroup: group.name as any,
          isLbs: false,
          sets: [isCardio 
            ? { id: Math.random().toString(36).substr(2, 9), duration: 0, distance: 0, intensity: 5 }
            : { id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, rpe: 0, isLbs: false }
          ],
          targetTime: 120,
          actualTime: 0,
          isCompleted: false
        };
      });
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
        const isCardio = ex.muscleGroup === 'Cardio';
        return {
          ...ex,
          sets: [...ex.sets, isCardio 
            ? { 
                id: Math.random().toString(36).substr(2, 9), 
                duration: lastSet.duration, 
                distance: lastSet.distance, 
                intensity: lastSet.intensity 
              }
            : { 
                id: Math.random().toString(36).substr(2, 9), 
                weight: lastSet.weight, 
                reps: lastSet.reps, 
                rpe: lastSet.rpe, 
                isLbs: ex.isLbs 
              }
          ]
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
    const isCardio = muscleGroup === 'Cardio';
    const newEx: ActiveExercise = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      muscleGroup,
      isLbs: false,
      sets: [isCardio 
        ? { id: Math.random().toString(36).substr(2, 9), duration: 0, distance: 0, intensity: 5 }
        : { id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, rpe: 0, isLbs: false }
      ],
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
    <div className="fixed inset-0 z-50 bg-[var(--bg)] overflow-y-auto pb-24 text-[var(--text)] transition-colors duration-300">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--outline)]/10 p-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors text-[var(--outline)]">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">Session Active</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">{formatTime(elapsed)}</span>
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className={`p-1.5 rounded-lg transition-all ${isPaused ? 'bg-[var(--energy)] text-white' : 'bg-[var(--surface-container)] text-[var(--outline)]'}`}
            >
              {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            </button>
          </div>
        </div>
        <button 
          onClick={() => onFinish(exercises, Math.floor(elapsed / 60), notes, photo)}
          className="bg-[var(--primary)] text-[var(--on-primary)] px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95 shadow-md"
        >
          Finish
        </button>
      </div>

      <div className="max-w-[520px] mx-auto p-5 space-y-6">
        {/* Rest Timer */}
        <div className="m3-card relative overflow-hidden border border-[var(--outline)]/10">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2 text-[var(--outline)]">
              <Timer size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Rest Timer</span>
            </div>
            {restTimer !== null && (
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold tracking-tight ${restTimer <= 10 ? 'text-[var(--passion)] animate-pulse' : 'text-[var(--text)]'}`}>
                  {formatTime(restTimer)}
                </span>
                <button onClick={() => setRestTimer(null)} className="text-xs font-bold text-[var(--primary)] px-2 py-1">Skip</button>
              </div>
            )}
          </div>
          
          {restTimer !== null && (
            <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden mb-6 relative z-10">
              <motion.div 
                className={`h-full ${restTimer <= 10 ? 'bg-[var(--passion)]' : 'bg-[var(--primary)]'}`}
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
                className="flex-shrink-0 bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--text)] px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 border border-[var(--outline)]/10"
              >
                {s < 60 ? `${s}s` : `${s/60}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Photo Upload */}
        <div className="m3-card relative overflow-hidden border border-[var(--outline)]/10">
          <div className="flex items-center gap-2 text-[var(--passion)] mb-4">
            <Camera size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Progress Photo</span>
          </div>

          <AnimatePresence mode="wait">
            {photo ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl overflow-hidden aspect-video group"
              >
                <img src={photo} alt="Progress" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setPhoto(undefined)}
                    className="bg-white text-[var(--passion)] p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
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
                  border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                  ${isDragging ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--outline)]/20 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container)]'}
                `}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)]">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-[var(--text)]">Tap to add photo</p>
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
              <div key={ex.id} className={`m3-card overflow-hidden transition-all border border-[var(--outline)]/10 ${ex.isCompleted ? 'opacity-60 bg-[var(--surface-container)]' : 'bg-[var(--surface)]'}`}>
                <div className="p-4 border-b border-[var(--outline)]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveExercise(exIdx, 'up')} className="p-1 hover:text-[var(--primary)] transition-colors"><ChevronUp size={16} /></button>
                      <button onClick={() => moveExercise(exIdx, 'down')} className="p-1 hover:text-[var(--primary)] transition-colors"><ChevronDown size={16} /></button>
                    </div>
                    <button 
                      onClick={() => toggleComplete(ex.id)}
                      className={`p-1 rounded-lg transition-colors ${ex.isCompleted ? 'text-[var(--success)]' : 'text-[var(--outline)]/30 hover:text-[var(--outline)]'}`}
                    >
                      {ex.isCompleted ? <CheckSquare size={28} /> : <Square size={28} />}
                    </button>
                    <div>
                      <h4 className={`text-base font-bold tracking-tight ${ex.isCompleted ? 'text-[var(--outline)] line-through' : 'text-[var(--text)]'}`}>{ex.name}</h4>
                      <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">{ex.muscleGroup}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!ex.isCompleted && (
                      <button 
                        onClick={() => activeExerciseId === ex.id ? setActiveExerciseId(null) : startExerciseTimer(ex.id)}
                        className={`p-2 rounded-xl transition-all ${activeExerciseId === ex.id ? 'bg-[var(--passion)] text-white' : 'bg-[var(--surface-container)] text-[var(--outline)]'}`}
                      >
                        <Clock size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => toggleUnit(ex.id)}
                      className="text-[10px] font-bold bg-[var(--surface-container)] px-2.5 py-1.5 rounded-lg text-[var(--text)] border border-[var(--outline)]/10"
                    >
                      {ex.isLbs ? 'LBS' : 'KG'}
                    </button>
                    <button onClick={() => removeExercise(ex.id)} className="p-2 hover:bg-[var(--passion)]/10 rounded-full transition-colors text-[var(--outline)]/30 hover:text-[var(--passion)]">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Time Tracking Display */}
                  <div className="flex items-center justify-between mb-5 bg-[var(--surface-container)] p-3 rounded-2xl border border-[var(--outline)]/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Target</span>
                      <span className="text-sm font-bold text-[var(--text)]">{formatTime(ex.targetTime || 0)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Actual</span>
                      <span className={`text-sm font-bold ${isTargetExceeded ? 'text-[var(--passion)]' : 'text-[var(--primary)]'}`}>
                        {formatTime(ex.actualTime || 0)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Status</span>
                      {isTargetExceeded ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--passion)] uppercase">
                          <AlertCircle size={10} /> Over
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[var(--success)] uppercase">On Track</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {ex.muscleGroup === 'Cardio' ? (
                      <>
                        <div className="grid grid-cols-5 gap-2 text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider px-2">
                          <div className="col-span-1">Set</div>
                          <div className="col-span-1">Min</div>
                          <div className="col-span-1">Km</div>
                          <div className="col-span-1">Int</div>
                          <div className="col-span-1 text-right">Cal</div>
                        </div>
                        
                        {ex.sets.map((set, setIdx) => (
                          <div key={set.id} className="grid grid-cols-5 gap-2 items-center px-1">
                            <div className="text-sm font-bold text-[var(--outline)]">{setIdx + 1}</div>
                            <div>
                              <input 
                                type="number" 
                                inputMode="decimal"
                                value={set.duration ? (set.duration / 60).toFixed(1) : ''} 
                                onChange={e => updateSet(ex.id, set.id, 'duration', (parseFloat(e.target.value) || 0) * 60)}
                                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                disabled={ex.isCompleted}
                              />
                            </div>
                            <div>
                              <input 
                                type="number" 
                                inputMode="decimal"
                                value={set.distance || ''} 
                                onChange={e => updateSet(ex.id, set.id, 'distance', parseFloat(e.target.value) || 0)}
                                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                disabled={ex.isCompleted}
                              />
                            </div>
                            <div>
                              <input 
                                type="number" 
                                inputMode="numeric"
                                value={set.intensity || ''} 
                                onChange={e => updateSet(ex.id, set.id, 'intensity', parseInt(e.target.value) || 0)}
                                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                disabled={ex.isCompleted}
                              />
                            </div>
                            <div className="text-right">
                              <input 
                                type="number" 
                                inputMode="numeric"
                                value={set.calories || ''} 
                                onChange={e => updateSet(ex.id, set.id, 'calories', parseInt(e.target.value) || 0)}
                                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 text-right"
                                disabled={ex.isCompleted}
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-5 gap-2 text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider px-2">
                          <div className="col-span-1">Set</div>
                          <div className="col-span-1">Weight</div>
                          <div className="col-span-1">Reps</div>
                          <div className="col-span-1">RPE</div>
                          <div className="col-span-1 text-right">Vol</div>
                        </div>
                        
                        {ex.sets.map((set, setIdx) => {
                          const volume = (set.weight || 0) * (set.reps || 0);
                          const hasPR = isPR(ex, set);
                          return (
                            <div key={set.id} className="grid grid-cols-5 gap-2 items-center px-1">
                              <div className="text-sm font-bold text-[var(--outline)]">{setIdx + 1}</div>
                              <div>
                                <input 
                                  type="number" 
                                  inputMode="decimal"
                                  value={set.weight || ''} 
                                  onChange={e => updateSet(ex.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                  disabled={ex.isCompleted}
                                />
                              </div>
                              <div>
                                <input 
                                  type="number" 
                                  inputMode="numeric"
                                  value={set.reps || ''} 
                                  onChange={e => updateSet(ex.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                                  className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                  disabled={ex.isCompleted}
                                />
                              </div>
                              <div>
                                <input 
                                  type="number" 
                                  inputMode="decimal"
                                  value={set.rpe || ''} 
                                  onChange={e => updateSet(ex.id, set.id, 'rpe', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-2 py-2.5 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                  disabled={ex.isCompleted}
                                />
                              </div>
                              <div className="text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-sm font-bold text-[var(--text)]">{volume}</span>
                                  {hasPR && (
                                    <span className="flex items-center gap-0.5 text-[8px] font-bold text-[var(--energy)] uppercase">
                                      <Trophy size={8} /> PR
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  {!ex.isCompleted && (
                    <button 
                      onClick={() => addSet(ex.id)}
                      className="w-full mt-6 py-3 bg-[var(--surface-container)] rounded-2xl text-[var(--text)] transition-all flex items-center justify-center gap-2 text-xs font-bold active:scale-95 border border-[var(--outline)]/10"
                    >
                      <Plus size={16} /> Add Set
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
          className="w-full py-4 bg-[var(--surface)] border-2 border-dashed border-[var(--outline)]/20 rounded-[28px] text-[var(--outline)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all flex items-center justify-center gap-2 font-bold text-sm active:scale-95"
        >
          <Plus size={20} /> Add Exercise
        </button>

        <div className="m3-card border border-[var(--outline)]/10">
          <label className="block text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider mb-2">Session Notes</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did it feel?"
            className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl p-4 text-sm font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 min-h-[120px]"
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowAddExercise(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--surface)] w-full max-w-sm rounded-[28px] p-6 shadow-2xl border border-[var(--outline)]/10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[var(--text)] tracking-tight mb-6">Add Exercise</h3>
              <div className="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar space-y-2">
                {allExercises.map(name => (
                  <button 
                    key={name}
                    onClick={() => addNewExercise(name, 'Custom')}
                    className="w-full text-left p-4 bg-[var(--surface-container)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] rounded-2xl text-sm font-bold transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowAddExercise(false)}
                className="w-full mt-6 py-3 bg-[var(--surface-container)] text-[var(--text)] rounded-2xl font-bold text-xs"
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
