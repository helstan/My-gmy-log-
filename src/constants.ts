import { WorkoutDay } from './types';

export const WORKOUT_SPLIT: WorkoutDay[] = [
  {
    id: 1,
    name: 'Pull (Back)',
    accentColor: '#6366f1', // Indigo
    groups: [
      {
        name: 'Lats/Width',
        count: 5,
        pool: ['Lat Pulldown', 'Pull-Ups', 'Wide Grip Cable Row', 'Straight Arm Pulldown', 'Incline Dumbbell Row'],
      },
      {
        name: 'Thickness',
        count: 2,
        pool: ['Barbell Row', 'Seated Cable Row', 'T-Bar Row', 'Chest Supported Row', 'Dumbbell Row'],
      },
      {
        name: 'Upper Back',
        count: 1,
        pool: ['Face Pulls', 'Rear Delt Fly', 'Band Pull Apart', 'Shrugs', 'High Row'],
      },
      {
        name: 'Forearms',
        count: 1,
        pool: ['Wrist Curl', 'Reverse Wrist Curl', 'Hammer Curl', 'Plate Pinch', 'Dead Hang'],
      },
    ],
  },
  {
    id: 2,
    name: 'Push (Chest & Shoulders)',
    accentColor: '#ff2e63', // Passion Red
    groups: [
      {
        name: 'Chest',
        count: 4,
        pool: ['Flat Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Dips', 'Push-Up', 'Decline Bench Press', 'Pec Deck'],
      },
      {
        name: 'Shoulders',
        count: 2,
        pool: ['Overhead Press', 'Lateral Raise', 'Arnold Press', 'Front Raise', 'Machine Shoulder Press'],
      },
      {
        name: 'Triceps',
        count: 1,
        pool: ['Tricep Pushdown', 'Skull Crushers', 'Overhead Tricep Extension', 'Close Grip Bench'],
      },
    ],
  },
  {
    id: 3,
    name: 'Legs (Heavy)',
    accentColor: '#00f260', // Energy Green
    groups: [
      {
        name: 'Quads',
        count: 3,
        pool: ['Squat', 'Leg Press', 'Hack Squat', 'Bulgarian Split Squat', 'Leg Extension'],
      },
      {
        name: 'Hamstrings',
        count: 2,
        pool: ['Romanian Deadlift', 'Lying Leg Curl', 'Seated Leg Curl', 'Nordic Curl', 'Good Morning'],
      },
      {
        name: 'Calves',
        count: 1,
        pool: ['Standing Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise'],
      },
      {
        name: 'Abs',
        count: 1,
        pool: ['Cable Crunch', 'Hanging Leg Raise', 'Plank', 'Ab Wheel'],
      },
    ],
  },
  {
    id: 4,
    name: 'Arms & Calisthenics',
    accentColor: '#f7971e', // Motivation Orange
    groups: [
      {
        name: 'Calisthenics',
        count: 3,
        pool: ['Push-Ups', 'Pull-Ups', 'Diamond Push-Ups', 'Wide Pull-Ups', 'Dips'],
      },
      {
        name: 'Shoulders',
        count: 2,
        pool: ['Lateral Raise', 'Face Pulls', 'Cable Lateral Raise', 'Rear Delt Fly'],
      },
      {
        name: 'Biceps',
        count: 3,
        pool: ['Barbell Curl', 'Incline Dumbbell Curl', 'Cable Curl', 'Hammer Curl', 'Concentration Curl'],
      },
      {
        name: 'Triceps',
        count: 3,
        pool: ['Overhead Extension', 'Tricep Pushdown', 'Skull Crushers', 'Close Grip Push-Up', 'Kickback'],
      },
      {
        name: 'Forearms',
        count: 2,
        pool: ['Wrist Curl', 'Reverse Curl', 'Farmer\'s Carry', 'Dead Hang'],
      },
    ],
  },
  {
    id: 5,
    name: 'Legs (Volume)',
    accentColor: '#9d50bb', // Power Purple
    groups: [
      {
        name: 'Quads',
        count: 1,
        pool: ['Leg Extension', 'Front Squat', 'Walking Lunges'],
      },
      {
        name: 'Hamstrings',
        count: 1,
        pool: ['Seated Leg Curl', 'Stiff Leg Deadlift', 'Nordic Curl'],
      },
      {
        name: 'Calves',
        count: 2,
        pool: ['Seated Calf Raise', 'Standing Calf Raise', 'Single Leg Calf Raise'],
      },
      {
        name: 'Abs',
        count: 3,
        pool: ['Hanging Leg Raise', 'Cable Crunch', 'Ab Wheel', 'Russian Twist', 'Dragon Flag'],
      },
    ],
  },
];
