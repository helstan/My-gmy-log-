import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Activity, Utensils, Flame, Zap, Trophy, Target, Heart, ChevronUp, ChevronDown, Plus, TrendingUp } from 'lucide-react';
import { View, MealLog, CompletedWorkout, CardioLog, UserProfile, WorkoutDay } from '../types';
import { Avatar } from './Avatar';
import { XPBar } from './XPBar';
import { StatCard } from './StatCard';
import { LEVELS } from '../constants';

interface HomeViewProps {
  onSelectOption: (view: View) => void;
  userProfile: UserProfile;
  todayMeals: MealLog[];
  todayWorkouts: CompletedWorkout[];
  todayCardio: CardioLog[];
  workoutSplit?: WorkoutDay[];
  onMoveWorkout?: (id: string | number, direction: 'up' | 'down') => void;
  onAddCustomWorkout?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onSelectOption, 
  userProfile, 
  todayMeals, 
  todayWorkouts, 
  todayCardio,
  workoutSplit = [],
  onMoveWorkout,
  onAddCustomWorkout
}) => {
  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const workoutDone = todayWorkouts.length > 0;
  const cardioDone = todayCardio.length > 0;

  const currentLevel = userProfile?.level || 1;
  const nextLevelXP = LEVELS.find(l => l.level === currentLevel)?.xpRequired || 1000;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 py-4">
      {/* Header with Avatar and Greeting */}
      <header className="flex items-center gap-4 px-1">
        <Avatar seed={userProfile?.email || 'guest'} mood={workoutDone ? 'happy' : 'neutral'} size={70} />
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-black tracking-tight text-[var(--text)] truncate">
            {greeting}, {userProfile?.displayName?.split(' ')[0] || 'Athlete'}!
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 bg-[var(--secondary-container)] px-2 py-0.5 rounded-full border border-[var(--outline)]/10">
              <Flame size={12} className="text-[#FF6B6B]" />
              <span className="text-[10px] font-black text-[var(--on-secondary-container)] uppercase tracking-widest">
                {userProfile?.streak || 0} Day Streak
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[var(--surface-container)] px-2 py-0.5 rounded-full border border-[var(--outline)]/10">
              <Trophy size={12} className="text-[#FBBC05]" />
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                Level {currentLevel}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* XP Progress Section */}
      <section className="px-1">
        <XPBar currentXP={userProfile?.xp || 0} requiredXP={nextLevelXP} level={currentLevel} />
      </section>

      {/* Daily Goals Grid (Swiggy Style) */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">Daily Missions</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            title="Calories" 
            value={Math.round(totalCalories)} 
            unit="kcal" 
            icon={Flame} 
            color="var(--gradient-primary)" 
            progress={Math.min(Math.round((totalCalories / 2500) * 100), 100)}
          />
          <StatCard 
            title="Workouts" 
            value={todayWorkouts.length} 
            unit="done" 
            icon={Dumbbell} 
            color="var(--gradient-purple)" 
            progress={workoutDone ? 100 : 0}
          />
          <StatCard 
            title="Cardio" 
            value={todayCardio.length} 
            unit="done" 
            icon={Activity} 
            color="var(--gradient-success)" 
            progress={cardioDone ? 100 : 0}
          />
          <StatCard 
            title="Heart Rate" 
            value={72} 
            unit="bpm" 
            icon={Heart} 
            color="var(--gradient-secondary)" 
          />
        </div>
      </section>

      {/* Quick Actions (Swiggy Style Large Cards) */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">Start Quest</h3>
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectOption('progress_deck')}
            className="w-full gamified-card flex items-center gap-6 text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--power)]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--gradient-purple)] flex items-center justify-center shadow-xl relative z-10">
              <TrendingUp size={32} className="text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-xl font-black text-[var(--text)] tracking-tight">Progress Deck</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Visual Analytics & Trends</p>
            </div>
            <Target size={24} className="text-[var(--text-muted)] opacity-20" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectOption('days')}
            className="w-full gamified-card flex items-center gap-6 text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--gradient-purple)] flex items-center justify-center shadow-xl relative z-10">
              <Dumbbell size={32} className="text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-xl font-black text-[var(--text)] tracking-tight">Strength Mission</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Build Power & Muscle</p>
            </div>
            <Target size={24} className="text-[var(--text-muted)] opacity-20" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectOption('cardio')}
            className="w-full gamified-card flex items-center gap-6 text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#34A853]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--gradient-success)] flex items-center justify-center shadow-xl relative z-10">
              <Activity size={32} className="text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-xl font-black text-[var(--text)] tracking-tight">Endurance Quest</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Boost Heart Health</p>
            </div>
            <Target size={24} className="text-[var(--text-muted)] opacity-20" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectOption('meals')}
            className="w-full gamified-card flex items-center gap-6 text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBC05]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-xl relative z-10">
              <Utensils size={32} className="text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-xl font-black text-[var(--text)] tracking-tight">Nutrition Log</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Track Fuel & Macros</p>
            </div>
            <Target size={24} className="text-[var(--text-muted)] opacity-20" />
          </motion.button>
        </div>
      </section>

      {/* Workout Reordering Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Your Missions</h3>
          <button 
            onClick={onAddCustomWorkout}
            className="flex items-center gap-1 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest bg-[var(--secondary-container)] px-3 py-1 rounded-full"
          >
            <Plus size={12} /> Custom
          </button>
        </div>
        <div className="space-y-3">
          {workoutSplit.map((workout, idx) => (
            <motion.div 
              key={workout.id} 
              layout
              className="gamified-card p-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: workout.accentColor }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[var(--text)]">{workout.name}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{workout.groups.length} Groups</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button 
                    onClick={() => onMoveWorkout?.(workout.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] disabled:opacity-10 transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={() => onMoveWorkout?.(workout.id, 'down')}
                    disabled={idx === workoutSplit.length - 1}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] disabled:opacity-10 transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => onSelectOption('days')}
                  className="w-8 h-8 rounded-lg bg-[var(--surface-container)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  <Target size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
