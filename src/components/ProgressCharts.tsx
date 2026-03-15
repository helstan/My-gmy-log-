import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Activity, Target, ChevronRight, BarChart3, Calendar, Utensils, Flame, Clock, CheckCircle2 } from 'lucide-react';
import { View, WorkoutDay, CompletedWorkout, PersonalRecord, ActiveExercise, BodyMetrics as BodyMetricsType, CardioLog, MealLog, DailyGoals } from '../types';

interface ProgressChartsProps {
  history: CompletedWorkout[];
  bodyMetrics: BodyMetricsType[];
  cardioLogs: CardioLog[];
  mealLogs: MealLog[];
  goals: DailyGoals;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ 
  history, 
  bodyMetrics, 
  cardioLogs, 
  mealLogs,
  goals
}) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'performance' | 'cardio' | 'nutrition' | 'metrics'>('performance');
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

  const cardioChartData = useMemo(() => {
    return [...cardioLogs]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(l => ({
        date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: l.date,
        duration: Math.round(l.duration / 60),
        distance: l.distance || 0,
        calories: l.calories || 0
      }));
  }, [cardioLogs]);

  const nutritionChartData = useMemo(() => {
    const grouped = mealLogs.reduce((acc, log) => {
      const date = log.date.split('T')[0];
      if (!acc[date]) acc[date] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
      acc[date].calories += log.calories;
      acc[date].protein += log.protein;
      acc[date].carbs += log.carbs;
      acc[date].fats += log.fats;
      return acc;
    }, {} as Record<string, { calories: number; protein: number; carbs: number; fats: number }>);

    return Object.keys(grouped)
      .sort()
      .map(date => {
        const data = grouped[date];
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: date,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats
        };
      });
  }, [mealLogs]);

  if (history.length === 0 && cardioLogs.length === 0 && mealLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 bg-[var(--surface-container)] rounded-full flex items-center justify-center text-[var(--outline)] mb-6">
          <BarChart3 size={40} />
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] tracking-tight mb-2">No Data Yet</h3>
        <p className="text-[var(--outline)] text-sm max-w-[280px]">Start logging your workouts, cardio, or meals to see your progress visually.</p>
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
      <div className="flex bg-[var(--surface-container)] p-1 rounded-2xl border border-[var(--outline)]/10 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('performance')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'performance' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--outline)]'}`}
        >
          Workouts
        </button>
        <button 
          onClick={() => setActiveTab('cardio')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'cardio' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--outline)]'}`}
        >
          Cardio
        </button>
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'nutrition' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--outline)]'}`}
        >
          Nutrition
        </button>
        <button 
          onClick={() => setActiveTab('metrics')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'metrics' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--outline)]'}`}
        >
          Metrics
        </button>
      </div>

      {activeTab === 'performance' && (
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
            </div>
          ) : (
            <div className="m3-card p-12 text-center border border-[var(--outline)]/10">
              <p className="text-[var(--outline)] font-bold">Select an exercise to see your progress charts.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'cardio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10">
              <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Goal Achievement</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-[#34A853]">
                  {Math.round((cardioLogs.reduce((acc, l) => acc + (l.calories || 0), 0) / (goals.caloriesBurned * Math.max(cardioChartData.length, 1))) * 100)}%
                </span>
                <span className="text-[10px] font-bold text-[var(--outline)]">avg</span>
              </div>
            </div>
            <div className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10">
              <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Total Calories</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-[var(--text)]">
                  {cardioLogs.reduce((acc, l) => acc + (l.calories || 0), 0)}
                </span>
                <span className="text-[10px] font-bold text-[var(--outline)]">kcal</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="m3-card p-6 border border-[var(--outline)]/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#34A853] uppercase tracking-wider">Endurance</span>
                <span className="text-xl font-bold text-[var(--text)] tracking-tight">Distance Over Time</span>
              </div>
              <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[#34A853]">
                <Activity size={18} />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cardioChartData}>
                  <defs>
                    <linearGradient id="colorCardio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34A853" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#34A853" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="date" stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}km`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline)', borderRadius: '16px' }}
                    itemStyle={{ color: '#34A853' }}
                  />
                  <Area type="monotone" dataKey="distance" stroke="#34A853" strokeWidth={3} fillOpacity={1} fill="url(#colorCardio)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="m3-card p-6 border border-[var(--outline)]/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#4285F4] uppercase tracking-wider">Time</span>
                <span className="text-xl font-bold text-[var(--text)] tracking-tight">Duration Trend</span>
              </div>
              <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[#4285F4]">
                <Clock size={18} />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cardioChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="date" stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}m`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline)', borderRadius: '16px' }}
                    itemStyle={{ color: '#4285F4' }}
                  />
                  <Line type="monotone" dataKey="duration" stroke="#4285F4" strokeWidth={3} dot={{ r: 4, fill: '#4285F4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10">
              <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Goal Achievement</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-[#EA4335]">
                  {Math.round((nutritionChartData.reduce((acc, d) => acc + d.calories, 0) / (goals.caloriesConsumed * Math.max(nutritionChartData.length, 1))) * 100)}%
                </span>
                <span className="text-[10px] font-bold text-[var(--outline)]">avg</span>
              </div>
            </div>
            <div className="m3-card p-4 bg-[var(--surface-container)] border border-[var(--outline)]/10">
              <span className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-wider">Avg Protein</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-[var(--text)]">
                  {nutritionChartData.length > 0 
                    ? Math.round(nutritionChartData.reduce((acc, d) => acc + d.protein, 0) / nutritionChartData.length)
                    : 0
                  }
                </span>
                <span className="text-[10px] font-bold text-[var(--outline)]">g</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="m3-card p-6 border border-[var(--outline)]/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#EA4335] uppercase tracking-wider">Energy</span>
                <span className="text-xl font-bold text-[var(--text)] tracking-tight">Calorie Intake</span>
              </div>
              <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[#EA4335]">
                <Flame size={18} />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="date" stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline)', borderRadius: '16px' }}
                    itemStyle={{ color: '#EA4335' }}
                  />
                  <Bar dataKey="calories" fill="#EA4335" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="m3-card p-6 border border-[var(--outline)]/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#FBBC05] uppercase tracking-wider">Macros</span>
                <span className="text-xl font-bold text-[var(--text)] tracking-tight">Nutrient Balance</span>
              </div>
              <div className="bg-[var(--surface-container)] p-2 rounded-xl text-[#FBBC05]">
                <Utensils size={18} />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutritionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="date" stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--outline)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline)', borderRadius: '16px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  <Line type="monotone" dataKey="protein" stroke="#4285F4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="carbs" stroke="#FBBC05" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fats" stroke="#34A853" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'metrics' && (
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
