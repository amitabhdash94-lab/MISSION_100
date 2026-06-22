import type { DaySchedule, DayType, WorkoutType } from "@/types";
import { DEFAULT_WEEK_SCHEDULE } from "./data";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + "T00:00:00").getDay();
}

export function getScheduleForDate(dateStr: string): DaySchedule {
  const dow = getDayOfWeek(dateStr);
  return (
    DEFAULT_WEEK_SCHEDULE.find((s) => s.dayOfWeek === dow) ?? DEFAULT_WEEK_SCHEDULE[1]
  );
}

export function getDayTypeLabel(type: DayType): string {
  const map: Record<DayType, string> = {
    "travel-recovery": "Travel Recovery",
    strength: "Strength Day",
    cardio: "Cardio + Mobility",
    rest: "Complete Rest",
    badminton: "Badminton",
    "active-recovery": "Active Recovery",
  };
  return map[type];
}

export function getWorkoutForDayType(type: DayType): WorkoutType {
  const map: Record<DayType, WorkoutType> = {
    "travel-recovery": "mobility",
    strength: "strength-a",
    cardio: "cardio",
    rest: "rest",
    badminton: "badminton",
    "active-recovery": "mobility",
  };
  return map[type];
}

export function getStrengthWorkoutForDayOfWeek(dow: number): WorkoutType {
  if (dow === 2) return "strength-a";
  if (dow === 4) return "strength-b";
  return "strength-c";
}

export function getWorkoutTypeForSchedule(schedule: DaySchedule): WorkoutType {
  if (schedule.dayType === "strength") {
    return getStrengthWorkoutForDayOfWeek(schedule.dayOfWeek);
  }
  return getWorkoutForDayType(schedule.dayType);
}

export function getDayIcon(type: DayType): string {
  const map: Record<DayType, string> = {
    "travel-recovery": "✈",
    strength: "⬛",
    cardio: "◌",
    rest: "○",
    badminton: "◈",
    "active-recovery": "◎",
  };
  return map[type];
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

export function formatCalories(range: [number, number]): string {
  return `${range[0].toLocaleString()}–${range[1].toLocaleString()} kcal`;
}

export function getProgressToTarget(current: number, target: number, start: number): number {
  if (start === target) return 100;
  return Math.min(100, Math.max(0, Math.round(((start - current) / (start - target)) * 100)));
}

export function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // week starts Monday
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getDayShort(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" });
}
