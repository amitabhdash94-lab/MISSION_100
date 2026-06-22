// ─── User ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  targetDate: string; // ISO date
  bodyFatPercent: number;
  leanMassKg: number;
  bmr: number;
  proteinTargetG: number;
  calorieRanges: CalorieRanges;
  injuryFlags: string[];
  preferredActivities: string[];
  dietaryPreferences: string[];
  trackingMode: "calories" | "portions" | "both";
  weekStartDate: string; // ISO date
  onboardingComplete: boolean;
}

export interface CalorieRanges {
  travelDay: [number, number];
  weekdayStrength: [number, number];
  weekendStrengthOrBadminton: [number, number];
  weekendRest: [number, number];
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export type DayType =
  | "travel-recovery"
  | "strength"
  | "cardio"
  | "rest"
  | "badminton"
  | "active-recovery";

export type FoodMode =
  | "hotel-buffet"
  | "client-meal"
  | "home-food"
  | "travel-airport"
  | "home-relaxed";

export type Location = "ahmedabad-hotel" | "bangalore-home" | "airport" | "client-site";

export interface DaySchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  dayType: DayType;
  location: Location;
  isTravelDay: boolean;
  workStartTime?: string;
  workEndTime?: string;
  foodMode: FoodMode;
  stepTarget: number;
  calorieTarget: [number, number];
  workoutAvailable: boolean;
  label: string;
  sublabel: string;
}

// ─── Workout ─────────────────────────────────────────────────────────────────

export type WorkoutType = "strength-a" | "strength-b" | "strength-c" | "cardio" | "mobility" | "badminton" | "rest";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notes?: string;
  substituteId?: string;
  requiresEquipment: boolean;
}

export interface WorkoutPlan {
  id: WorkoutType;
  name: string;
  durationMin: number;
  durationMax: number;
  exercises: Exercise[];
  fallback: WorkoutFallback;
  warmup?: Exercise[];
}

export interface WorkoutFallback {
  name: string;
  description: string;
  exercises?: Exercise[];
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO date
  workoutType: WorkoutType;
  completedExercises: string[]; // exercise ids
  perceivedEffort: 1 | 2 | 3 | 4 | 5;
  durationMinutes: number;
  energyLevel: "low" | "moderate" | "high";
  painNotes?: string;
  shortened: boolean;
  notes?: string;
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface NutritionDay {
  id: string;
  date: string;
  calorieTarget: [number, number];
  proteinTarget: number;
  foodMode: FoodMode;
  mealsLogged: MealLog[];
  proteinAchieved: boolean;
  caloriesLogged?: number;
  buffetAdherence?: boolean;
  travelDayAdherence?: boolean;
  notes?: string;
}

export interface MealLog {
  id: string;
  meal: "breakfast" | "lunch" | "snack" | "dinner";
  description: string;
  proteinEstimateG: number;
  calorieEstimate?: number;
  buffetMode: boolean;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressEntry {
  id: string;
  date: string;
  weightKg?: number;
  waistCm?: number;
  steps: number;
  sleepHours?: number;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface WeeklyScore {
  weekStart: string;
  strengthSessions: number; // out of 3
  nutritionDays: number; // protein hit, out of 7
  avgSteps: number;
  travelDaysControlled: number; // out of travel days
  recoveryScore: number; // 0-10
  checkedIn: boolean;
  totalScore: number; // out of 100
}

export interface WeightMilestone {
  date: string;
  label: string;
  rangeMin: number;
  rangeMax: number;
  achieved?: boolean;
}

// ─── App State ───────────────────────────────────────────────────────────────

export type ActiveScreen = "today" | "week" | "food" | "progress" | "workout" | "onboarding";

export interface AppState {
  user: UserProfile;
  weekSchedule: DaySchedule[];
  workoutLogs: WorkoutLog[];
  nutritionDays: NutritionDay[];
  progressEntries: ProgressEntry[];
  weeklyScores: WeeklyScore[];
  activeScreen: ActiveScreen;
  activeWorkoutLog?: Partial<WorkoutLog>;
  currentDate: string;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export type EnergyLevel = "low" | "moderate" | "high";

export interface CheckInState {
  energyLevel: EnergyLevel;
  timeAvailable: number; // minutes
  hasEquipment: boolean;
  painAreas: string[];
  sleptWell: boolean;
}
