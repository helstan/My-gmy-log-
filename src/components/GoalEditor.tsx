import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, X, Save } from 'lucide-react';
import { DailyGoals } from '../types';

interface GoalEditorProps {
  goals: DailyGoals;
  onSave: (goals: DailyGoals) => void;
  onClose: () => void;
}

export const GoalEditor: React.FC<GoalEditorProps> = ({ goals, onSave, onClose }) => {
  const [editedGoals, setEditedGoals] = useState<DailyGoals>(goals);

  const handleChange = (field: keyof DailyGoals, value: string) => {
    setEditedGoals(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--surface)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--outline)]/10"
      >
        <div className="p-6 border-b border-[var(--outline)]/10 flex items-center justify-between bg-[var(--surface-container)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Target size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Daily Goals</h2>
              <p className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Set your targets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--outline)]/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Burn Calories</label>
              <input 
                type="number" 
                value={editedGoals.caloriesBurned}
                onChange={e => handleChange('caloriesBurned', e.target.value)}
                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Eat Calories</label>
              <input 
                type="number" 
                value={editedGoals.caloriesConsumed}
                onChange={e => handleChange('caloriesConsumed', e.target.value)}
                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-widest border-b border-[var(--outline)]/10 pb-2">Macros (grams)</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[var(--outline)] uppercase px-1">Protein</label>
                <input 
                  type="number" 
                  value={editedGoals.protein}
                  onChange={e => handleChange('protein', e.target.value)}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#EA4335]/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[var(--outline)] uppercase px-1">Carbs</label>
                <input 
                  type="number" 
                  value={editedGoals.carbs}
                  onChange={e => handleChange('carbs', e.target.value)}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FBBC05]/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[var(--outline)] uppercase px-1">Fats</label>
                <input 
                  type="number" 
                  value={editedGoals.fats}
                  onChange={e => handleChange('fats', e.target.value)}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#4285F4]/20"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSave(editedGoals)}
            className="w-full bg-[var(--primary)] text-[var(--on-primary)] py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Save size={18} />
            Save Goals
          </button>
        </div>
      </motion.div>
    </div>
  );
};
