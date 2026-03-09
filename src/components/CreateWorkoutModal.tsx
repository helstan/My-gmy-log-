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
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-passion/20 flex items-center justify-center text-passion">
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Create Routine</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Routine Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Heavy Leg Day"
              className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-passion/50 transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exercise Groups</label>
              <span className="text-[10px] font-bold text-passion uppercase bg-passion/10 px-2 py-0.5 rounded-full">{groups.length} Groups</span>
            </div>

            <div className="space-y-4">
              {groups.map((group, gIdx) => (
                <div key={gIdx} className="bg-slate-900/50 rounded-3xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white uppercase tracking-tight">{group.name}</span>
                      <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 py-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Count:</span>
                        <input 
                          type="number" 
                          value={group.count}
                          onChange={e => {
                            const newGroups = [...groups];
                            newGroups[gIdx].count = parseInt(e.target.value) || 1;
                            setGroups(newGroups);
                          }}
                          className="w-8 bg-transparent text-[10px] font-black text-energy focus:outline-none"
                        />
                      </div>
                    </div>
                    <button onClick={() => removeGroup(gIdx)} className="text-slate-600 hover:text-passion transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.pool.map((ex, eIdx) => (
                      <span key={eIdx} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-white/5">
                        {ex}
                        <button onClick={() => removeExerciseFromGroup(gIdx, eIdx)} className="hover:text-passion">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <select 
                      onChange={e => {
                        if (e.target.value) addExerciseToGroup(gIdx, e.target.value);
                        e.target.value = '';
                      }}
                      className="bg-passion/10 text-passion px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-passion/20 focus:outline-none cursor-pointer"
                    >
                      <option value="">+ Add Exercise</option>
                      {availableExercises.map(ex => (
                        <option key={ex} value={ex}>{ex}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Group Name (e.g., Quads)"
                  className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none"
                />
                <button 
                  onClick={addGroup}
                  className="bg-energy text-bg px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                >
                  Add Group
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-bg/50 border-t border-white/5">
          <button 
            onClick={handleSave}
            disabled={!name || groups.length === 0}
            className="w-full bg-gradient-to-r from-passion to-power text-white py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-passion/20 disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Save size={20} />
            Save Routine
          </button>
        </div>
      </motion.div>
    </div>
  );
};
