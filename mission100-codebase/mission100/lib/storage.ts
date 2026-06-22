import type { UserProfile, WorkoutLog, NutritionDay, ProgressEntry, WeeklyScore, DaySchedule } from "@/types";
import {
  DEFAULT_USER,
  DEFAULT_WEEK_SCHEDULE,
  SAMPLE_PROGRESS,
  SAMPLE_WEEKLY_SCORE,
  SAMPLE_NUTRITION,
} from "./data";

const KEYS = {
  USER: "m100_user",
  WORKOUT_LOGS: "m100_workout_logs",
  NUTRITION: "m100_nutrition",
  PROGRESS: "m100_progress",
  WEEKLY_SCORES: "m100_weekly_scores",
  WEEK_SCHEDULE: "m100_week_schedule",
  ACTIVE_WORKOUT: "m100_active_workout",
} as const;

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked
  }
}

// ─── User ─────────────────────────────────────────────────────────────────────

export function getUser(): UserProfile {
  return safeGet(KEYS.USER, DEFAULT_USER);
}

export function saveUser(user: UserProfile): void {
  safeSet(KEYS.USER, user);
}

// ─── Week Schedule ────────────────────────────────────────────────────────────

export function getWeekSchedule(): DaySchedule[] {
  return safeGet(KEYS.WEEK_SCHEDULE, DEFAULT_WEEK_SCHEDULE);
}

export function saveWeekSchedule(schedule: DaySchedule[]): void {
  safeSet(KEYS.WEEK_SCHEDULE, schedule);
}

// ─── Workout Logs ─────────────────────────────────────────────────────────────

export function getWorkoutLogs(): WorkoutLog[] {
  return safeGet(KEYS.WORKOUT_LOGS, []);
}

export function saveWorkoutLog(log: WorkoutLog): void {
  const logs = getWorkoutLogs();
  const existing = logs.findIndex((l) => l.id === log.id);
  if (existing >= 0) {
    logs[existing] = log;
  } else {
    logs.push(log);
  }
  safeSet(KEYS.WORKOUT_LOGS, logs);
}

export function getWorkoutLogForDate(date: string): WorkoutLog | undefined {
  return getWorkoutLogs().find((l) => l.date === date);
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export function getNutritionDays(): NutritionDay[] {
  return safeGet(KEYS.NUTRITION, SAMPLE_NUTRITION);
}

export function saveNutritionDay(day: NutritionDay): void {
  const days = getNutritionDays();
  const existing = days.findIndex((d) => d.date === day.date);
  if (existing >= 0) {
    days[existing] = day;
  } else {
    days.push(day);
  }
  safeSet(KEYS.NUTRITION, days);
}

export function getNutritionForDate(date: string): NutritionDay | undefined {
  return getNutritionDays().find((d) => d.date === date);
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export function getProgressEntries(): ProgressEntry[] {
  return safeGet(KEYS.PROGRESS, SAMPLE_PROGRESS);
}

export function saveProgressEntry(entry: ProgressEntry): void {
  const entries = getProgressEntries();
  const existing = entries.findIndex((e) => e.date === entry.date);
  if (existing >= 0) {
    entries[existing] = entry;
  } else {
    entries.push(entry);
  }
  safeSet(KEYS.PROGRESS, entries);
}

export function getProgressForDate(date: string): ProgressEntry | undefined {
  return getProgressEntries().find((e) => e.date === date);
}

// ─── Weekly Scores ────────────────────────────────────────────────────────────

export function getWeeklyScores(): WeeklyScore[] {
  return safeGet(KEYS.WEEKLY_SCORES, [SAMPLE_WEEKLY_SCORE]);
}

export function saveWeeklyScore(score: WeeklyScore): void {
  const scores = getWeeklyScores();
  const existing = scores.findIndex((s) => s.weekStart === score.weekStart);
  if (existing >= 0) {
    scores[existing] = score;
  } else {
    scores.push(score);
  }
  safeSet(KEYS.WEEKLY_SCORES, scores);
}

export function getLatestWeeklyScore(): WeeklyScore | undefined {
  const scores = getWeeklyScores();
  if (!scores.length) return undefined;
  return scores.sort((a, b) => b.weekStart.localeCompare(a.weekStart))[0];
}

// ─── Active Workout ───────────────────────────────────────────────────────────

export function getActiveWorkout(): Partial<WorkoutLog> | null {
  return safeGet(KEYS.ACTIVE_WORKOUT, null);
}

export function saveActiveWorkout(workout: Partial<WorkoutLog> | null): void {
  safeSet(KEYS.ACTIVE_WORKOUT, workout);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekNumber(date: Date, startDate: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((date.getTime() - startDate.getTime()) / msPerWeek) + 1;
}

export function getWeightTrend(entries: ProgressEntry[]): number | null {
  const weighted = entries
    .filter((e) => e.weightKg !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (weighted.length < 2) return null;
  const recent = weighted.slice(-2);
  return (recent[1].weightKg ?? 0) - (recent[0].weightKg ?? 0);
}

export function computeWeeklyScore(
  logs: WorkoutLog[],
  nutrition: NutritionDay[],
  progress: ProgressEntry[],
  weekStart: string
): WeeklyScore {
  const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const weekLogs = logs.filter((l) => l.date >= weekStart && l.date < weekEnd);
  const weekNutrition = nutrition.filter((n) => n.date >= weekStart && n.date < weekEnd);
  const weekProgress = progress.filter((p) => p.date >= weekStart && p.date < weekEnd);

  const strengthSessions = weekLogs.filter((l) =>
    ["strength-a", "strength-b", "strength-c"].includes(l.workoutType)
  ).length;

  const nutritionDays = weekNutrition.filter((n) => n.proteinAchieved).length;
  const travelDaysControlled = weekNutrition.filter((n) => n.travelDayAdherence).length;

  const avgSteps =
    weekProgress.length > 0
      ? Math.round(weekProgress.reduce((s, p) => s + p.steps, 0) / weekProgress.length)
      : 0;

  const avgSleep =
    weekProgress.filter((p) => p.sleepHours).length > 0
      ? weekProgress.reduce((s, p) => s + (p.sleepHours ?? 0), 0) /
        weekProgress.filter((p) => p.sleepHours).length
      : 0;

  const recoveryScore = Math.min(10, Math.round((avgSleep / 8) * 10));
  const checkedIn = weekProgress.some((p) => p.weightKg !== undefined);

  const totalScore = Math.min(
    100,
    Math.round(
      (strengthSessions / 3) * 30 +
        (nutritionDays / 7) * 25 +
        (Math.min(avgSteps, 10000) / 10000) * 15 +
        (travelDaysControlled / Math.max(2, 1)) * 15 +
        recoveryScore +
        (checkedIn ? 5 : 0)
    )
  );

  return {
    weekStart,
    strengthSessions,
    nutritionDays,
    avgSteps,
    travelDaysControlled,
    recoveryScore,
    checkedIn,
    totalScore,
  };
}
