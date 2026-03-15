import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  History, 
  Trophy, 
  Plus, 
  Dumbbell, 
  TrendingUp, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  Flame, 
  Zap,
  BarChart3,
  Scale,
  Activity,
  Utensils,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, WorkoutDay, CompletedWorkout, PersonalRecord, ActiveExercise, BodyMetrics as BodyMetricsType, MealLog, CardioLog } from './types';
import { WORKOUT_SPLIT } from './constants';
import { getStorageData, saveStorageData } from './utils';
import { Calendar } from './components/Calendar';
import { WorkoutCard } from './components/WorkoutCard';
import { ActiveWorkout } from './components/ActiveWorkout';
import { HistoryView } from './components/HistoryView';
import { PRView } from './components/PRView';
import { ProgressCharts } from './components/ProgressCharts';
import { BodyMetrics } from './components/BodyMetrics';
import { CreateWorkoutModal } from './components/CreateWorkoutModal';
import { HomeView } from './components/HomeView';
import { CardioView } from './components/CardioView';
import { MealTracker } from './components/MealTracker';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [history, setHistory] = useState<CompletedWorkout[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [gymDays, setGymDays] = useState<string[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutDay[]>([]);
  const [customExercises, setCustomExercises] = useState<string[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricsType[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gym_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const data = getStorageData();
    setHistory(data.history);
    setPrs(data.prs);
    setGymDays(data.gymDays);
    setCustomWorkouts(data.customWorkouts);
    setCustomExercises(data.customExercises);
    setBodyMetrics(data.bodyMetrics || []);
    setMealLogs(data.mealLogs || []);
    setCardioLogs(data.cardioLogs || []);
    
    // Calculate XP and Level based on history
    const totalXp = data.history.length * 100;
    setXp(totalXp % 1000);
    setLevel(Math.floor(totalXp / 1000) + 1);
    
    // Simple streak calculation
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const hasToday = data.gymDays.includes(today);
    const hasYesterday = data.gymDays.includes(yesterday);
    setStreak(hasToday || hasYesterday ? 12 : 0);
  }, []);

  useEffect(() => {
    localStorage.setItem('gym_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDay = (date: string) => {
    const newGymDays = gymDays.includes(date)
      ? gymDays.filter(d => d !== date)
      : [...gymDays, date];
    setGymDays(newGymDays);
    saveStorageData(history, prs, newGymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs);
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
    saveStorageData(newHistory, newPrs, newGymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs);
    setActiveWorkout(null);
    setView('history');
  };

  const handleAddCustomWorkout = (workout: WorkoutDay) => {
    const newCustom = [...customWorkouts, workout];
    setCustomWorkouts(newCustom);
    saveStorageData(history, prs, gymDays, newCustom, customExercises, bodyMetrics, mealLogs, cardioLogs);
  };

  const handleAddCustomExercise = () => {
    if (!newExerciseName) return;
    const newCustom = [...customExercises, newExerciseName];
    setCustomExercises(newCustom);
    saveStorageData(history, prs, gymDays, customWorkouts, newCustom, bodyMetrics, mealLogs, cardioLogs);
    setNewExerciseName('');
  };

  const handleSaveMetrics = (m: BodyMetricsType) => {
    const newMetrics = [m, ...bodyMetrics];
    setBodyMetrics(newMetrics);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, newMetrics, mealLogs, cardioLogs);
  };

  const handleDeleteMetrics = (id: string) => {
    const newMetrics = bodyMetrics.filter(m => m.id !== id);
    setBodyMetrics(newMetrics);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, newMetrics, mealLogs, cardioLogs);
  };

  const handleSaveMeal = (log: MealLog) => {
    const newLogs = [log, ...mealLogs];
    setMealLogs(newLogs);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, newLogs, cardioLogs);
  };

  const handleDeleteMeal = (id: string) => {
    const newLogs = mealLogs.filter(l => l.id !== id);
    setMealLogs(newLogs);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, newLogs, cardioLogs);
  };

  const handleSaveCardio = (log: CardioLog) => {
    const newLogs = [log, ...cardioLogs];
    setCardioLogs(newLogs);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, newLogs);
  };

  const handleDeleteCardio = (id: string) => {
    const newLogs = cardioLogs.filter(l => l.id !== id);
    setCardioLogs(newLogs);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, newLogs);
  };

  const allAvailableExercises = useMemo(() => {
    const base = Array.from(new Set(WORKOUT_SPLIT.flatMap(w => w.groups.flatMap(g => g.pool))));
    return [...base, ...customExercises].sort();
  }, [customExercises]);

  const NavItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className="flex flex-col items-center gap-1 relative px-4 py-1 group tap-highlight-none"
    >
      <div className="relative">
        {view === id && (
          <motion.div 
            layoutId="nav-pill"
            className="absolute inset-x-[-12px] inset-y-[-4px] bg-[var(--secondary-container)] rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <div className={`transition-colors duration-200 ${view === id ? 'text-[var(--on-secondary-container)]' : 'text-[var(--outline)]'}`}>
          <Icon size={24} strokeWidth={view === id ? 2.5 : 2} />
        </div>
      </div>
      <span className={`text-[10px] font-bold transition-colors duration-200 ${view === id ? 'text-[var(--on-secondary-container)]' : 'text-[var(--outline)]'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col text-[var(--text)] transition-colors duration-300">
      {/* Google Style Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--outline)]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md">
            <Dumbbell size={22} className="text-[var(--on-primary)]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Gym Log</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Level {level}</span>
              <div className="w-20 h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / 1000) * 100}%` }}
                  className="h-full bg-[var(--primary)]"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-[var(--surface-container)] text-[var(--text)] active:scale-95 transition-all"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="flex items-center gap-3 bg-[var(--surface-container)] px-3 py-1.5 rounded-full border border-[var(--outline)]/10">
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-[var(--energy)]" />
              <span className="text-xs font-bold">{streak}</span>
            </div>
            <div className="w-px h-3 bg-[var(--outline)]/20" />
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-[var(--power)]" />
              <span className="text-xs font-bold">{level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[520px] w-full mx-auto p-5 pb-32">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HomeView onSelectOption={setView} userName="Helstan" />
            </motion.div>
          )}

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
                  <h2 className="text-xs font-bold text-[var(--outline)] uppercase tracking-wider">Workout Routines</h2>
                  <button 
                    onClick={() => setShowCreateWorkout(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] bg-[var(--secondary-container)] px-4 py-2 rounded-full transition-all active:scale-95"
                  >
                    <Plus size={16} /> New
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {WORKOUT_SPLIT.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} onStart={handleStartWorkout} />
                    ))}
                    {customWorkouts.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} onStart={handleStartWorkout} />
                    ))}
                  </div>
                </div>

                <div className="m3-card space-y-4">
                  <h3 className="text-xs font-bold text-[var(--outline)] uppercase tracking-wider">Custom Exercises</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newExerciseName}
                      onChange={e => setNewExerciseName(e.target.value)}
                      placeholder="Exercise Name"
                      className="flex-1 bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                    <button 
                      onClick={handleAddCustomExercise}
                      className="bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {customExercises.map(ex => (
                      <span key={ex} className="bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--outline)]/20">
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
              <h2 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-[0.2em] mb-6">Workout History</h2>
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

          {view === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BodyMetrics 
                metrics={bodyMetrics} 
                onSave={handleSaveMetrics} 
                onDelete={handleDeleteMetrics} 
              />
            </motion.div>
          )}

          {view === 'charts' && (
            <motion.div
              key="charts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProgressCharts history={history} bodyMetrics={bodyMetrics} />
            </motion.div>
          )}

          {view === 'cardio' && (
            <motion.div
              key="cardio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CardioView logs={cardioLogs} onSave={handleSaveCardio} onDelete={handleDeleteCardio} />
            </motion.div>
          )}

          {view === 'meals' && (
            <motion.div
              key="meals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MealTracker logs={mealLogs} onSave={handleSaveMeal} onDelete={handleDeleteMeal} />
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
        <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[var(--surface)]/90 backdrop-blur-xl border-t border-[var(--outline)]/10 px-6 py-3 pb-8 flex items-center justify-between">
          <NavItem id="home" icon={Home} label="Home" />
          <NavItem id="days" icon={CalendarIcon} label="Workout" />
          <NavItem id="cardio" icon={Activity} label="Cardio" />
          <NavItem id="meals" icon={Utensils} label="Meals" />
          <NavItem id="charts" icon={TrendingUp} label="Stats" />
        </nav>
      )}

      {/* Floating Action Button for Quick Start */}
      {view === 'days' && !activeWorkout && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateWorkout(true)}
          className="fixed bottom-28 right-6 w-14 h-14 bg-[var(--primary)] text-[var(--on-primary)] rounded-2xl shadow-xl flex items-center justify-center z-40"
        >
          <Plus size={28} />
        </motion.button>
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
