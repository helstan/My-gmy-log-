import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Activity, Utensils, Quote } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../constants';
import { View } from '../types';

interface HomeViewProps {
  onSelectOption: (view: View) => void;
  userName: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectOption, userName }) => {
  const quote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  const options = [
    {
      id: 'days' as View,
      title: 'Workout',
      description: 'Strength & Muscle Building',
      icon: Dumbbell,
      color: 'bg-[#4285F4]',
      onColor: 'text-white'
    },
    {
      id: 'cardio' as View,
      title: 'Cardio',
      description: 'Endurance & Heart Health',
      icon: Activity,
      color: 'bg-[#34A853]',
      onColor: 'text-white'
    },
    {
      id: 'meals' as View,
      title: 'Meals',
      description: 'Nutrition & Macro Tracking',
      icon: Utensils,
      color: 'bg-[#FBBC05]',
      onColor: 'text-white'
    }
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 py-4">
      <header className="space-y-2">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-[var(--text)]"
        >
          {greeting}, {userName}!
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="m3-card p-6 bg-[var(--secondary-container)] border border-[var(--outline)]/10 relative overflow-hidden"
        >
          <Quote className="absolute -right-4 -top-4 w-24 h-24 text-[var(--on-secondary-container)] opacity-5" />
          <p className="text-sm font-medium italic text-[var(--on-secondary-container)] leading-relaxed relative z-10">
            "{quote}"
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            onClick={() => onSelectOption(option.id)}
            className="m3-card p-6 flex items-center gap-6 text-left hover:scale-[1.02] active:scale-[0.98] transition-all border border-[var(--outline)]/10 group"
          >
            <div className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
              <option.icon size={32} className={option.onColor} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--text)]">{option.title}</h3>
              <p className="text-sm text-[var(--outline)] font-medium">{option.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
