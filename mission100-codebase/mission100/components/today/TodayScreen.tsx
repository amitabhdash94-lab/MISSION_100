"use client";
import { useState } from "react";
import { Card, CardLabel, CardTitle, CardSub } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TargetBox, TargetRow } from "@/components/ui/TargetBox";
import type { DaySchedule, UserProfile, WorkoutLog, WorkoutPlan, EnergyLevel } from "@/types";
import { WORKOUT_PLANS, MOTIVATION_MESSAGES } from "@/lib/data";
import { getWorkoutTypeForSchedule, formatCalories, cn } from "@/lib/utils";

interface TodayScreenProps {
  schedule: DaySchedule;
  user: UserProfile;
  workoutLog?: WorkoutLog;
  dateStr: string;
  onStartWorkout: () => void;
  onOpenBuffet: () => void;
}

export function TodayScreen({
  schedule,
  user,
  workoutLog,
  dateStr,
  onStartWorkout,
  onOpenBuffet,
}: TodayScreenProps) {
  const [energy, setEnergy] = useState<EnergyLevel>("moderate");
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(
    new Set(workoutLog?.completedExercises ?? [])
  );

  const workoutType = getWorkoutTypeForSchedule(schedule);
  const plan = WORKOUT_PLANS.find((p) => p.id === workoutType);
  const isRestDay = schedule.dayType === "rest";
  const isTravelDay = schedule.isTravelDay;

  const motivationMsg =
    isRestDay
      ? MOTIVATION_MESSAGES.missedDay[0]
      : isTravelDay
      ? MOTIVATION_MESSAGES.travelDay[0]
      : MOTIVATION_MESSAGES.general[Math.floor(Math.random() * MOTIVATION_MESSAGES.general.length)];

  function toggleExercise(id: string) {
    setCheckedExercises((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Workout card */}
      {plan && !isRestDay && (
        <Card>
          <CardLabel>Today's workout</CardLabel>
          <CardTitle>{plan.name}</CardTitle>
          <CardSub>
            {plan.durationMin}–{plan.durationMax} min · {schedule.location === "ahmedabad-hotel" ? "Hotel gym" : "Home gym or CultPass"}
          </CardSub>

          <TargetRow>
            <TargetBox value={plan.exercises.length} label="Exercises" />
            <TargetBox value={plan.durationMin} label="Min target" />
            <TargetBox value={`${(schedule.stepTarget / 1000).toFixed(0)}k`} label="Steps" color="teal" />
          </TargetRow>

          {plan.id !== "mobility" && plan.id !== "cardio" && plan.id !== "badminton" && (
            <div className="mt-3 border-t border-white/5 pt-3">
              {plan.exercises
                .filter((e) => !e.id.endsWith("b"))
                .map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <span className="text-[13px] text-surface-cream font-medium">{ex.name}</span>
                      {ex.notes && (
                        <span className="text-[11px] text-stone-app ml-1">({ex.notes})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-stone-app">
                        {ex.sets} × {ex.repsMin}
                        {ex.repsMax !== ex.repsMin ? `–${ex.repsMax}` : ""}
                      </span>
                      <button
                        onClick={() => toggleExercise(ex.id)}
                        className={cn(
                          "w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200",
                          checkedExercises.has(ex.id)
                            ? "bg-gold border-gold"
                            : "border-gold-muted hover:border-gold"
                        )}
                        aria-label={`Mark ${ex.name} complete`}
                      >
                        {checkedExercises.has(ex.id) && (
                          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                            <path d="M1 3.5L3.5 6L9 1" stroke="#0D0F0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {plan.id === "cardio" && (
            <div className="mt-3 p-3 rounded-lg bg-teal-bg border border-teal-border">
              <p className="text-[13px] text-teal-light">
                30–40 min brisk walk, cycling or elliptical at conversational pace. 10 min mobility after.
              </p>
            </div>
          )}

          {plan.id === "badminton" && (
            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-lg bg-teal-bg border border-teal-border">
                <p className="text-[13px] text-teal-light">8–10 min warm-up. Moderate first 20 minutes.</p>
              </div>
              <div className="p-3 rounded-lg bg-gold-light border border-gold-muted">
                <p className="text-[13px] text-gold">Pain check: knees, ankles, Achilles, lower back before full play.</p>
              </div>
            </div>
          )}

          {plan.id === "mobility" && (
            <div className="mt-3 space-y-1.5">
              {plan.exercises.map((ex) => (
                <div key={ex.id} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-surface-cream">{ex.name}</span>
                  <span className="text-[12px] text-stone-app">
                    {ex.repsMin}{ex.notes ? ` ${ex.notes}` : " reps"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-3">
            <Button variant="primary" fullWidth onClick={onStartWorkout}>
              Start workout
            </Button>
            <Button variant="secondary" fullWidth>
              Shorten to 20 minutes
            </Button>
          </div>
        </Card>
      )}

      {/* Rest day card */}
      {isRestDay && (
        <Card teal>
          <CardLabel>Complete rest</CardLabel>
          <CardTitle className="text-teal-light">No workout today</CardTitle>
          <CardSub>Early checkout · Travel to Bangalore · Protein-led airport meal</CardSub>
          <div className="mt-3 space-y-2">
            <RestItem icon="→" text="Protein-rich breakfast before checkout" />
            <RestItem icon="→" text="Planned airport meal — not gate grazing" />
            <RestItem icon="→" text="Normal dinner at home" />
            <RestItem icon="→" text="Hydration throughout" />
          </div>
        </Card>
      )}

      {/* Nutrition card */}
      <Card>
        <CardLabel>Nutrition today</CardLabel>
        <CardTitle>{formatCalories(schedule.calorieTarget)}</CardTitle>
        <CardSub>
          {schedule.foodMode === "hotel-buffet"
            ? "Buffet mode · Protein first"
            : schedule.foodMode === "client-meal"
            ? "Client meal · Plate method"
            : schedule.foodMode === "home-food" || schedule.foodMode === "home-relaxed"
            ? "Home food · Measured portions"
            : "Travel mode · Planned meals only"}
        </CardSub>

        <div className="flex gap-1.5 mt-3">
          <div className="flex-1 bg-teal-bg border border-teal-border rounded-lg p-2.5 text-center">
            <span className="text-lg font-semibold text-teal-light block">{user.proteinTargetG}g</span>
            <div className="text-[10px] text-stone-app uppercase tracking-[0.06em] mt-0.5">Protein</div>
          </div>
          <div className="flex-1 bg-teal-bg border border-teal-border rounded-lg p-2.5 text-center">
            <span className="text-lg font-semibold text-teal-light block">
              {Math.round((schedule.calorieTarget[0] + schedule.calorieTarget[1]) / 2).toLocaleString()}
            </span>
            <div className="text-[10px] text-stone-app uppercase tracking-[0.06em] mt-0.5">Calories</div>
          </div>
          <div className="flex-1 bg-teal-bg border border-teal-border rounded-lg p-2.5 text-center">
            <span className="text-lg font-semibold text-teal-light block">
              {(schedule.stepTarget / 1000).toFixed(0)}k
            </span>
            <div className="text-[10px] text-stone-app uppercase tracking-[0.06em] mt-0.5">Steps</div>
          </div>
        </div>

        {schedule.foodMode === "hotel-buffet" && (
          <div className="mt-3 border-l-2 border-gold pl-3 py-1 text-[12px] text-surface-cream leading-relaxed">
            Walk the buffet once before serving. Protein → vegetables → one carb.
          </div>
        )}

        {schedule.foodMode === "client-meal" && (
          <div className="mt-3 border-l-2 border-gold pl-3 py-1 text-[12px] text-surface-cream leading-relaxed">
            Half plate: vegetables. Quarter: protein. Quarter: rice or roti. Not both.
          </div>
        )}

        <Button variant="secondary" fullWidth className="mt-3" onClick={onOpenBuffet}>
          Open food guide
        </Button>
      </Card>

      {/* Energy check-in */}
      <Card>
        <CardLabel>How are you feeling?</CardLabel>
        <CardSub className="mb-3">Adapts today's session if needed</CardSub>
        <div className="flex gap-2">
          {(["low", "moderate", "high"] as EnergyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setEnergy(level)}
              className={cn(
                "flex-1 py-2.5 rounded-lg border text-[11px] font-medium capitalize transition-all",
                energy === level
                  ? "border-gold text-gold bg-gold-light"
                  : "border-gold-muted text-stone-app hover:border-gold hover:text-surface-cream"
              )}
            >
              {level}
            </button>
          ))}
        </div>
        {energy === "low" && (
          <p className="text-[11px] text-stone-app mt-2.5">
            Low energy: reduce sets by 30–40%. A shortened session still counts.
          </p>
        )}
        {energy === "high" && (
          <p className="text-[11px] text-teal-light mt-2.5">
            High energy: you may progress weight or reps — no random extra volume.
          </p>
        )}
      </Card>

      {/* Motivation */}
      <div className="rounded-app-lg border border-gold-muted bg-gold-light p-4 text-center">
        <div className="font-serif text-[15px] text-surface-cream leading-snug">&ldquo;{motivationMsg}&rdquo;</div>
        <div className="text-[11px] text-stone-app mt-1.5">Consistency is the target, not a perfect streak</div>
      </div>
    </div>
  );
}

function RestItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-[13px] text-surface-cream">
      <span className="text-teal-light mt-0.5">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
