"use client";
import { Pill } from "@/components/ui/Pill";
import type { DaySchedule, UserProfile } from "@/types";
import { getDayTypeLabel, formatCalories } from "@/lib/utils";

interface AppHeaderProps {
  schedule: DaySchedule;
  user: UserProfile;
  weekNumber: number;
  dateStr: string;
}

const LOCATION_LABELS: Record<string, string> = {
  "ahmedabad-hotel": "Ahmedabad · Hotel",
  "bangalore-home": "Bangalore · Home",
  airport: "In Transit",
  "client-site": "Client Site",
};

export function AppHeader({ schedule, user, weekNumber, dateStr }: AppHeaderProps) {
  const d = new Date(dateStr + "T00:00:00");
  const dayName = d.toLocaleDateString("en-IN", { weekday: "long" });
  const dateLabel = d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  const pills: { label: string; variant: "gold" | "teal" | "stone" }[] = [];

  if (schedule.dayType === "strength") {
    const workoutNames: Record<number, string> = { 2: "Full-body A", 4: "Full-body B", 6: "Full-body C" };
    pills.push({ label: workoutNames[schedule.dayOfWeek] ?? "Strength", variant: "gold" });
    pills.push({ label: `${user.proteinTargetG}g protein`, variant: "teal" });
  } else if (schedule.dayType === "cardio") {
    pills.push({ label: "Cardio + Mobility", variant: "teal" });
    pills.push({ label: `${user.proteinTargetG}g protein`, variant: "gold" });
  } else if (schedule.dayType === "travel-recovery") {
    pills.push({ label: "Travel day", variant: "stone" });
    pills.push({ label: "Mobility only", variant: "stone" });
  } else if (schedule.dayType === "rest") {
    pills.push({ label: "Full rest", variant: "stone" });
    pills.push({ label: "Protein-led meals", variant: "gold" });
  } else if (schedule.dayType === "badminton") {
    pills.push({ label: "Badminton", variant: "teal" });
    pills.push({ label: `${user.proteinTargetG}g protein`, variant: "gold" });
  }

  pills.push({ label: schedule.foodMode === "hotel-buffet" ? "Buffet mode" : schedule.foodMode === "home-food" || schedule.foodMode === "home-relaxed" ? "Home food" : schedule.foodMode === "client-meal" ? "Client meal" : "Travel food", variant: "stone" });

  return (
    <div className="bg-surface-dark px-5 pt-5 pb-0">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-gold mb-1">
        Mission 100 · Week {weekNumber}
      </div>
      <div className="font-serif text-[32px] leading-[1.05] text-surface-cream">
        {getDayTypeLabel(schedule.dayType)}
      </div>
      <div className="text-[12px] text-stone-app mt-1 pb-4">
        {dayName}, {dateLabel} · {LOCATION_LABELS[schedule.location] ?? schedule.location}
      </div>
      <div className="flex gap-1.5 flex-wrap py-3 border-t border-white/5">
        {pills.map((p) => (
          <Pill key={p.label} variant={p.variant}>
            {p.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
