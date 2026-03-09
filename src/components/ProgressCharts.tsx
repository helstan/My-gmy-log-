import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Activity, Target, ChevronRight, BarChart3, Calendar } from 'lucide-react';
import { CompletedWorkout } from '../types';

interface ProgressChartsProps {
  history: CompletedWorkout[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ history }) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // Get list of all exercises performed in history
  const availableExercises = useMemo(() => {
    const exercises = new Set<string>();
    history.forEach(workout => {
      workout.exercises.forEach(ex => exercises.add(ex.name));
    });
    return Array.from(exercises).sort();
  }, [history]);

  // Set initial selected exercise
  useState(() => {
    if (availableExercises.length > 0 && !selectedExercise) {
      setSelectedExercise(availableExercises[0]);
    }
  });

  // Process data for the selected exercise
  const chartData = useMemo(() => {
    if (!selectedExercise) return [];

    return history
      .filter(workout => workout.exercises.some(ex => ex.name === selectedExercise))
      .map(workout => {
        const exercise = workout.exercises.find(ex => ex.name === selectedExercise)!;
        
        // Calculate max weight and total volume
        let maxWeight = 0;
        let totalVolume = 0;
        exercise.sets.forEach(set => {
          const weight = exercise.isLbs ? set.weight * 0.453592 : set.weight;
          if (weight > maxWeight) maxWeight = weight;
          totalVolume += weight * set.reps;
        });

        return {
          date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: workout.date,
          weight: parseFloat(maxWeight.toFixed(1)),
          volume: parseFloat(totalVolume.toFixed(1)),
          reps: exercise.sets.reduce((acc, s) => acc + s.reps, 0)
        };
      })
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [history, selectedExercise]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-6">
          <BarChart3 size={40} />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">No Data Yet</h3>
        <p className="text-slate-500 text-sm max-w-[280px]">Complete your first workout to start tracking your progress visually.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto p-4 space-y-6 pb-24">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-passion">
          <TrendingUp size={20} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Visual Progress</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Performance Analytics</h2>
      </header>

      {/* Exercise Selector */}
      <div className="bg-card rounded-3xl p-4 border border-white/10 shadow-xl">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Select Exercise</label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {availableExercises.map(name => (
            <button
              key={name}
              onClick={() => setSelectedExercise(name)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedExercise === name 
                  ? 'bg-passion text-white shadow-lg shadow-passion/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {selectedExercise && chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Weight Progress Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-passion uppercase tracking-widest">Heaviest Set</span>
                <span className="text-2xl font-black text-white tracking-tighter">Strength Curve</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-xl text-energy">
                <Activity size={20} />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2e63" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff2e63" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}kg`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151619', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{ color: '#ff2e63' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#ff2e63" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Volume Progress Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-energy uppercase tracking-widest">Total Volume</span>
                <span className="text-2xl font-black text-white tracking-tighter">Work Capacity</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-xl text-passion">
                <Target size={20} />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151619', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{ color: '#00f260' }}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="volume" 
                    stroke="#00f260" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#00f260', strokeWidth: 2, stroke: '#151619' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-3xl p-5 border border-white/10 shadow-lg">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Starting Weight</span>
              <span className="text-xl font-black text-white">{chartData[0].weight}kg</span>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <Calendar size={10} />
                {chartData[0].date}
              </div>
            </div>
            <div className="bg-card rounded-3xl p-5 border border-white/10 shadow-lg">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Current Best</span>
              <span className="text-xl font-black text-energy">{Math.max(...chartData.map(d => d.weight))}kg</span>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-energy">
                <TrendingUp size={10} />
                +{((Math.max(...chartData.map(d => d.weight)) - chartData[0].weight) / chartData[0].weight * 100).toFixed(0)}% gain
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-12 border border-white/10 shadow-xl text-center">
          <p className="text-slate-500 font-bold">Select an exercise to see your progress charts.</p>
        </div>
      )}
    </div>
  );
};
