import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Plus, History, Trash2, PieChart, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { MealLog, DailyGoals } from '../types';

interface MealTrackerProps {
  logs: MealLog[];
  goals: DailyGoals;
  onSave: (log: MealLog) => void;
  onDelete: (id: string) => void;
  onUpdateGoals?: (goals: Partial<DailyGoals>) => void;
}

export const MealTracker: React.FC<MealTrackerProps> = ({ logs, goals, onSave, onDelete, onUpdateGoals }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const [goalCals, setGoalCals] = useState(goals.caloriesConsumed.toString());
  const [goalProt, setGoalProt] = useState(goals.protein.toString());
  const [goalCarbs, setGoalCarbs] = useState(goals.carbs.toString());
  const [goalFats, setGoalFats] = useState(goals.fats.toString());

  const handleSave = () => {
    if (!name || !calories) return;

    const newLog: MealLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0
    };

    onSave(newLog);
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setShowAdd(false);
  };

  const handleSaveGoals = () => {
    onUpdateGoals?.({
      caloriesConsumed: parseFloat(goalCals) || 2500,
      protein: parseFloat(goalProt) || 150,
      carbs: parseFloat(goalCarbs) || 300,
      fats: parseFloat(goalFats) || 80
    });
    setShowEditGoals(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date.split('T')[0] === today);
  
  const totals = todayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.calories,
    protein: acc.protein + log.protein,
    carbs: acc.carbs + log.carbs,
    fats: acc.fats + log.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const groupedLogs = logs.reduce((acc, log) => {
    const date = log.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, MealLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#FBBC05] mb-1">
            <Utensils size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Nutrition</span>
          </div>
          <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Meal Tracker</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEditGoals(!showEditGoals)}
            className="w-12 h-12 rounded-2xl bg-[var(--surface-container)] text-[var(--text)] flex items-center justify-center shadow-md active:scale-95 transition-all border border-[var(--outline)]/10"
          >
            <PieChart size={24} className={showEditGoals ? 'text-[#FBBC05]' : ''} />
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-12 h-12 rounded-2xl bg-[#FBBC05] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <Plus size={28} className={`transition-transform duration-300 ${showAdd ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        <div className="m3-card p-6 bg-[var(--surface-container)] border border-[var(--outline)]/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold text-[var(--outline)] uppercase tracking-wider mb-1">Today's Intake</h3>
              <p className="text-[10px] font-bold text-[var(--outline)] opacity-60">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EA4335]/10 flex items-center justify-center">
              <Flame size={24} className="text-[#EA4335]" />
            </div>
          </div>
          
          <div className="flex items-center gap-8 mb-8">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-[var(--outline)]/10"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="transparent"
                  stroke="#EA4335"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (Math.min(totals.calories / goals.caloriesConsumed, 1) * 251.2) }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[var(--text)]">{Math.round(totals.calories)}</span>
                <span className="text-[8px] font-bold text-[var(--outline)] uppercase">/ {goals.caloriesConsumed}</span>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-[var(--outline)]">Protein</span>
                  <span className="text-[var(--text)]">{Math.round(totals.protein)} / {goals.protein}g</span>
                </div>
                <div className="h-1.5 bg-[var(--outline)]/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totals.protein / goals.protein) * 100, 100)}%` }}
                    className="h-full bg-[#4285F4]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-[var(--outline)]">Carbs</span>
                  <span className="text-[var(--text)]">{Math.round(totals.carbs)} / {goals.carbs}g</span>
                </div>
                <div className="h-1.5 bg-[var(--outline)]/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totals.carbs / goals.carbs) * 100, 100)}%` }}
                    className="h-full bg-[#FBBC05]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-[var(--outline)]">Fats</span>
                  <span className="text-[var(--text)]">{Math.round(totals.fats)} / {goals.fats}g</span>
                </div>
                <div className="h-1.5 bg-[var(--outline)]/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totals.fats / goals.fats) * 100, 100)}%` }}
                    className="h-full bg-[#34A853]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditGoals && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="m3-card p-6 border border-[var(--outline)]/10 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Daily Macro Goals</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Calories</label>
                  <input 
                    type="number" 
                    value={goalCals}
                    onChange={e => setGoalCals(e.target.value)}
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Protein (g)</label>
                  <input 
                    type="number" 
                    value={goalProt}
                    onChange={e => setGoalProt(e.target.value)}
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={goalCarbs}
                    onChange={e => setGoalCarbs(e.target.value)}
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Fats (g)</label>
                  <input 
                    type="number" 
                    value={goalFats}
                    onChange={e => setGoalFats(e.target.value)}
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveGoals}
                className="w-full bg-[#FBBC05] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-all shadow-md"
              >
                Update Goals
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="m3-card p-6 border border-[var(--outline)]/10 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Log Meal</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Meal Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Grilled Chicken & Rice"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Calories</label>
                    <input 
                      type="number" 
                      value={calories}
                      onChange={e => setCalories(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Protein (g)</label>
                    <input 
                      type="number" 
                      value={protein}
                      onChange={e => setProtein(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Carbs (g)</label>
                    <input 
                      type="number" 
                      value={carbs}
                      onChange={e => setCarbs(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Fats (g)</label>
                    <input 
                      type="number" 
                      value={fats}
                      onChange={e => setFats(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSave}
                  className="w-full bg-[#FBBC05] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-all shadow-md"
                >
                  Save Meal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <History size={16} className="text-[var(--outline)]" />
          <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Meal History</h3>
        </div>
        
        {sortedDates.length === 0 ? (
          <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
            <p className="text-[var(--outline)] font-bold">No meals logged yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-widest">
                    {date === today ? 'Today' : new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h4>
                  <div className="text-[10px] font-bold text-[var(--outline)] opacity-40">
                    {groupedLogs[date].length} items
                  </div>
                </div>
                <div className="space-y-3">
                  {groupedLogs[date].map(log => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="m3-card p-4 border border-[var(--outline)]/10 flex items-center justify-between group bg-[var(--surface)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[#FBBC05]">
                          <Utensils size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[var(--text)]">{log.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="text-[10px] font-bold text-[var(--outline)]">
                              {log.calories} kcal
                            </div>
                            <div className="flex gap-2">
                              <span className="text-[8px] font-bold text-[#4285F4] uppercase">P: {log.protein}g</span>
                              <span className="text-[8px] font-bold text-[#FBBC05] uppercase">C: {log.carbs}g</span>
                              <span className="text-[8px] font-bold text-[#34A853] uppercase">F: {log.fats}g</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onDelete(log.id)}
                        className="p-2 text-[var(--outline)] hover:text-[#EA4335] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
