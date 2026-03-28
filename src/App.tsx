import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  History, 
  Trophy, 
  Plus, 
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
  Home,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { View, WorkoutDay, CompletedWorkout, PersonalRecord, ActiveExercise, BodyMetrics as BodyMetricsType, MealLog, CardioLog, DailyGoals, CardioWorkout, UserProfile } from './types';
import { WORKOUT_SPLIT, CARDIO_ROUTINES, XP_REWARDS } from './constants';
import { getStorageData, saveStorageData, clearStorageData, DEFAULT_GOALS, DEFAULT_USER_PROFILE } from './utils';
import { auth, onAuthStateChanged, signOut } from './firebase';
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
import { DailyProgress } from './components/DailyProgress';
import { GoalEditor } from './components/GoalEditor';
import { Sidebar } from './components/Sidebar';
import { Profile } from './components/Profile';
import { Tutorial } from './components/Tutorial';
import { ConnectView } from './components/ConnectView';
import { ProgressSlideDeck } from './components/ProgressSlideDeck';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [theme, setTheme] = useState<'light' | 'dark' | 'ocean' | 'red' | 'pink'>(() => {
    return (localStorage.getItem('gym_theme') as any) || 'dark';
  });
  const [workoutSplit, setWorkoutSplit] = useState<WorkoutDay[]>(() => {
    const saved = localStorage.getItem('workout_split_order');
    return saved ? JSON.parse(saved) : WORKOUT_SPLIT;
  });
  const [history, setHistory] = useState<CompletedWorkout[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [gymDays, setGymDays] = useState<string[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutDay[]>([]);
  const [customExercises, setCustomExercises] = useState<string[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricsType[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(DEFAULT_GOALS);
  const [customCardioWorkouts, setCustomCardioWorkouts] = useState<CardioWorkout[]>([]);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gym_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

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
    setActiveWorkout(data.activeWorkout || null);
    setActiveExercises(data.activeExercises || []);
    setDailyGoals(data.dailyGoals || DEFAULT_GOALS);
    setCustomCardioWorkouts(data.customCardioWorkouts || []);
    setUserProfile(data.userProfile || DEFAULT_USER_PROFILE);
    
    if (data.activeWorkout) {
      setView('active');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('gym_theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const moveWorkout = (id: string | number, direction: 'up' | 'down') => {
    const index = workoutSplit.findIndex(w => w.id === id);
    if (index === -1) return;
    const newSplit = [...workoutSplit];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSplit.length) return;
    [newSplit[index], newSplit[newIndex]] = [newSplit[newIndex], newSplit[index]];
    setWorkoutSplit(newSplit);
    localStorage.setItem('workout_split_order', JSON.stringify(newSplit));
  };

  const updateXP = (amount: number) => {
    setUserProfile(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      
      // Simple level up logic: 1000 XP per level
      while (newXP >= 1000) {
        newXP -= 1000;
        newLevel += 1;
        // Level up effect
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#3B82F6', '#10B981']
        });
      }

      const updated = { ...prev, xp: newXP, level: newLevel, mood: 'happy' as const };
      saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, updated);
      return updated;
    });
  };

  const handleSaveGoals = (goals: DailyGoals) => {
    setDailyGoals(goals);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, goals, customCardioWorkouts, userProfile);
    setShowGoalEditor(false);
  };

  const handleToggleDay = (date: string) => {
    const newGymDays = gymDays.includes(date)
      ? gymDays.filter(d => d !== date)
      : [...gymDays, date];
    setGymDays(newGymDays);
    saveStorageData(history, prs, newGymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleStartWorkout = (workout: WorkoutDay) => {
    setActiveWorkout(workout);
    setActiveExercises([]);
    setView('active');
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, workout, [], dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleActiveWorkoutUpdate = (exercises: ActiveExercise[]) => {
    setActiveExercises(exercises);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, activeWorkout, exercises, dailyGoals, customCardioWorkouts, userProfile);
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
    setActiveWorkout(null);
    setActiveExercises([]);
    
    // Award XP
    updateXP(XP_REWARDS.WORKOUT_COMPLETE);
    
    // Confetti for workout completion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    saveStorageData(newHistory, newPrs, newGymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, null, [], dailyGoals, customCardioWorkouts, userProfile);
    setView('history');
  };

  const handleAddCustomWorkout = (workout: WorkoutDay) => {
    const newCustom = [...customWorkouts, workout];
    setCustomWorkouts(newCustom);
    saveStorageData(history, prs, gymDays, newCustom, customExercises, bodyMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleAddCustomExercise = () => {
    if (!newExerciseName) return;
    const newCustom = [...customExercises, newExerciseName];
    setCustomExercises(newCustom);
    saveStorageData(history, prs, gymDays, customWorkouts, newCustom, bodyMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
    setNewExerciseName('');
  };

  const handleStartCardioRoutine = (routine: CardioWorkout) => {
    const newLog: CardioLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      exerciseName: routine.name,
      duration: routine.exercises.reduce((acc, ex) => acc + (ex.duration || 0), 0),
      calories: routine.exercises.reduce((acc, ex) => acc + (ex.calories || 0), 0),
      distance: routine.exercises.reduce((acc, ex) => acc + (ex.distance || 0), 0),
    };
    handleSaveCardio(newLog);
  };

  const handleSaveMetrics = (m: BodyMetricsType) => {
    const newMetrics = [m, ...bodyMetrics];
    setBodyMetrics(newMetrics);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, newMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleDeleteMetrics = (id: string) => {
    const newMetrics = bodyMetrics.filter(m => m.id !== id);
    setBodyMetrics(newMetrics);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, newMetrics, mealLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleSaveMeal = (log: MealLog) => {
    const newLogs = [log, ...mealLogs];
    setMealLogs(newLogs);
    updateXP(XP_REWARDS.LOG_MEAL);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, newLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleDeleteMeal = (id: string) => {
    const newLogs = mealLogs.filter(l => l.id !== id);
    setMealLogs(newLogs);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, newLogs, cardioLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleSaveCardio = (log: CardioLog) => {
    const newLogs = [log, ...cardioLogs];
    setCardioLogs(newLogs);
    updateXP(XP_REWARDS.CARDIO_COMPLETE);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, newLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
  };

  const handleClearLogs = () => {
    setHistory([]);
    setPrs([]);
    setBodyMetrics([]);
    setMealLogs([]);
    setCardioLogs([]);
    setActiveWorkout(null);
    setActiveExercises([]);
    saveStorageData([], [], gymDays, customWorkouts, customExercises, [], [], [], null, [], dailyGoals, customCardioWorkouts, userProfile);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EA4335', '#FBBC05', '#34A853', '#4285F4']
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Also reset local data as requested
      clearStorageData();
      window.location.reload(); // Simplest way to reset all state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteCardio = (id: string) => {
    const newLogs = cardioLogs.filter(l => l.id !== id);
    setCardioLogs(newLogs);
    saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, newLogs, activeWorkout, activeExercises, dailyGoals, customCardioWorkouts, userProfile);
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
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={view} 
        onNavigate={setView} 
        user={user}
        onLogout={handleLogout}
      />

      {/* Google Style Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--outline)]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-container)] text-[var(--outline)] active:scale-95 transition-all"
          >
            <Menu size={24} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-[var(--primary)]/20">
            <img 
              src="https://raw.githubusercontent.com/helstan/My-gmy-log-/main/ChatGPT%20Image%20Mar%2028%2C%202026%2C%2011_53_24%20PM.png" 
              alt="GymFlow Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">GymFlow</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Level {userProfile.level}</span>
              <div className="w-20 h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProfile.xp / 1000) * 100}%` }}
                  className="h-full bg-[var(--primary)]"
                />
              </div>
            </div>
          </div>
        </div>
        
          <div className="flex items-center gap-2">
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="bg-[var(--surface-container)] text-[var(--text)] text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 rounded-full border border-[var(--outline)]/10 focus:outline-none"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="ocean">Ocean</option>
              <option value="red">Red</option>
              <option value="pink">Pink</option>
            </select>
            <div className="flex items-center gap-3 bg-[var(--surface-container)] px-3 py-1.5 rounded-full border border-[var(--outline)]/10">
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-[var(--energy)]" />
              <span className="text-xs font-bold">{userProfile.streak}</span>
            </div>
            <div className="w-px h-3 bg-[var(--outline)]/20" />
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-[var(--power)]" />
              <span className="text-xs font-bold">{userProfile.level}</span>
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
              className="space-y-6"
            >
              <DailyProgress 
                goals={dailyGoals} 
                mealLogs={mealLogs} 
                cardioLogs={cardioLogs} 
                onEditGoals={() => setShowGoalEditor(true)}
              />
              <HomeView 
                onSelectOption={setView} 
                userProfile={userProfile}
                todayMeals={mealLogs.filter(l => l.date.split('T')[0] === new Date().toISOString().split('T')[0])}
                todayWorkouts={history.filter(l => l.date.split('T')[0] === new Date().toISOString().split('T')[0])}
                todayCardio={cardioLogs.filter(l => l.date.split('T')[0] === new Date().toISOString().split('T')[0])}
                workoutSplit={workoutSplit}
                onMoveWorkout={moveWorkout}
                onAddCustomWorkout={() => setShowCreateWorkout(true)}
              />
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
                    {workoutSplit.map(workout => (
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
              <ProgressCharts 
                history={history} 
                bodyMetrics={bodyMetrics} 
                cardioLogs={cardioLogs}
                mealLogs={mealLogs}
                goals={dailyGoals}
              />
            </motion.div>
          )}

          {view === 'cardio' && (
            <motion.div
              key="cardio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CardioView 
                logs={cardioLogs} 
                routines={CARDIO_ROUTINES}
                customRoutines={customCardioWorkouts}
                onSave={handleSaveCardio} 
                onDelete={handleDeleteCardio}
                onStartRoutine={handleStartCardioRoutine}
              />
            </motion.div>
          )}

          {view === 'meals' && (
            <motion.div
              key="meals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MealTracker 
                logs={mealLogs} 
                goals={dailyGoals}
                onSave={handleSaveMeal} 
                onDelete={handleDeleteMeal} 
                onUpdateGoals={(goals) => setDailyGoals(prev => ({ ...prev, ...goals }))}
              />
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Profile 
                user={user} 
                userProfile={userProfile} 
                onLogin={() => {}} 
                onLogout={handleLogout}
                onClearLogs={handleClearLogs}
                currentTheme={theme}
                onThemeChange={setTheme}
              />
            </motion.div>
          )}

          {view === 'tutorial' && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Tutorial />
            </motion.div>
          )}

          {view === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ConnectView />
            </motion.div>
          )}

          {view === 'progress_deck' && (
            <motion.div
              key="progress_deck"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProgressSlideDeck />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Active Workout Overlay */}
      {view === 'active' && activeWorkout && (
        <ActiveWorkout 
          workout={activeWorkout} 
          initialExercises={activeExercises}
          onUpdate={handleActiveWorkoutUpdate}
          onClose={() => {
            if (confirm('Are you sure you want to cancel this workout? Progress will be lost.')) {
              setActiveWorkout(null);
              setActiveExercises([]);
              saveStorageData(history, prs, gymDays, customWorkouts, customExercises, bodyMetrics, mealLogs, cardioLogs, null, [], dailyGoals, customCardioWorkouts, userProfile);
              setView('days');
            }
          }}
          onFinish={handleFinishWorkout}
          prs={prs}
          customExercises={customExercises}
        />
      )}

      {/* Goal Editor Overlay */}
      {showGoalEditor && (
        <GoalEditor 
          goals={dailyGoals} 
          onSave={handleSaveGoals} 
          onClose={() => setShowGoalEditor(false)} 
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
