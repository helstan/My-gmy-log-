import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Activity, Utensils, Quote, Flame, Zap, CheckCircle2 } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../constants';
import { View, MealLog, CompletedWorkout, CardioLog } from '../types';

interface HomeViewProps {
  onSelectOption: (view: View) => void;
  userName: string;
  todayMeals: MealLog[];
  todayWorkouts: CompletedWorkout[];
  todayCardio: CardioLog[];
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onSelectOption, 
  userName, 
  todayMeals, 
  todayWorkouts, 
  todayCardio 
}) => {
  const quote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const workoutDone = todayWorkouts.length > 0;
  const cardioDone = todayCardio.length > 0;

  const options = [
    {
      id: 'days' as View,
      title: 'Workout',
      description: 'Strength & Muscle Building',
      icon: Dumbbell,
      color: 'bg-[#4285F4]',
      onColor: 'text-white'
    },
    {
      id: 'cardio' as View,
      title: 'Cardio',
      description: 'Endurance & Heart Health',
      icon: Activity,
      color: 'bg-[#34A853]',
      onColor: 'text-white'
    },
    {
      id: 'meals' as View,
      title: 'Meals',
      description: 'Nutrition & Macro Tracking',
      icon: Utensils,
      color: 'bg-[#FBBC05]',
      onColor: 'text-white'
    }
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 py-4">
      <header className="space-y-2">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-[var(--text)]"
        >
          {greeting}, {userName}!
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="m3-card p-6 bg-[var(--secondary-container)] border border-[var(--outline)]/10 relative overflow-hidden"
        >
          <Quote className="absolute -right-4 -top-4 w-24 h-24 text-[var(--on-secondary-container)] opacity-5" />
          <p className="text-sm font-medium italic text-[var(--on-secondary-container)] leading-relaxed relative z-10">
            "{quote}"
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Nutrition</span>
            <Flame size={14} className="text-[#EA4335]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--text)]">{Math.round(totalCalories)}</span>
            <span className="text-[10px] font-bold text-[var(--outline)] ml-1">kcal</span>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Activity</span>
            <Zap size={14} className="text-[#FBBC05]" />
          </div>
          <div className="flex gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${workoutDone ? 'bg-[#4285F4] text-white' : 'bg-[var(--outline)]/10 text-[var(--outline)]'}`}>
              <Dumbbell size={12} />
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${cardioDone ? 'bg-[#34A853] text-white' : 'bg-[var(--outline)]/10 text-[var(--outline)]'}`}>
              <Activity size={12} />
            </div>
            {(workoutDone || cardioDone) && (
              <CheckCircle2 size={14} className="text-[#34A853] ml-auto self-center" />
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            onClick={() => onSelectOption(option.id)}
            className="m3-card p-6 flex items-center gap-6 text-left hover:scale-[1.02] active:scale-[0.98] transition-all border border-[var(--outline)]/10 group"
          >
            <div className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
              <option.icon size={32} className={option.onColor} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--text)]">{option.title}</h3>
              <p className="text-sm text-[var(--outline)] font-medium">{option.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
