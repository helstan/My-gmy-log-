import React from 'react';
import { motion } from 'motion/react';
import { Zap, Utensils, Flame, Settings } from 'lucide-react';
import { DailyGoals, MealLog, CardioLog } from '../types';

interface DailyProgressProps {
  goals: DailyGoals;
  mealLogs: MealLog[];
  cardioLogs: CardioLog[];
  onEditGoals: () => void;
}

export const DailyProgress: React.FC<DailyProgressProps> = ({ goals, mealLogs, cardioLogs, onEditGoals }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const todayMeals = mealLogs.filter(l => l.date.split('T')[0] === today);
  const todayCardio = cardioLogs.filter(l => l.date.split('T')[0] === today);

  const consumed = {
    calories: todayMeals.reduce((acc, l) => acc + l.calories, 0),
    protein: todayMeals.reduce((acc, l) => acc + l.protein, 0),
    carbs: todayMeals.reduce((acc, l) => acc + l.carbs, 0),
    fats: todayMeals.reduce((acc, l) => acc + l.fats, 0),
  };

  const burned = todayCardio.reduce((acc, l) => acc + (l.calories || 0), 0);

  const ProgressBar = ({ label, current, goal, color, icon: Icon, unit }: any) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const remaining = Math.max(goal - current, 0);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${color} bg-opacity-10`}>
              <Icon size={14} className={color.replace('bg-', 'text-')} />
            </div>
            <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">{label}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[var(--text)]">{Math.round(current)}</span>
            <span className="text-[10px] font-bold text-[var(--outline)]"> / {goal}{unit}</span>
          </div>
        </div>
        <div className="h-2 bg-[var(--surface-container)] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${color}`}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {remaining > 0 && (
          <p className="text-[9px] font-bold text-[var(--outline)] text-right">
            {Math.round(remaining)}{unit} remaining
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="m3-card p-5 border border-[var(--outline)]/10 space-y-6 bg-[var(--bg)]/50 backdrop-blur-sm relative group">
      <button 
        onClick={onEditGoals}
        className="absolute top-4 right-4 p-2 rounded-full bg-[var(--surface-container)] text-[var(--outline)] opacity-0 group-hover:opacity-100 transition-all hover:text-[var(--primary)]"
      >
        <Settings size={14} />
      </button>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest">Daily Goals</h3>
        <div className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[9px] font-bold uppercase">
          Today
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ProgressBar 
            label="Calories Burned" 
            current={burned} 
            goal={goals.caloriesBurned} 
            color="bg-[#34A853]" 
            icon={Flame}
            unit="kcal"
          />
          <ProgressBar 
            label="Calories Consumed" 
            current={consumed.calories} 
            goal={goals.caloriesConsumed} 
            color="bg-[#4285F4]" 
            icon={Utensils}
            unit="kcal"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--outline)] uppercase block text-center">Protein</span>
              <div className="h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((consumed.protein / goals.protein) * 100, 100)}%` }}
                  className="h-full bg-[#EA4335]"
                />
              </div>
              <span className="text-[9px] font-bold text-[var(--text)] block text-center">{Math.round(consumed.protein)}g</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--outline)] uppercase block text-center">Carbs</span>
              <div className="h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((consumed.carbs / goals.carbs) * 100, 100)}%` }}
                  className="h-full bg-[#FBBC05]"
                />
              </div>
              <span className="text-[9px] font-bold text-[var(--text)] block text-center">{Math.round(consumed.carbs)}g</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--outline)] uppercase block text-center">Fats</span>
              <div className="h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((consumed.fats / goals.fats) * 100, 100)}%` }}
                  className="h-full bg-[#4285F4]"
                />
              </div>
              <span className="text-[9px] font-bold text-[var(--text)] block text-center">{Math.round(consumed.fats)}g</span>
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-[var(--outline)] uppercase px-1">
            <span>Progress: {Math.round((consumed.calories / goals.caloriesConsumed) * 100)}%</span>
            <span>Goal: {goals.caloriesConsumed} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
