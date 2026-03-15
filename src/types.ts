import { LucideIcon } from 'lucide-react';

export type MuscleGroup = 'Lats/Width' | 'Thickness' | 'Upper Back' | 'Forearms' | 'Chest' | 'Shoulders' | 'Triceps' | 'Quads' | 'Hamstrings' | 'Calves' | 'Abs' | 'Calisthenics' | 'Biceps';

export type ExerciseType = 'strength' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup | 'Cardio';
  type: ExerciseType;
}

export interface WorkoutDay {
  id: string | number;
  name: string;
  accentColor: string;
  groups: {
    name: string;
    count: number;
    pool: string[];
  }[];
}

export interface SetEntry {
  id: string;
  weight?: number;
  reps?: number;
  rpe?: number;
  isLbs?: boolean;
  // Cardio fields
  duration?: number; // in seconds
  distance?: number; // in km or miles
  intensity?: number; // 1-10 scale or heart rate
  calories?: number;
}

export interface ActiveExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: SetEntry[];
  isLbs: boolean;
  targetTime?: number; // in seconds
  actualTime?: number; // in seconds
  isCompleted?: boolean;
  startTime?: number; // timestamp
}

export interface CompletedWorkout {
  id: string;
  workoutDayId: string | number;
  workoutName: string;
  date: string; // ISO string
  duration: number; // minutes
  exercises: ActiveExercise[];
  notes: string;
  photo?: string; // Base64 string
}

export interface PersonalRecord {
  exerciseName: string;
  bestVolume: number; // in kg
  date: string;
}

export type View = 'home' | 'days' | 'history' | 'prs' | 'active' | 'charts' | 'metrics' | 'cardio' | 'meals';

export interface BodyMetrics {
  id: string;
  date: string;
  weight: number; // in kg
  height: number; // in cm
  waist: number; // in cm
  hip: number; // in cm
  bmi: number;
  waistToHip: number;
}

export interface MealLog {
  id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  name: string;
}

export interface CardioLog {
  id: string;
  date: string;
  exerciseName: string;
  distance?: number;
  speed?: number;
  duration: number; // in seconds
  calories?: number;
  notes?: string;
}
