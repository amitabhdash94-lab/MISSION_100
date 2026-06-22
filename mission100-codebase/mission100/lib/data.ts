import type {
  UserProfile,
  DaySchedule,
  WorkoutPlan,
  WeightMilestone,
  WeeklyScore,
  ProgressEntry,
  NutritionDay,
} from "@/types";

// ─── Default User ─────────────────────────────────────────────────────────────

export const DEFAULT_USER: UserProfile = {
  id: "user-1",
  name: "Vikram",
  heightCm: 175,
  currentWeightKg: 119.8,
  targetWeightKg: 90,
  targetDate: "2027-05-30",
  bodyFatPercent: 34.8,
  leanMassKg: 78.1,
  bmr: 2058,
  proteinTargetG: 160,
  calorieRanges: {
    travelDay: [2100, 2200],
    weekdayStrength: [2200, 2300],
    weekendStrengthOrBadminton: [2300, 2500],
    weekendRest: [2100, 2300],
  },
  injuryFlags: [],
  preferredActivities: ["badminton", "table-tennis"],
  dietaryPreferences: ["indian", "vegetarian-friendly"],
  trackingMode: "both",
  weekStartDate: "2026-06-22",
  onboardingComplete: true,
};

// ─── Weekly Schedule ──────────────────────────────────────────────────────────

export const DEFAULT_WEEK_SCHEDULE: DaySchedule[] = [
  {
    dayOfWeek: 1, // Monday
    dayType: "travel-recovery",
    location: "airport",
    isTravelDay: true,
    foodMode: "travel-airport",
    stepTarget: 6000,
    calorieTarget: [2100, 2200],
    workoutAvailable: false,
    label: "Travel Recovery",
    sublabel: "7 AM flight · Ahmedabad arrival ~7 PM",
  },
  {
    dayOfWeek: 2, // Tuesday
    dayType: "strength",
    location: "ahmedabad-hotel",
    isTravelDay: false,
    workStartTime: "09:30",
    foodMode: "hotel-buffet",
    stepTarget: 8000,
    calorieTarget: [2200, 2300],
    workoutAvailable: true,
    label: "Strength A",
    sublabel: "Full-body · Hotel gym · 45 min",
  },
  {
    dayOfWeek: 3, // Wednesday
    dayType: "cardio",
    location: "ahmedabad-hotel",
    isTravelDay: false,
    workStartTime: "09:30",
    foodMode: "client-meal",
    stepTarget: 9000,
    calorieTarget: [2200, 2300],
    workoutAvailable: true,
    label: "Cardio + Mobility",
    sublabel: "35 min walk or elliptical · 10 min mobility",
  },
  {
    dayOfWeek: 4, // Thursday
    dayType: "strength",
    location: "ahmedabad-hotel",
    isTravelDay: false,
    workStartTime: "09:30",
    foodMode: "client-meal",
    stepTarget: 8000,
    calorieTarget: [2200, 2300],
    workoutAvailable: true,
    label: "Strength B",
    sublabel: "Full-body · Hotel gym · 45 min",
  },
  {
    dayOfWeek: 5, // Friday
    dayType: "rest",
    location: "airport",
    isTravelDay: true,
    foodMode: "travel-airport",
    stepTarget: 6000,
    calorieTarget: [2100, 2200],
    workoutAvailable: false,
    label: "Complete Rest",
    sublabel: "Early checkout · Travel to Bangalore",
  },
  {
    dayOfWeek: 6, // Saturday
    dayType: "strength",
    location: "bangalore-home",
    isTravelDay: false,
    foodMode: "home-food",
    stepTarget: 8000,
    calorieTarget: [2300, 2500],
    workoutAvailable: true,
    label: "Strength C",
    sublabel: "Home gym or CultPass · 55 min",
  },
  {
    dayOfWeek: 0, // Sunday
    dayType: "badminton",
    location: "bangalore-home",
    isTravelDay: false,
    foodMode: "home-relaxed",
    stepTarget: 10000,
    calorieTarget: [2300, 2500],
    workoutAvailable: true,
    label: "Badminton",
    sublabel: "~2 hours · Warm-up included",
  },
];

// ─── Workout Plans ────────────────────────────────────────────────────────────

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "strength-a",
    name: "Full-body Strength A",
    durationMin: 40,
    durationMax: 50,
    warmup: [
      { id: "w1", name: "Cat-cow", sets: 1, repsMin: 8, repsMax: 8, restSeconds: 0, requiresEquipment: false },
      { id: "w2", name: "Hip flexor stretch", sets: 2, repsMin: 30, repsMax: 30, restSeconds: 0, notes: "30 sec/side", requiresEquipment: false },
      { id: "w3", name: "Bodyweight good mornings", sets: 1, repsMin: 12, repsMax: 12, restSeconds: 0, requiresEquipment: false },
    ],
    exercises: [
      { id: "a1", name: "Leg press or goblet squat", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "a1b" },
      { id: "a1b", name: "Goblet squat (bodyweight)", sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "a2", name: "Chest press / dumbbell bench", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "a2b" },
      { id: "a2b", name: "Push-up", sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "a3", name: "Seated cable row", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "a3b" },
      { id: "a3b", name: "Resistance band row", sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "a4", name: "Romanian deadlift", sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90, requiresEquipment: true, substituteId: "a4b" },
      { id: "a4b", name: "Single-leg hip hinge (bodyweight)", sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60, requiresEquipment: false },
      { id: "a5", name: "Lat pulldown", sets: 2, repsMin: 10, repsMax: 12, restSeconds: 75, requiresEquipment: true, substituteId: "a5b" },
      { id: "a5b", name: "Inverted row", sets: 2, repsMin: 8, repsMax: 12, restSeconds: 60, requiresEquipment: false },
      { id: "a6", name: "Plank", sets: 3, repsMin: 20, repsMax: 40, restSeconds: 45, notes: "seconds", requiresEquipment: false },
    ],
    fallback: {
      name: "CultPass Strength Session",
      description: "35–40 minute low-impact strength via CultPass Home",
    },
  },
  {
    id: "strength-b",
    name: "Full-body Strength B",
    durationMin: 40,
    durationMax: 50,
    exercises: [
      { id: "b1", name: "Split squat / leg press", sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90, requiresEquipment: true, substituteId: "b1b" },
      { id: "b1b", name: "Reverse lunge (bodyweight)", sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60, requiresEquipment: false },
      { id: "b2", name: "Dumbbell shoulder press", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "b2b" },
      { id: "b2b", name: "Pike push-up", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 60, requiresEquipment: false },
      { id: "b3", name: "Lat pulldown", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "b3b" },
      { id: "b3b", name: "Towel row (bodyweight)", sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "b4", name: "Hip thrust or glute bridge", sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75, requiresEquipment: false },
      { id: "b5", name: "Incline dumbbell press", sets: 2, repsMin: 10, repsMax: 12, restSeconds: 75, requiresEquipment: true, substituteId: "b5b" },
      { id: "b5b", name: "Incline push-up", sets: 2, repsMin: 12, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "b6", name: "Cable / dumbbell row", sets: 2, repsMin: 10, repsMax: 12, restSeconds: 75, requiresEquipment: true },
      { id: "b7", name: "Dead bug", sets: 3, repsMin: 8, repsMax: 8, restSeconds: 45, notes: "8 reps/side", requiresEquipment: false },
    ],
    fallback: {
      name: "CultPass Strength Session",
      description: "35–40 minute low-impact strength via CultPass Home",
    },
  },
  {
    id: "strength-c",
    name: "Full-body Strength C",
    durationMin: 50,
    durationMax: 60,
    exercises: [
      { id: "c1", name: "Squat or leg press", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "c1b" },
      { id: "c1b", name: "Goblet squat (bodyweight)", sets: 4, repsMin: 12, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "c2", name: "Chest press", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true, substituteId: "c2b" },
      { id: "c2b", name: "Push-up", sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, requiresEquipment: false },
      { id: "c3", name: "Dumbbell row", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true },
      { id: "c4", name: "Romanian deadlift", sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90, requiresEquipment: true, substituteId: "c4b" },
      { id: "c4b", name: "Single-leg hip hinge", sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60, requiresEquipment: false },
      { id: "c5", name: "Lat pulldown", sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, requiresEquipment: true },
      { id: "c6", name: "Farmer carry", sets: 3, repsMin: 30, repsMax: 40, restSeconds: 60, notes: "metres", requiresEquipment: true, substituteId: "c6b" },
      { id: "c6b", name: "Loaded carry (shopping bags)", sets: 3, repsMin: 20, repsMax: 30, restSeconds: 60, requiresEquipment: false },
      { id: "c7", name: "Plank + dead bug superset", sets: 3, repsMin: 8, repsMax: 8, restSeconds: 45, notes: "8 reps/side", requiresEquipment: false },
    ],
    fallback: {
      name: "CultPass Strength Session",
      description: "Beginner or intermediate strength session · Low-impact functional training",
    },
  },
  {
    id: "cardio",
    name: "Cardio + Mobility",
    durationMin: 40,
    durationMax: 50,
    exercises: [
      { id: "d1", name: "Brisk walk / elliptical / cycling", sets: 1, repsMin: 30, repsMax: 40, restSeconds: 0, notes: "minutes · conversational pace", requiresEquipment: false },
      { id: "d2", name: "Hip flexor stretch", sets: 2, repsMin: 30, repsMax: 30, restSeconds: 0, notes: "30 sec/side", requiresEquipment: false },
      { id: "d3", name: "Cat-cow", sets: 1, repsMin: 10, repsMax: 10, restSeconds: 0, requiresEquipment: false },
      { id: "d4", name: "Bodyweight good mornings", sets: 1, repsMin: 12, repsMax: 12, restSeconds: 0, requiresEquipment: false },
      { id: "d5", name: "Wall shoulder slides", sets: 1, repsMin: 10, repsMax: 10, restSeconds: 0, requiresEquipment: false },
      { id: "d6", name: "Calf stretch", sets: 2, repsMin: 30, repsMax: 30, restSeconds: 0, notes: "30 sec/side", requiresEquipment: false },
    ],
    fallback: {
      name: "Outdoor Walk",
      description: "30–40 minute walk at conversational pace",
    },
  },
  {
    id: "mobility",
    name: "Travel Recovery",
    durationMin: 10,
    durationMax: 15,
    exercises: [
      { id: "m1", name: "Cat-cow", sets: 1, repsMin: 8, repsMax: 8, restSeconds: 0, requiresEquipment: false },
      { id: "m2", name: "Hip flexor stretch", sets: 2, repsMin: 30, repsMax: 30, restSeconds: 0, notes: "30 sec/side", requiresEquipment: false },
      { id: "m3", name: "Bodyweight good mornings", sets: 1, repsMin: 12, repsMax: 12, restSeconds: 0, requiresEquipment: false },
      { id: "m4", name: "Wall shoulder slides", sets: 1, repsMin: 10, repsMax: 10, restSeconds: 0, requiresEquipment: false },
      { id: "m5", name: "Calf stretch", sets: 2, repsMin: 30, repsMax: 30, restSeconds: 0, notes: "30 sec/side", requiresEquipment: false },
    ],
    fallback: {
      name: "5-minute mobility",
      description: "Focus on hips and shoulders after long travel",
    },
  },
  {
    id: "badminton",
    name: "Badminton",
    durationMin: 120,
    durationMax: 120,
    exercises: [
      { id: "bad1", name: "Dynamic warm-up", sets: 1, repsMin: 8, repsMax: 8, restSeconds: 0, notes: "leg swings, arm circles, light jogging", requiresEquipment: false },
      { id: "bad2", name: "Knee + ankle pain check", sets: 1, repsMin: 1, repsMax: 1, restSeconds: 0, notes: "Check before starting hard play", requiresEquipment: false },
      { id: "bad3", name: "Game play", sets: 1, repsMin: 90, repsMax: 90, restSeconds: 0, notes: "minutes · moderate first 20 min", requiresEquipment: false },
    ],
    fallback: {
      name: "Active recovery walk",
      description: "45–60 minute relaxed walk or table tennis",
    },
  },
  {
    id: "rest",
    name: "Complete Rest",
    durationMin: 0,
    durationMax: 0,
    exercises: [],
    fallback: {
      name: "Rest Day",
      description: "Hydration, protein-led meals, and light walking only",
    },
  },
];

// ─── Weight Milestones ────────────────────────────────────────────────────────

export const WEIGHT_MILESTONES: WeightMilestone[] = [
  { date: "2026-06-22", label: "Start", rangeMin: 119.8, rangeMax: 119.8, achieved: true },
  { date: "2026-08-31", label: "Aug 2026", rangeMin: 114, rangeMax: 116 },
  { date: "2026-10-31", label: "Oct 2026", rangeMin: 109, rangeMax: 112 },
  { date: "2026-12-31", label: "Dec 2026", rangeMin: 104, rangeMax: 108 },
  { date: "2027-02-28", label: "Feb 2027", rangeMin: 98, rangeMax: 103 },
  { date: "2027-05-30", label: "May 2027 ✦", rangeMin: 89, rangeMax: 94 },
];

// ─── Sample Progress Data ─────────────────────────────────────────────────────

export const SAMPLE_PROGRESS: ProgressEntry[] = [
  { id: "p1", date: "2026-06-22", weightKg: 119.8, steps: 6200, energyLevel: 3, sleepHours: 7 },
];

export const SAMPLE_WEEKLY_SCORE: WeeklyScore = {
  weekStart: "2026-06-22",
  strengthSessions: 0,
  nutritionDays: 0,
  avgSteps: 6200,
  travelDaysControlled: 0,
  recoveryScore: 7,
  checkedIn: false,
  totalScore: 0,
};

export const SAMPLE_NUTRITION: NutritionDay[] = [
  {
    id: "n1",
    date: "2026-06-22",
    calorieTarget: [2200, 2300],
    proteinTarget: 160,
    foodMode: "hotel-buffet",
    mealsLogged: [],
    proteinAchieved: false,
  },
];

// ─── Motivational Messages ────────────────────────────────────────────────────

export const MOTIVATION_MESSAGES = {
  travelDay: [
    "Travel day completed without turning it into a lost day.",
    "The plan was to stay controlled. You did.",
    "Consistency through travel is the hardest kind. Noted.",
  ],
  shortWorkout: [
    "A shortened workout still counts.",
    "20 minutes of effort beats zero every time.",
    "You showed up. That's the hard part.",
  ],
  proteinHit: [
    "Protein target hit. Muscle protected.",
    "160 grams. The work is cumulative.",
    "Nutrition discipline today, results in 8 weeks.",
  ],
  weekCompleted: [
    "You protected the week.",
    "Three strength sessions. That's the standard.",
    "Consistency is the target, not a perfect streak.",
  ],
  missedDay: [
    "Resume the next planned action. Do not restart the programme.",
    "One missed day changes nothing. Tomorrow's session does.",
    "The plan adapts. You continue.",
  ],
  general: [
    "Build consistency around real constraints.",
    "The minimum viable week is a complete week.",
    "Progress is accumulated, not achieved in a single session.",
  ],
};

// ─── Step Progression ─────────────────────────────────────────────────────────

export const STEP_TARGETS_BY_WEEK: Record<number, number> = {
  1: 7000,
  2: 7000,
  3: 8000,
  4: 8000,
  5: 9000,
  6: 9000,
  7: 10000,
  8: 10000,
};
