import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, History, Trophy, Plus, Dumbbell, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, WorkoutDay, CompletedWorkout, PersonalRecord, ActiveExercise } from './types';
import { WORKOUT_SPLIT } from './constants';
import { getStorageData, saveStorageData } from './utils';
import { Calendar } from './components/Calendar';
import { WorkoutCard } from './components/WorkoutCard';
import { ActiveWorkout } from './components/ActiveWorkout';
import { HistoryView } from './components/HistoryView';
import { PRView } from './components/PRView';
import { ProgressCharts } from './components/ProgressCharts';
import { CreateWorkoutModal } from './components/CreateWorkoutModal';

export default function App() {
  const [view, setView] = useState<View>('days');
  const [history, setHistory] = useState<CompletedWorkout[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [gymDays, setGymDays] = useState<string[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutDay[]>([]);
  const [customExercises, setCustomExercises] = useState<string[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');

  useEffect(() => {
    const data = getStorageData();
    setHistory(data.history);
    setPrs(data.prs);
    setGymDays(data.gymDays);
    setCustomWorkouts(data.customWorkouts);
    setCustomExercises(data.customExercises);
  }, []);

  const handleToggleDay = (date: string) => {
    const newGymDays = gymDays.includes(date)
      ? gymDays.filter(d => d !== date)
      : [...gymDays, date];
    setGymDays(newGymDays);
    saveStorageData(history, prs, newGymDays, customWorkouts, customExercises);
  };

  const handleStartWorkout = (workout: WorkoutDay) => {
    setActiveWorkout(workout);
    setView('active');
  };

  const handleFinishWorkout = (exercises: ActiveExercise[], duration: number, notes: string, photo?: string) => {
    const newWorkout: CompletedWorkout = {
      id: Math.random().toString(36).substr(2, 9),
      workoutDayId: activeWorkout!.id as any,
      workoutName: activeWorkout!.name,
      date: new Date().toISOString(),
      duration,
      exercises,
      notes,
      photo,
    };

    const newHistory = [newWorkout, ...history];
    const todayStr = new Date().toISOString().split('T')[0];
    const newGymDays = gymDays.includes(todayStr) ? gymDays : [...gymDays, todayStr];

    // Update PRs
    let newPrs = [...prs];
    exercises.forEach(ex => {
      const maxVolume = ex.sets.reduce((max, set) => {
        const vol = set.weight * set.reps;
        const volKg = ex.isLbs ? vol * 0.453592 : vol;
        return Math.max(max, volKg);
      }, 0);

      const existingPrIdx = newPrs.findIndex(p => p.exerciseName === ex.name);
      if (existingPrIdx === -1) {
        newPrs.push({ exerciseName: ex.name, bestVolume: maxVolume, date: newWorkout.date });
      } else if (maxVolume > newPrs[existingPrIdx].bestVolume) {
        newPrs[existingPrIdx] = { exerciseName: ex.name, bestVolume: maxVolume, date: newWorkout.date };
      }
    });
    newPrs.sort((a, b) => b.bestVolume - a.bestVolume);

    setHistory(newHistory);
    setPrs(newPrs);
    setGymDays(newGymDays);
    saveStorageData(newHistory, newPrs, newGymDays, customWorkouts, customExercises);
    setActiveWorkout(null);
    setView('history');
  };

  const handleAddCustomWorkout = (workout: WorkoutDay) => {
    const newCustom = [...customWorkouts, workout];
    setCustomWorkouts(newCustom);
    saveStorageData(history, prs, gymDays, newCustom, customExercises);
  };

  const handleAddCustomExercise = () => {
    if (!newExerciseName) return;
    const newCustom = [...customExercises, newExerciseName];
    setCustomExercises(newCustom);
    saveStorageData(history, prs, gymDays, customWorkouts, newCustom);
    setNewExerciseName('');
  };

  const allAvailableExercises = useMemo(() => {
    const base = Array.from(new Set(WORKOUT_SPLIT.flatMap(w => w.groups.flatMap(g => g.pool))));
    return [...base, ...customExercises].sort();
  }, [customExercises]);

  const NavItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`flex flex-col items-center gap-1.5 transition-all relative px-4 py-2 rounded-2xl ${view === id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {view === id && (
        <motion.div 
          layoutId="nav-bg" 
          className="absolute inset-0 bg-gradient-to-br from-passion/20 to-power/20 border border-white/10 rounded-2xl -z-10" 
        />
      )}
      <Icon size={22} strokeWidth={view === id ? 2.5 : 2} className={view === id ? 'text-passion' : ''} />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      {view === id && (
        <motion.div layoutId="nav-indicator" className="h-1 w-4 rounded-full bg-passion mt-0.5 shadow-[0_0_8px_rgba(255,46,99,0.8)]" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-passion to-power flex items-center justify-center shadow-lg shadow-passion/30 animate-pulse-glow">
            <Dumbbell size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Helstan's Log</h1>
            <span className="text-[9px] font-bold text-passion uppercase tracking-widest">Passion · Power · Progress</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Streak</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-mono font-black text-energy">12</span>
              <div className="w-2 h-2 rounded-full bg-energy animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[520px] w-full mx-auto p-6">
        <AnimatePresence mode="wait">
          {view === 'days' && (
            <motion.div
              key="days"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <Calendar gymDays={gymDays} onToggleDay={handleToggleDay} history={history} />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Workout Routines</h2>
                  <button 
                    onClick={() => setShowCreateWorkout(true)}
                    className="flex items-center gap-2 text-[10px] font-black text-passion uppercase tracking-widest bg-passion/10 px-3 py-1.5 rounded-xl border border-passion/20 hover:scale-105 transition-all"
                  >
                    <Plus size={14} /> Create New
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {WORKOUT_SPLIT.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} onStart={handleStartWorkout} />
                    ))}
                    {customWorkouts.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} onStart={handleStartWorkout} />
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Custom Exercises</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newExerciseName}
                      onChange={e => setNewExerciseName(e.target.value)}
                      placeholder="Exercise Name"
                      className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none"
                    />
                    <button 
                      onClick={handleAddCustomExercise}
                      className="bg-energy text-bg px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {customExercises.map(ex => (
                      <span key={ex} className="bg-slate-800 text-slate-400 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/5">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Workout History</h2>
              <HistoryView history={history} />
            </motion.div>
          )}

          {view === 'prs' && (
            <motion.div
              key="prs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PRView prs={prs} />
            </motion.div>
          )}

          {view === 'charts' && (
            <motion.div
              key="charts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProgressCharts history={history} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Active Workout Overlay */}
      {view === 'active' && activeWorkout && (
        <ActiveWorkout 
          workout={activeWorkout} 
          onClose={() => {
            if (confirm('Are you sure you want to cancel this workout? Progress will be lost.')) {
              setActiveWorkout(null);
              setView('days');
            }
          }}
          onFinish={handleFinishWorkout}
          prs={prs}
          customExercises={customExercises}
        />
      )}

      {/* Bottom Navigation */}
      {view !== 'active' && (
        <nav className="sticky bottom-0 z-20 bg-bg/80 backdrop-blur-md border-t border-white/5 px-8 py-4 flex items-center justify-between shadow-2xl">
          <NavItem id="days" icon={CalendarIcon} label="Days" />
          <NavItem id="history" icon={History} label="History" />
          <NavItem id="prs" icon={Trophy} label="PRs" />
          <NavItem id="charts" icon={TrendingUp} label="Progress" />
        </nav>
      )}

      {/* Create Workout Modal */}
      <AnimatePresence>
        {showCreateWorkout && (
          <CreateWorkoutModal 
            onClose={() => setShowCreateWorkout(false)}
            onSave={handleAddCustomWorkout}
            availableExercises={allAvailableExercises}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
