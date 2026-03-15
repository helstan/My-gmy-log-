import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Dumbbell, 
  Activity, 
  Utensils, 
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle2
} from 'lucide-react';

export const Tutorial: React.FC = () => {
  const steps = [
    {
      title: 'Track Your Workouts',
      description: 'Choose from pre-defined splits or create your own custom routines. Log every set, rep, and weight to see your strength grow.',
      icon: Dumbbell,
      color: 'bg-[#4285F4]'
    },
    {
      title: 'Monitor Cardio',
      description: 'Log your runs, cycles, or HIIT sessions. Track duration, distance, and calories burned to improve your endurance.',
      icon: Activity,
      color: 'bg-[#34A853]'
    },
    {
      title: 'Nutrition & Meals',
      description: 'Keep a daily log of what you eat. Track your macros (protein, carbs, fats) to ensure you are fueling your body correctly.',
      icon: Utensils,
      color: 'bg-[#FBBC05]'
    },
    {
      title: 'Analyze Progress',
      description: 'Use our visual charts to see your consistency and PR growth over weeks and months.',
      icon: TrendingUp,
      color: 'bg-[var(--primary)]'
    }
  ];

  return (
    <div className="space-y-8 px-1">
      <header>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <HelpCircle size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Guide</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">How it Works</h2>
      </header>

      <div className="m3-card p-6 bg-[var(--primary)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-bold">Quick Start Video</h3>
          <p className="text-sm text-white/80">Watch a 2-minute overview of all features and how to get the most out of GymFlow.</p>
          <button className="flex items-center gap-2 bg-white text-[var(--primary)] px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all">
            <Play size={16} fill="currentColor" />
            Watch Now
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[var(--outline)] uppercase tracking-widest px-1">Feature Overview</h3>
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="m3-card p-5 border border-[var(--outline)]/10 flex gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                <step.icon size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--text)]">{step.title}</h4>
                <p className="text-xs text-[var(--outline)] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="m3-card p-6 border border-[var(--outline)]/10 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text)]">Pro Tips</h3>
        <ul className="space-y-3">
          {[
            'Long-press a workout to edit its name',
            'Swipe left on a log to delete it',
            'Tap on a progress chart to see exact values',
            'Set daily goals in the Profile section'
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-[var(--outline)]">
              <CheckCircle2 size={14} className="text-[var(--primary)] shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
