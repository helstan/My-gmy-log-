import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutDay, MuscleGroup } from '../types';

interface CreateWorkoutModalProps {
  onClose: () => void;
  onSave: (workout: WorkoutDay) => void;
  availableExercises: string[];
}

export const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ onClose, onSave, availableExercises }) => {
  const [name, setName] = useState('');
  const [groups, setGroups] = useState<{ name: string; count: number; pool: string[] }[]>([]);
  const [newGroupName, setNewGroupName] = useState('');

  const addGroup = () => {
    if (!newGroupName) return;
    setGroups([...groups, { name: newGroupName, count: 1, pool: [] }]);
    setNewGroupName('');
  };

  const removeGroup = (index: number) => {
    setGroups(groups.filter((_, i) => i !== index));
  };

  const addExerciseToGroup = (groupIndex: number, exerciseName: string) => {
    const newGroups = [...groups];
    if (!newGroups[groupIndex].pool.includes(exerciseName)) {
      newGroups[groupIndex].pool.push(exerciseName);
      setGroups(newGroups);
    }
  };

  const removeExerciseFromGroup = (groupIndex: number, exerciseIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].pool.splice(exerciseIndex, 1);
    setGroups(newGroups);
  };

  const handleSave = () => {
    if (!name || groups.length === 0) return;
    const workout: WorkoutDay = {
      id: `custom-${Date.now()}`,
      name,
      accentColor: '#ff2e63',
      groups: groups.map(g => ({ ...g, name: g.name as any }))
    };
    onSave(workout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[var(--surface)] w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[var(--text)] border border-[var(--outline)]/10"
      >
        <div className="p-6 border-b border-[var(--outline)]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Plus size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Create Routine</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors text-[var(--outline)]">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider px-1">Routine Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Heavy Leg Day"
              className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl px-5 py-4 text-[var(--text)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Exercise Groups</label>
              <span className="text-[10px] font-bold text-[var(--primary)] uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">{groups.length} Groups</span>
            </div>

            <div className="space-y-4">
              {groups.map((group, gIdx) => (
                <div key={gIdx} className="bg-[var(--surface-container)] rounded-2xl p-5 border border-[var(--outline)]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--text)] uppercase tracking-tight">{group.name}</span>
                      <div className="flex items-center gap-2 bg-[var(--surface)] rounded-lg px-2 py-1 border border-[var(--outline)]/10">
                        <span className="text-[10px] font-bold text-[var(--outline)] uppercase">Count:</span>
                        <input 
                          type="number" 
                          value={group.count}
                          onChange={e => {
                            const newGroups = [...groups];
                            newGroups[gIdx].count = parseInt(e.target.value) || 1;
                            setGroups(newGroups);
                          }}
                          className="w-8 bg-transparent text-[10px] font-bold text-[var(--primary)] focus:outline-none"
                        />
                      </div>
                    </div>
                    <button onClick={() => removeGroup(gIdx)} className="text-[var(--outline)] hover:text-[var(--passion)] transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.pool.map((ex, eIdx) => (
                      <span key={eIdx} className="bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-[var(--outline)]/10">
                        {ex}
                        <button onClick={() => removeExerciseFromGroup(gIdx, eIdx)} className="hover:text-[var(--passion)]">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <div className="relative">
                      <select 
                        onChange={e => {
                          if (e.target.value) addExerciseToGroup(gIdx, e.target.value);
                          e.target.value = '';
                        }}
                        className="appearance-none bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-[var(--primary)]/20 focus:outline-none cursor-pointer pr-6"
                      >
                        <option value="">+ Add Exercise</option>
                        {availableExercises.map(ex => (
                          <option key={ex} value={ex}>{ex}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Group Name (e.g., Quads)"
                  className="flex-1 bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none text-[var(--text)]"
                />
                <button 
                  onClick={addGroup}
                  className="bg-[var(--text)] text-[var(--bg)] px-5 py-3 rounded-2xl font-bold uppercase tracking-wider text-[10px] active:scale-95 transition-all"
                >
                  Add Group
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--outline)]/10">
          <button 
            onClick={handleSave}
            disabled={!name || groups.length === 0}
            className="w-full bg-[var(--primary)] text-[var(--on-primary)] py-4 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-lg disabled:opacity-50 disabled:scale-100 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Save size={20} />
            Save Routine
          </button>
        </div>
      </motion.div>
    </div>
  );
};
