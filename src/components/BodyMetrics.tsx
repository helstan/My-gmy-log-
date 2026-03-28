import React, { useState } from 'react';
import { Scale, Ruler, Activity, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BodyMetrics as BodyMetricsType } from '../types';

interface BodyMetricsProps {
  metrics: BodyMetricsType[];
  onSave: (metric: BodyMetricsType) => void;
  onDelete: (id: string) => void;
}

export const BodyMetrics: React.FC<BodyMetricsProps> = ({ metrics, onSave, onDelete }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [chest, setChest] = useState('');
  const [arms, setArms] = useState('');
  const [legs, setLegs] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const calculateBMI = (w: number, h: number) => {
    if (!w || !h) return 0;
    const heightInMeters = h / 100;
    return parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const calculateWaistToHip = (w: number, h: number) => {
    if (!w || !h) return 0;
    return parseFloat((w / h).toFixed(2));
  };

  const handleSave = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const wa = parseFloat(waist);
    const hi = parseFloat(hip);
    const ch = parseFloat(chest);
    const ar = parseFloat(arms);
    const le = parseFloat(legs);

    if (!w || !h) return;

    const newMetric: BodyMetricsType = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      weight: w,
      height: h,
      waist: wa || 0,
      hip: hi || 0,
      chest: ch || 0,
      arms: ar || 0,
      legs: le || 0,
      bmi: calculateBMI(w, h),
      waistToHip: calculateWaistToHip(wa, hi)
    };

    onSave(newMetric);
    setWeight('');
    setHeight(h.toString()); // Keep height for next time
    setWaist('');
    setHip('');
    setChest('');
    setArms('');
    setLegs('');
    setShowAdd(false);
  };

  const latest = metrics[0] || null;

  return (
    <div className="max-w-[520px] mx-auto p-5 space-y-6 pb-24">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <Activity size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Body Composition</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Metrics</h2>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="m3-card p-6 border border-[var(--outline)]/10 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Log New Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="75.5"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Height (cm)</label>
                  <input 
                    type="number" 
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="180"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Waist (cm)</label>
                  <input 
                    type="number" 
                    value={waist}
                    onChange={e => setWaist(e.target.value)}
                    placeholder="85"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Hip (cm)</label>
                  <input 
                    type="number" 
                    value={hip}
                    onChange={e => setHip(e.target.value)}
                    placeholder="95"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Chest (cm)</label>
                  <input 
                    type="number" 
                    value={chest}
                    onChange={e => setChest(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Arms (cm)</label>
                  <input 
                    type="number" 
                    value={arms}
                    onChange={e => setArms(e.target.value)}
                    placeholder="35"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--outline)] uppercase px-1">Legs (cm)</label>
                  <input 
                    type="number" 
                    value={legs}
                    onChange={e => setLegs(e.target.value)}
                    placeholder="60"
                    className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="w-full bg-[var(--primary)] text-[var(--on-primary)] py-3 rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-all shadow-md"
              >
                Save Metrics
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {latest && (
        <div className="grid grid-cols-2 gap-4">
          <div className="m3-card p-5 border border-[var(--outline)]/10">
            <div className="flex items-center gap-2 mb-2 text-[#4285F4]">
              <Scale size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">BMI</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{latest.bmi}</div>
            <div className="text-[10px] font-bold text-[var(--outline)] mt-1">
              {latest.bmi < 18.5 ? 'Underweight' : latest.bmi < 25 ? 'Normal' : latest.bmi < 30 ? 'Overweight' : 'Obese'}
            </div>
          </div>
          <div className="m3-card p-5 border border-[var(--outline)]/10">
            <div className="flex items-center gap-2 mb-2 text-[#34A853]">
              <TrendingUp size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Waist/Hip</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{latest.waistToHip}</div>
            <div className="text-[10px] font-bold text-[var(--outline)] mt-1">
              Ratio
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider px-1">History</h3>
        {metrics.length === 0 ? (
          <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
            <p className="text-[var(--outline)] font-bold">No metrics logged yet.</p>
          </div>
        ) : (
          metrics.map(m => (
            <div key={m.id} className="m3-card p-4 border border-[var(--outline)]/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[#4285F4]">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text)]">
                    {new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--outline)] uppercase">
                    {m.weight}kg • {m.height}cm
                  </div>
                  <div className="text-[8px] font-bold text-[var(--outline)] opacity-60 uppercase mt-0.5">
                    C: {m.chest || 0} • A: {m.arms || 0} • L: {m.legs || 0} • W: {m.waist || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--text)]">BMI {m.bmi}</div>
                  <div className="text-[10px] font-bold text-[var(--outline)] uppercase">W/H {m.waistToHip}</div>
                </div>
                <button 
                  onClick={() => onDelete(m.id)}
                  className="p-2 text-[var(--outline)] hover:text-[#EA4335] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
