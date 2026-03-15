import { 
  CompletedWorkout, 
  PersonalRecord, 
  WorkoutDay, 
  ActiveExercise, 
  BodyMetrics, 
  MealLog, 
  CardioLog,
  DailyGoals,
  CardioWorkout
} from './types';
import { WORKOUT_SPLIT } from './constants';

export const DEFAULT_GOALS: DailyGoals = {
  caloriesBurned: 100,
  caloriesConsumed: 2000,
  protein: 150,
  carbs: 250,
  fats: 70
};

export const generateDemoData = () => {
  const history: CompletedWorkout[] = [];
  const prs: PersonalRecord[] = [];
  const gymDays: string[] = [];

  const today = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  let currentDay = new Date(twoMonthsAgo);
  let workoutIndex = 0;

  while (currentDay <= today) {
    const dayOfWeek = currentDay.getDay();
    // Skip Sundays (0) and randomly skip 25% of other days
    if (dayOfWeek !== 0 && Math.random() > 0.25) {
      const dateStr = currentDay.toISOString().split('T')[0];
      gymDays.push(dateStr);

      const workoutDay = WORKOUT_SPLIT[workoutIndex % 5];
      const exercises = workoutDay.groups.flatMap(group => {
        // Pick 'count' random exercises from pool
        const shuffled = [...group.pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, group.count).map(name => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          muscleGroup: group.name,
          isLbs: false,
          sets: Array.from({ length: 3 }, (_, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            weight: Math.floor(Math.random() * 60) + 20,
            reps: Math.floor(Math.random() * 5) + 8,
            rpe: 8,
            isLbs: false,
          })),
        }));
      });

      history.push({
        id: Math.random().toString(36).substr(2, 9),
        workoutDayId: workoutDay.id,
        workoutName: workoutDay.name,
        date: currentDay.toISOString(),
        duration: Math.floor(Math.random() * 30) + 45,
        exercises: exercises as any,
        notes: 'Great session, felt strong today.',
      });

      workoutIndex++;
    }
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // Generate PRs from history
  const exerciseMap = new Map<string, { volume: number; date: string }>();
  history.forEach(workout => {
    workout.exercises.forEach(ex => {
      const maxVolume = ex.sets.reduce((max, set) => Math.max(max, set.weight * set.reps), 0);
      const existing = exerciseMap.get(ex.name);
      if (!existing || maxVolume > existing.volume) {
        exerciseMap.set(ex.name, { volume: maxVolume, date: workout.date });
      }
    });
  });

  exerciseMap.forEach((val, key) => {
    prs.push({ exerciseName: key, bestVolume: val.volume, date: val.date });
  });

  prs.sort((a, b) => b.bestVolume - a.bestVolume);

  return { history: history.reverse(), prs, gymDays };
};

export interface StorageData {
  history: CompletedWorkout[];
  prs: PersonalRecord[];
  gymDays: string[];
  customWorkouts: WorkoutDay[];
  customExercises: string[];
  bodyMetrics: BodyMetrics[];
  mealLogs: MealLog[];
  cardioLogs: CardioLog[];
  activeWorkout?: WorkoutDay | null;
  activeExercises?: ActiveExercise[];
  dailyGoals: DailyGoals;
  customCardioWorkouts: CardioWorkout[];
}

export const getStorageData = (): StorageData => {
  const history = localStorage.getItem('gym_history');
  const prs = localStorage.getItem('gym_prs');
  const gymDays = localStorage.getItem('gym_days');
  const customWorkouts = localStorage.getItem('gym_custom_workouts');
  const customExercises = localStorage.getItem('gym_custom_exercises');
  const bodyMetrics = localStorage.getItem('gym_body_metrics');
  const mealLogs = localStorage.getItem('gym_meal_logs');
  const cardioLogs = localStorage.getItem('gym_cardio_logs');
  const activeWorkout = localStorage.getItem('gym_active_workout');
  const activeExercises = localStorage.getItem('gym_active_exercises');
  const dailyGoals = localStorage.getItem('gym_daily_goals');
  const customCardioWorkouts = localStorage.getItem('gym_custom_cardio_workouts');

  // Only generate demo data if history is completely empty/missing
  if (!history) {
    const demo = generateDemoData();
    const initialData: StorageData = {
      ...demo,
      customWorkouts: [],
      customExercises: [],
      bodyMetrics: [],
      mealLogs: [],
      cardioLogs: [],
      activeWorkout: null,
      activeExercises: [],
      dailyGoals: DEFAULT_GOALS,
      customCardioWorkouts: []
    };
    saveStorageData(
      initialData.history, 
      initialData.prs, 
      initialData.gymDays, 
      [], [], [], [], [], null, [], DEFAULT_GOALS, []
    );
    return initialData;
  }

  return {
    history: JSON.parse(history) as CompletedWorkout[],
    prs: prs ? JSON.parse(prs) : [],
    gymDays: gymDays ? JSON.parse(gymDays) : [],
    customWorkouts: customWorkouts ? JSON.parse(customWorkouts) : [],
    customExercises: customExercises ? JSON.parse(customExercises) : [],
    bodyMetrics: bodyMetrics ? JSON.parse(bodyMetrics) : [],
    mealLogs: mealLogs ? JSON.parse(mealLogs) : [],
    cardioLogs: cardioLogs ? JSON.parse(cardioLogs) : [],
    activeWorkout: activeWorkout ? JSON.parse(activeWorkout) : null,
    activeExercises: activeExercises ? JSON.parse(activeExercises) : [],
    dailyGoals: dailyGoals ? JSON.parse(dailyGoals) : DEFAULT_GOALS,
    customCardioWorkouts: customCardioWorkouts ? JSON.parse(customCardioWorkouts) : []
  };
};

export const saveStorageData = (
  history: any[], 
  prs: any[], 
  gymDays: string[],
  customWorkouts: any[] = [],
  customExercises: string[] = [],
  bodyMetrics: any[] = [],
  mealLogs: any[] = [],
  cardioLogs: any[] = [],
  activeWorkout: any = null,
  activeExercises: any[] = [],
  dailyGoals: DailyGoals = DEFAULT_GOALS,
  customCardioWorkouts: CardioWorkout[] = []
) => {
  localStorage.setItem('gym_history', JSON.stringify(history));
  localStorage.setItem('gym_prs', JSON.stringify(prs));
  localStorage.setItem('gym_days', JSON.stringify(gymDays));
  localStorage.setItem('gym_custom_workouts', JSON.stringify(customWorkouts));
  localStorage.setItem('gym_custom_exercises', JSON.stringify(customExercises));
  localStorage.setItem('gym_body_metrics', JSON.stringify(bodyMetrics));
  localStorage.setItem('gym_meal_logs', JSON.stringify(mealLogs));
  localStorage.setItem('gym_cardio_logs', JSON.stringify(cardioLogs));
  localStorage.setItem('gym_active_workout', JSON.stringify(activeWorkout));
  localStorage.setItem('gym_active_exercises', JSON.stringify(activeExercises));
  localStorage.setItem('gym_daily_goals', JSON.stringify(dailyGoals));
  localStorage.setItem('gym_custom_cardio_workouts', JSON.stringify(customCardioWorkouts));
};
