import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, LogOut, Chrome, Facebook, Lock, Eye, EyeOff, Trophy, Flame, Zap, Smartphone, Trash2, History } from 'lucide-react';
import { auth, googleProvider, facebookProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase';
import { UserProfile } from '../types';

interface ProfileProps {
  user: any;
  userProfile: UserProfile;
  onLogin: () => void;
  onLogout: () => void;
  onClearLogs: () => void;
  currentTheme: string;
  onThemeChange: (theme: 'light' | 'dark' | 'ocean' | 'red' | 'pink') => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  userProfile, 
  onLogin, 
  onLogout,
  onClearLogs,
  currentTheme, 
  onThemeChange 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'code'>('phone');

  const handlePhoneAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneStep === 'phone') {
      if (!phoneNumber) return;
      // Simulate sending code
      setPhoneStep('code');
    } else {
      if (!verificationCode) return;
      // Simulate verification
      alert('Phone verified! (Simulation: Verification code accepted)');
      setShowPhoneAuth(false);
      setPhoneStep('phone');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-6 py-10">
        <div className="w-24 h-24 rounded-3xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)] shadow-inner">
          <User size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[var(--text)] tracking-tight">Join the Quest</h2>
          <p className="text-sm text-[var(--text-muted)] font-bold max-w-[280px]">
            Sign in to sync your missions, rewards, and progress across all your devices.
          </p>
        </div>
        
        <form onSubmit={handleEmailAuth} className="w-full space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-bold px-2">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-4 rounded-2xl font-black shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
          </button>
        </form>

        <div className="w-full flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--outline)]/10" />
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Or continue with</span>
          <div className="h-px flex-1 bg-[var(--outline)]/10" />
        </div>
        
        <div className="w-full grid grid-cols-3 gap-3">
          <button 
            onClick={handleGoogleLogin}
            className="flex flex-col items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold shadow-sm border border-gray-200 active:scale-95 transition-all"
          >
            <Chrome size={20} />
            <span className="text-[10px] uppercase tracking-widest">Google</span>
          </button>
          <button 
            onClick={handleFacebookLogin}
            className="flex flex-col items-center justify-center gap-2 bg-[#1877F2] text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
          >
            <Facebook size={20} />
            <span className="text-[10px] uppercase tracking-widest">Facebook</span>
          </button>
          <button 
            onClick={() => setShowPhoneAuth(true)}
            className="flex flex-col items-center justify-center gap-2 bg-[var(--surface-container)] text-[var(--text)] py-4 rounded-2xl font-bold active:scale-95 transition-all"
          >
            <Smartphone size={20} />
            <span className="text-[10px] uppercase tracking-widest">Phone</span>
          </button>
        </div>
        
        <p className="text-[10px] text-[var(--text-muted)] text-center px-8 font-bold uppercase tracking-widest">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>

        <AnimatePresence>
          {showPhoneAuth && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-[var(--surface)] rounded-3xl p-8 shadow-2xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto">
                    <Smartphone size={32} />
                  </div>
                  <h3 className="text-xl font-black text-[var(--text)]">Phone Login</h3>
                  <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
                    {phoneStep === 'phone' ? 'Enter your mobile number' : 'Enter verification code'}
                  </p>
                </div>

                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  {phoneStep === 'phone' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--outline)] uppercase tracking-widest px-1">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--outline)] uppercase tracking-widest px-1">Verification Code</label>
                      <input 
                        type="text" 
                        placeholder="000000" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full bg-[var(--surface-container)] border border-[var(--outline)]/10 rounded-2xl px-4 py-4 text-sm font-bold text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        required
                      />
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-4 rounded-2xl font-black shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all"
                  >
                    {phoneStep === 'phone' ? 'Send Code' : 'Verify & Login'}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowPhoneAuth(false)}
                    className="w-full text-xs font-black text-[var(--text-muted)] uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1">
      <header>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <User size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Account</span>
        </div>
        <h2 className="text-3xl font-black text-[var(--text)] tracking-tight">Your Profile</h2>
      </header>

      <div className="gamified-card p-6 flex flex-col items-center space-y-4">
        <div className="relative">
          <img 
            src={userProfile.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-[var(--primary)]/10"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg border-2 border-[var(--surface)]">
            <Shield size={14} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-[var(--text)] tracking-tight">{userProfile.displayName || user.displayName || 'User'}</h3>
          <p className="text-sm text-[var(--text-muted)] font-bold">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="gamified-card p-4 flex flex-col items-center justify-center space-y-1">
          <Trophy size={20} className="text-[var(--power)]" />
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Level</p>
          <p className="text-lg font-black text-[var(--text)]">{userProfile.level}</p>
        </div>
        <div className="gamified-card p-4 flex flex-col items-center justify-center space-y-1">
          <Zap size={20} className="text-[var(--energy)]" />
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">XP</p>
          <p className="text-lg font-black text-[var(--text)]">{userProfile.xp}</p>
        </div>
        <div className="gamified-card p-4 flex flex-col items-center justify-center space-y-1">
          <Flame size={20} className="text-[var(--primary)]" />
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Streak</p>
          <p className="text-lg font-black text-[var(--text)]">{userProfile.streak}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">App Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'light', label: 'Light Mode', color: '#FFFFFF', border: '#DADCE0' },
            { id: 'dark', label: 'Dark Mode', color: '#0F172A', border: '#475569' },
            { id: 'ocean', label: 'Ocean Calm', color: '#009688', border: '#004D40' },
            { id: 'red', label: 'Aggressive Red', color: '#E53E3E', border: '#C53030' },
            { id: 'pink', label: 'Pink Power', color: '#ED64A6', border: '#D53F8C' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id as any)}
              className={`gamified-card p-4 flex flex-col items-center gap-2 border-2 transition-all ${
                currentTheme === t.id ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-transparent'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full border shadow-sm" 
                style={{ backgroundColor: t.color, borderColor: t.border }}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text)]">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">Integrations</h3>
        <div className="gamified-card p-4 flex items-center gap-4 group cursor-pointer hover:border-[var(--primary)]/30">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <Zap size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[var(--text)]">Connect Fitness Watch</p>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Apple Watch, Garmin, Fitbit</p>
          </div>
          <div className="px-3 py-1 bg-[var(--surface-container)] rounded-full text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
            Coming Soon
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">Account Details</h3>
        <div className="gamified-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)]">
            <Mail size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Email Address</p>
            <p className="text-sm font-bold text-[var(--text)]">{user.email}</p>
          </div>
        </div>

        <div className="gamified-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--text-muted)]">
            <Shield size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Account Status</p>
            <p className="text-sm font-bold text-[var(--text)]">Verified Member</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to clear ALL activity logs? This will reset your history, meals, and cardio data but keep your level and XP.')) {
              onClearLogs();
            }
          }}
          className="w-full flex items-center justify-center gap-3 text-[var(--text)] py-4 rounded-2xl font-black bg-[var(--surface-container)] hover:bg-[var(--primary)]/10 active:scale-95 transition-all border border-[var(--outline)]/10"
        >
          <History size={20} className="text-[var(--primary)]" />
          Clear Activity Logs
        </button>

        <button 
          onClick={() => {
            if (confirm('Are you sure you want to erase ALL your data? This will reset your level, XP, and all logs. This cannot be undone.')) {
              onLogout(); // This now clears storage and reloads
            }
          }}
          className="w-full flex items-center justify-center gap-3 text-[var(--outline)] py-4 rounded-2xl font-black bg-[var(--surface-container)] hover:bg-[var(--outline)]/10 active:scale-95 transition-all"
        >
          <Trash2 size={20} />
          Reset App Data
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 text-[#EA4335] py-4 rounded-2xl font-black bg-[#EA4335]/5 hover:bg-[#EA4335]/10 active:scale-95 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
