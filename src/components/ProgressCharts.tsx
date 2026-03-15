import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Activity, Target, ChevronRight, BarChart3, Calendar } from 'lucide-react';
import { View, WorkoutDay, CompletedWorkout, PersonalRecord, ActiveExercise, BodyMetrics as BodyMetricsType } from '../types';

interface ProgressChartsProps {
  history: CompletedWorkout[];
  bodyMetrics: BodyMetricsType[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ history, bodyMetrics }) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'performance' | 'metrics'>('performance');
  const [selectedMetric, setSelectedMetric] = useState<keyof BodyMetricsType>('weight');

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
        const isCardio = exercise.muscleGroup === 'Cardio';
        
        if (isCardio) {
          const totalDuration = exercise.sets.reduce((acc, s) => acc + (s.duration || 0), 0);
          const totalDistance = exercise.sets.reduce((acc, s) => acc + (s.distance || 0), 0);
          const totalCalories = exercise.sets.reduce((acc, s) => acc + (s.calories || 0), 0);

          return {
            date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: workout.date,
            duration: parseFloat((totalDuration / 60).toFixed(1)),
            distance: parseFloat(totalDistance.toFixed(1)),
            calories: totalCalories,
            isCardio: true
          };
        }

        // Calculate max weight and total volume
        let maxWeight = 0;
        let totalVolume = 0;
        exercise.sets.forEach(set => {
          const weight = exercise.isLbs ? (set.weight || 0) * 0.453592 : (set.weight || 0);
          if (weight > maxWeight) maxWeight = weight;
          totalVolume += weight * (set.reps || 0);
        });

        return {
          date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: workout.date,
          weight: parseFloat(maxWeight.toFixed(1)),
          volume: parseFloat(totalVolume.toFixed(1)),
          reps: exercise.sets.reduce((acc, s) => acc + (s.reps || 0), 0),
          isCardio: false
        };
      })
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [history, selectedExercise]);

  const metricsChartData = useMemo(() => {
    return [...bodyMetrics]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({
        date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: m.date,
        value: m[selectedMetric] as number
      }));
  }, [bodyMetrics, selectedMetric]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 bg-[var(--surface-container)] rounded-full flex items-center justify-center text-[var(--outline)] mb-6">
          <BarChart3 size={40} />
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] tracking-tight mb-2">No Data Yet</h3>
        <p className="text-[var(--outline)] text-sm max-w-[280px]">Complete your first workout to start tracking your progress visually.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto p-5 space-y-6 pb-24">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <TrendingUp size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Analytics</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Performance</h2>
      </header>

      {/* Tab Switcher */}
      <div className="flex bg-[var(--surface-container)] p-1 rounded-2xl border border-[var(--outline)]/10">
        <button 
          onClick={() => setActiveTab('performance')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'performance' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--outline)]'}`}
        >
          Workouts
        </button>
        <button 
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'metrics' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--outline)]'}`}
        >
          Body Metrics
        </button>
      </div>

      {activeTab === 'performance' ? (
        <>
          {/* Exercise Selector */}
          <div className="m3-card p-4 border border-[var(--outline)]/10">
            <label className="block text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider mb-3 px-1">Select Exercise</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {availableExercises.map(name => (
                <button
                  key={name}
                  onClick={() => setSelectedExercise(name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    selectedExercise === name 
                      ? 'bg-[var(--primary)] text-[var(--on-primary)] shadow-md' 
                      : 'bg-[var(--surface-container)] text-[var(--text)] hover:bg-[var(--outline)]/10 border border-[var(--outline)]/10'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {selectedExercise && chartData.length > 0 ? (
            <div className="space-y-6">
              {/* Primary Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="m3-card p-6 border border-[var(--outline)]/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                      {chartData[0].isCardio ? 'Distance Covered' : 'Heaviest Set'}
                    </span>
                    <span className="text-xl font-bold text-[var(--text)] tracking-tight">
                      {chartData[0].isCardio ? 'Endurance Curve' : 'Strength Curve'}
                    </span>
                  </div>
                  <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[var(--primary)]">
                    <Activity size={18} />
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4285F4" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4285F4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--outline)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="var(--outline)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}${chartData[0].isCardio ? 'km' : 'kg'}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--outline)',
                          borderRadius: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text)'
                        }}
                        itemStyle={{ color: '#4285F4' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={chartData[0].isCardio ? 'distance' : 'weight'} 
                        stroke="#4285F4" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPrimary)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Secondary Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="m3-card p-6 border border-[var(--outline)]/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--success)] uppercase tracking-wider">
                      {chartData[0].isCardio ? 'Total Duration' : 'Total Volume'}
                    </span>
                    <span className="text-xl font-bold text-[var(--text)] tracking-tight">
                      {chartData[0].isCardio ? 'Time Capacity' : 'Work Capacity'}
                    </span>
                  </div>
                  <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[var(--success)]">
                    <Target size={18} />
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--outline)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="var(--outline)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}${chartData[0].isCardio ? 'm' : ''}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--outline)',
                          borderRadius: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text)'
                        }}
                        itemStyle={{ color: '#34A853' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={chartData[0].isCardio ? 'duration' : 'volume'} 
                        stroke="#34A853" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#34A853', strokeWidth: 2, stroke: 'var(--surface)' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="m3-card p-5 border border-[var(--outline)]/10">
                  <span className="text-[9px] font-bold text-[var(--outline)] uppercase tracking-wider block mb-1">Starting Point</span>
                  <span className="text-xl font-bold text-[var(--text)]">
                    {chartData[0].isCardio ? `${chartData[0].distance}km` : `${chartData[0].weight}kg`}
                  </span>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[var(--outline)]">
                    <Calendar size={10} />
                    {chartData[0].date}
                  </div>
                </div>
                <div className="m3-card p-5 border border-[var(--outline)]/10">
                  <span className="text-[9px] font-bold text-[var(--outline)] uppercase tracking-wider block mb-1">Current Best</span>
                  <span className="text-xl font-bold text-[var(--primary)]">
                    {chartData[0].isCardio 
                      ? `${Math.max(...chartData.map(d => d.distance || 0))}km` 
                      : `${Math.max(...chartData.map(d => d.weight || 0))}kg`}
                  </span>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[var(--success)]">
                    <TrendingUp size={10} />
                    Progress Tracked
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
              <p className="text-[var(--outline)] font-bold">Select an exercise to see your progress charts.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Metric Selector */}
          <div className="m3-card p-4 border border-[var(--outline)]/10">
            <label className="block text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider mb-3 px-1">Select Metric</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'weight', label: 'Weight' },
                { id: 'bmi', label: 'BMI' },
                { id: 'waist', label: 'Waist' },
                { id: 'hip', label: 'Hip' },
                { id: 'waistToHip', label: 'W/H Ratio' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id as any)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    selectedMetric === m.id 
                      ? 'bg-[var(--primary)] text-[var(--on-primary)] shadow-md' 
                      : 'bg-[var(--surface-container)] text-[var(--text)] hover:bg-[var(--outline)]/10 border border-[var(--outline)]/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {bodyMetrics.length > 1 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="m3-card p-6 border border-[var(--outline)]/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">Body Composition</span>
                  <span className="text-xl font-bold text-[var(--text)] tracking-tight">Trend Analysis</span>
                </div>
                <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[var(--primary)]">
                  <Activity size={18} />
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricsChartData}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FBBC05" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#FBBC05" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--outline)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="var(--outline)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        border: '1px solid var(--outline)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--text)'
                      }}
                      itemStyle={{ color: '#FBBC05' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FBBC05" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMetric)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ) : (
            <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
              <p className="text-[var(--outline)] font-bold">Log at least two entries to see your body metrics trend.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
