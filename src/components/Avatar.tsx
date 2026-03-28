import React from 'react';

interface AvatarProps {
  seed: string;
  mood?: 'happy' | 'tired' | 'celebrating' | 'neutral';
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ seed, mood = 'neutral', size = 80, className = '' }) => {
  // Using DiceBear Avataaars
  // Mood-based seeds
  const moodSeed = mood === 'happy' ? `${seed}-happy` : mood === 'tired' ? `${seed}-tired` : mood === 'celebrating' ? `${seed}-celebrating` : seed;
  const baseUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${moodSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  
  return (
    <div 
      className={`relative rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={baseUrl} 
        alt="User Avatar" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
