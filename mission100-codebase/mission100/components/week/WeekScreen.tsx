"use client";
import { useState } from "react";
import { Card, CardLabel } from "@/components/ui/Card";
import type { DaySchedule, WorkoutLog, NutritionDay } from "@/types";
import { getDayTypeLabel, cn } from "@/lib/utils";
import { DEFAULT_WEEK_SCHEDULE } from "@/lib/data";

interface WeekScreenProps {
  schedule: DaySchedule[];
  workoutLogs: WorkoutLog[];
  nutritionDays: NutritionDay[];
  currentDate: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_ICONS: Record<string, string> = {
  "travel-recovery": "✈",
  strength: "▪",
  cardio: "◌",
  rest: "○",
  badminton: "◈",
  "active-recovery": "◎",
};

const DOT_COLORS: Record<string, string> = {
  "travel-recovery": "bg-stone-app",
  strength: "bg-gold",
  cardio: "bg-teal-app",
  rest: "bg-white/20",
  badminton: "bg-teal-light",
  "active-recovery": "bg-teal-app",
};

function getWeekDates(currentDate: string): string[] {
  const d = new Date(currentDate + "T00:00:00");
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd.toISOString().split("T")[0];
  });
}

export function WeekScreen({ schedule, workoutLogs, nutritionDays, currentDate }: WeekScreenProps) {
  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [satSunSwapped, setSatSunSwapped] = useState(false);

  const weekDates = getWeekDates(currentDate);
  // Map date -> schedule entry
  const scheduleMap = new Map(
    schedule.map((s) => [s.dayOfWeek, s])
  );

  function getScheduleForDate(dateStr: string): DaySchedule {
    const dow = new Date(dateStr + "T00:00:00").getDay();
    let effectiveDow = dow;
    if (satSunSwapped) {
      if (dow === 6) effectiveDow = 0;
      else if (dow === 0) effectiveDow = 6;
    }
    return scheduleMap.get(effectiveDow as 0 | 1 | 2 | 3 | 4 | 5 | 6) ?? DEFAULT_WEEK_SCHEDULE[0];
  }

  const selectedSchedule = getScheduleForDate(selectedDay);
  const selectedLog = workoutLogs.find((l) => l.date === selectedDay);
  const selectedNutrition = nutritionDays.find((n) => n.date === selectedDay);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Week strip */}
      <div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {weekDates.map((dateStr) => {
            const dow = new Date(dateStr + "T00:00:00").getDay();
            const s = getScheduleForDate(dateStr);
            const isToday = dateStr === currentDate;
            const isSelected = dateStr === selectedDay;
            const hasLog = workoutLogs.some((l) => l.date === dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(dateStr)}
                className={cn(
                  "flex-shrink-0 w-12 rounded-app border py-2.5 px-1 text-center transition-all",
                  isSelected
                    ? "border-gold bg-gold-light"
                    : isToday
                    ? "border-gold/40 bg-white/5"
                    : "border-gold-muted bg-surface-card hover:border-gold/40"
                )}
              >
                <div className={cn("text-[10px] font-medium uppercase tracking-[0.08em] mb-1", isSelected ? "text-gold" : "text-stone-app")}>
                  {DAY_NAMES[dow]}
                </div>
                <div className="text-base">{DAY_ICONS[s.dayType] ?? "○"}</div>
                <div className={cn("text-[9px] leading-tight mt-1", isSelected ? "text-gold/70" : "text-stone-muted")}>
                  {s.label.split(" ")[0]}
                </div>
                {hasLog && (
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-light mx-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sat/Sun swap */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-stone-app">Swap Sat/Sun</span>
        <button
          onClick={() => setSatSunSwapped((v) => !v)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
            satSunSwapped ? "bg-gold border-gold" : "bg-white/5 border-gold-muted"
          )}
        >
          <span
            className={cn(
              "inline-block w-4 h-4 rounded-full bg-white transition-transform",
              satSunSwapped ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {/* Selected day detail */}
      <Card>
        <CardLabel>{DAY_NAMES[new Date(selectedDay + "T00:00:00").getDay()]} — {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</CardLabel>
        <div className="space-y-1">
          <DetailRow label="Type" value={getDayTypeLabel(selectedSchedule.dayType)} dot={DOT_COLORS[selectedSchedule.dayType]} />
          <DetailRow label="Location" value={selectedSchedule.label} />
          <DetailRow label="Food mode" value={selectedSchedule.foodMode.replace(/-/g, " ")} />
          <DetailRow label="Step target" value={`${selectedSchedule.stepTarget.toLocaleString()} steps`} />
          <DetailRow label="Calories" value={`${selectedSchedule.calorieTarget[0]}–${selectedSchedule.calorieTarget[1]} kcal`} />
          <DetailRow label="Workout" value={selectedSchedule.workoutAvailable ? selectedSchedule.sublabel : "No workout"} />
          {selectedLog && (
            <DetailRow label="Status" value="✓ Completed" valueClass="text-teal-light" />
          )}
          {selectedNutrition?.proteinAchieved && (
            <DetailRow label="Protein" value="✓ Target hit" valueClass="text-teal-light" />
          )}
        </div>
      </Card>

      {/* Full week summary */}
      <Card>
        <CardLabel>Week at a glance</CardLabel>
        <div className="space-y-0">
          {weekDates.map((dateStr) => {
            const s = getScheduleForDate(dateStr);
            const dow = new Date(dateStr + "T00:00:00").getDay();
            const hasLog = workoutLogs.some((l) => l.date === dateStr);
            const proteinHit = nutritionDays.find((n) => n.date === dateStr)?.proteinAchieved;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(dateStr)}
                className="w-full flex items-start gap-3 py-3 border-b border-white/5 last:border-0 text-left hover:bg-white/2 rounded"
              >
                <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", DOT_COLORS[s.dayType])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-surface-cream">
                      {DAY_NAMES[dow]}
                    </span>
                    <div className="flex gap-1">
                      {hasLog && <span className="text-[10px] text-teal-light">✓ Workout</span>}
                      {proteinHit && <span className="text-[10px] text-gold ml-1">✓ Protein</span>}
                    </div>
                  </div>
                  <div className="text-[12px] text-stone-app mt-0.5">{s.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function DetailRow({
  label,
  value,
  dot,
  valueClass,
}: {
  label: string;
  value: string;
  dot?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-[12px] text-stone-app">{label}</span>
      <div className="flex items-center gap-1.5">
        {dot && <div className={cn("w-2 h-2 rounded-full", dot)} />}
        <span className={cn("text-[12px] font-medium text-surface-cream capitalize", valueClass)}>
          {value}
        </span>
      </div>
    </div>
  );
}
