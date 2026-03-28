import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Utensils, 
  Activity, 
  Dumbbell,
  Calendar
} from 'lucide-react';

// Dummy Data
const strengthData = [
  { day: 'Mon', bench: 80, squat: 100, deadlift: 120 },
  { day: 'Tue', bench: 82.5, squat: 105, deadlift: 125 },
  { day: 'Wed', bench: 82.5, squat: 105, deadlift: 125 },
  { day: 'Thu', bench: 85, squat: 110, deadlift: 130 },
  { day: 'Fri', bench: 87.5, squat: 115, deadlift: 135 },
  { day: 'Sat', bench: 90, squat: 120, deadlift: 140 },
  { day: 'Sun', bench: 90, squat: 120, deadlift: 140 },
];

const nutritionData = [
  { day: 'Mon', calories: 2400, protein: 180, carbs: 250, fats: 70 },
  { day: 'Tue', calories: 2200, protein: 170, carbs: 220, fats: 65 },
  { day: 'Wed', calories: 2500, protein: 190, carbs: 280, fats: 75 },
  { day: 'Thu', calories: 2300, protein: 175, carbs: 240, fats: 68 },
  { day: 'Fri', calories: 2600, protein: 200, carbs: 300, fats: 80 },
  { day: 'Sat', calories: 2800, protein: 160, carbs: 350, fats: 90 },
  { day: 'Sun', calories: 2100, protein: 150, carbs: 200, fats: 60 },
];

const cardioData = [
  { day: 'Mon', duration: 30, heartRate: 145 },
  { day: 'Tue', duration: 45, heartRate: 140 },
  { day: 'Wed', duration: 20, heartRate: 155 },
  { day: 'Thu', duration: 60, heartRate: 135 },
  { day: 'Fri', duration: 35, heartRate: 150 },
  { day: 'Sat', duration: 90, heartRate: 130 },
  { day: 'Sun', duration: 15, heartRate: 160 },
];

const slides = [
  {
    id: 'strength',
    title: 'Strength Progress',
    subtitle: 'Weekly Weight Increases (kg)',
    icon: <Dumbbell className="text-[var(--power)]" size={24} />,
    color: 'var(--power)',
    chart: (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={strengthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="var(--text-muted)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            unit="kg"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-container)', 
              border: 'none', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'var(--text)'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="bench" stroke="#4285F4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Bench Press" />
          <Line type="monotone" dataKey="squat" stroke="#34A853" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Squat" />
          <Line type="monotone" dataKey="deadlift" stroke="#EA4335" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Deadlift" />
        </LineChart>
      </ResponsiveContainer>
    )
  },
  {
    id: 'nutrition',
    title: 'Nutrition Overview',
    subtitle: 'Daily Calorie & Macro Intake',
    icon: <Utensils className="text-[var(--energy)]" size={24} />,
    color: 'var(--energy)',
    chart: (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={nutritionData}>
          <defs>
            <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBBC05" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FBBC05" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="var(--text-muted)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-container)', 
              border: 'none', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Area type="monotone" dataKey="calories" stroke="#FBBC05" fillOpacity={1} fill="url(#colorCal)" strokeWidth={3} name="Calories" />
          <Bar dataKey="protein" fill="#4285F4" radius={[4, 4, 0, 0]} name="Protein" />
        </AreaChart>
      </ResponsiveContainer>
    )
  },
  {
    id: 'cardio',
    title: 'Cardio Performance',
    subtitle: 'Duration vs Avg Heart Rate',
    icon: <Activity className="text-[var(--primary)]" size={24} />,
    color: 'var(--primary)',
    chart: (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={cardioData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="var(--text-muted)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            unit="m"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-container)', 
              border: 'none', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Bar dataKey="duration" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Duration (min)" />
          <Line type="monotone" dataKey="heartRate" stroke="#EA4335" strokeWidth={3} name="Avg HR (bpm)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
];

export const ProgressSlideDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="space-y-8 px-1">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
            <TrendingUp size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Analytics</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] tracking-tight">Progress Deck</h2>
          <p className="text-sm text-[var(--text-muted)] font-bold">Your fitness journey in numbers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="relative overflow-hidden min-h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            <div className="gamified-card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-container)] flex items-center justify-center">
                  {slide.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--text)] tracking-tight">{slide.title}</h3>
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{slide.subtitle}</p>
                </div>
              </div>

              <div className="bg-[var(--surface-container)]/50 rounded-2xl p-4 border border-[var(--outline)]/5">
                {slide.chart}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--outline)]/5">
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Best Performance</p>
                  <p className="text-lg font-black text-[var(--text)]">
                    {currentSlide === 0 ? '140kg Deadlift' : currentSlide === 1 ? '2,800 kcal' : '90m Run'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--outline)]/5">
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Weekly Trend</p>
                  <div className="flex items-center gap-1 text-[#34A853]">
                    <TrendingUp size={14} />
                    <p className="text-lg font-black">+12.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentSlide ? 1 : -1);
              setCurrentSlide(idx);
            }}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === idx ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--outline)]/20'
            }`}
          />
        ))}
      </div>

      <div className="gamified-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
          <Calendar size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-[var(--text)]">Monthly Report Ready</h4>
          <p className="text-xs text-[var(--text-muted)] font-bold">Your detailed March analysis is now available.</p>
        </div>
        <button className="text-[var(--primary)] font-black text-xs uppercase tracking-widest">View</button>
      </div>
    </div>
  );
};
