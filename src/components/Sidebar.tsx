import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Activity, 
  Utensils, 
  User, 
  HelpCircle, 
  LogOut, 
  X,
  Home,
  ChevronRight
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
  user: any;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  currentView, 
  onNavigate, 
  user, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'workout', label: 'Workouts', icon: Dumbbell },
    { id: 'cardio', label: 'Cardio', icon: Activity },
    { id: 'meals', label: 'Nutrition', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tutorial', label: 'Tutorial', icon: HelpCircle },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--surface)] border-r border-[var(--outline)]/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">GymFlow</h2>
                  <p className="text-[10px] font-bold text-[var(--outline)] uppercase tracking-widest">Premium</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--surface-container)] text-[var(--outline)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Summary */}
            {user && (
              <div className="px-6 py-4 border-y border-[var(--outline)]/5 flex items-center gap-3">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-[var(--primary)]/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--text)] truncate">{user.displayName || 'User'}</p>
                  <p className="text-[10px] font-bold text-[var(--outline)] truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id as View);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                      isActive 
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]' 
                        : 'text-[var(--outline)] hover:bg-[var(--surface-container)] hover:text-[var(--text)]'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-[var(--primary)]' : 'group-hover:text-[var(--primary)] transition-colors'} />
                    <span className="flex-1 text-left text-sm font-bold">{item.label}</span>
                    {isActive && <ChevronRight size={16} />}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--outline)]/10">
              {user ? (
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#EA4335] hover:bg-[#EA4335]/10 transition-colors font-bold text-sm"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    onNavigate('profile');
                    onClose();
                  }}
                  className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
