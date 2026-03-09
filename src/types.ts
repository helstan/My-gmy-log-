import { LucideIcon } from 'lucide-react';

export type MuscleGroup = 'Lats/Width' | 'Thickness' | 'Upper Back' | 'Forearms' | 'Chest' | 'Shoulders' | 'Triceps' | 'Quads' | 'Hamstrings' | 'Calves' | 'Abs' | 'Calisthenics' | 'Biceps';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
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
  weight: number;
  reps: number;
  rpe: number;
  isLbs: boolean;
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

export type View = 'days' | 'history' | 'prs' | 'active' | 'charts';

export interface StorageData {
  history: CompletedWorkout[];
  prs: PersonalRecord[];
  gymDays: string[];
  customWorkouts: WorkoutDay[];
  customExercises: string[];
}
