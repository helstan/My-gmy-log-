import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Plus, History, Trash2, PieChart, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { MealLog } from '../types';

interface MealTrackerProps {
  logs: MealLog[];
  onSave: (log: MealLog) => void;
  onDelete: (id: string) => void;
}

export const MealTracker: React.FC<MealTrackerProps> = ({ logs, onSave, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

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

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date.split('T')[0] === today);
  
  const totals = todayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.calories,
    protein: acc.protein + log.protein,
    carbs: acc.carbs + log.carbs,
    fats: acc.fats + log.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

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
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-12 h-12 rounded-2xl bg-[#FBBC05] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Plus size={28} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[var(--outline)] uppercase tracking-wider">Today's Summary</h3>
            <Flame size={16} className="text-[#EA4335]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-[var(--text)]">{Math.round(totals.calories)}</span>
              <span className="text-sm font-bold text-[var(--outline)] ml-2">kcal</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--outline)] uppercase">
                <Beef size={10} className="text-[#4285F4]" />
                Protein
              </div>
              <div className="text-sm font-bold text-[var(--text)]">{Math.round(totals.protein)}g</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--outline)] uppercase">
                <Wheat size={10} className="text-[#FBBC05]" />
                Carbs
              </div>
              <div className="text-sm font-bold text-[var(--text)]">{Math.round(totals.carbs)}g</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--outline)] uppercase">
                <Droplets size={10} className="text-[#34A853]" />
                Fats
              </div>
              <div className="text-sm font-bold text-[var(--text)]">{Math.round(totals.fats)}g</div>
            </div>
          </div>
        </div>
      </div>

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
                    placeholder="Breakfast / Chicken Salad"
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
                      placeholder="500"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Protein (g)</label>
                    <input 
                      type="number" 
                      value={protein}
                      onChange={e => setProtein(e.target.value)}
                      placeholder="30"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Carbs (g)</label>
                    <input 
                      type="number" 
                      value={carbs}
                      onChange={e => setCarbs(e.target.value)}
                      placeholder="50"
                      className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Fats (g)</label>
                    <input 
                      type="number" 
                      value={fats}
                      onChange={e => setFats(e.target.value)}
                      placeholder="15"
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

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History size={16} className="text-[var(--outline)]" />
          <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Recent Meals</h3>
        </div>
        
        {logs.length === 0 ? (
          <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
            <p className="text-[var(--outline)] font-bold">No meals logged yet.</p>
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
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface-container)] flex items-center justify-center text-[#FBBC05]">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">{log.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="text-[10px] font-bold text-[var(--outline)]">
                        {log.calories} kcal
                      </div>
                      <div className="text-[10px] font-bold text-[var(--outline)]">
                        P: {log.protein}g
                      </div>
                      <div className="text-[10px] font-bold text-[var(--outline)]">
                        C: {log.carbs}g
                      </div>
                      <div className="text-[10px] font-bold text-[var(--outline)]">
                        F: {log.fats}g
                      </div>
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
