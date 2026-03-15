import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, LogOut, LogIn, Github, Chrome } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';

interface ProfileProps {
  user: any;
  onLogin: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogin }) => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-6">
        <div className="w-24 h-24 rounded-3xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)]">
          <User size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text)]">Join GymFlow</h2>
          <p className="text-sm text-[var(--outline)] max-w-[280px]">
            Sign in to sync your workouts, meals, and progress across all your devices.
          </p>
        </div>
        
        <div className="w-full space-y-3">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold shadow-sm border border-gray-200 active:scale-95 transition-all"
          >
            <Chrome size={20} />
            Continue with Google
          </button>
          <button 
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
          >
            <Github size={20} />
            Continue with GitHub
          </button>
        </div>
        
        <p className="text-[10px] text-[var(--outline)] text-center px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1">
      <header>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <User size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Account</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Your Profile</h2>
      </header>

      <div className="m3-card p-6 border border-[var(--outline)]/10 flex flex-col items-center space-y-4">
        <div className="relative">
          <img 
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-[var(--primary)]/10"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg border-2 border-[var(--surface)]">
            <Shield size={14} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-[var(--text)]">{user.displayName || 'User'}</h3>
          <p className="text-sm text-[var(--outline)]">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="m3-card p-4 border border-[var(--outline)]/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)]">
            <Mail size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[var(--outline)] uppercase">Email Address</p>
            <p className="text-sm font-bold text-[var(--text)]">{user.email}</p>
          </div>
        </div>

        <div className="m3-card p-4 border border-[var(--outline)]/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)]">
            <Shield size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[var(--outline)] uppercase">Account Status</p>
            <p className="text-sm font-bold text-[var(--text)]">Verified Member</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 text-[#EA4335] py-4 rounded-2xl font-bold bg-[#EA4335]/5 hover:bg-[#EA4335]/10 active:scale-95 transition-all"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};
