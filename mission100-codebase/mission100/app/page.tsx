"use client";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav, SideNav } from "@/components/layout/BottomNav";
import { TodayScreen } from "@/components/today/TodayScreen";
import { WeekScreen } from "@/components/week/WeekScreen";
import { FoodScreen } from "@/components/food/FoodScreen";
import { ProgressScreen } from "@/components/progress/ProgressScreen";
import { WorkoutMode } from "@/components/workout/WorkoutMode";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import type { ActiveScreen, UserProfile, WorkoutLog, NutritionDay, ProgressEntry, WeeklyScore } from "@/types";
import {
  getUser, saveUser,
  getWeekSchedule,
  getWorkoutLogs, saveWorkoutLog,
  getNutritionDays,
  getProgressEntries, saveProgressEntry,
  getLatestWeeklyScore,
  getTodayString, getWeekNumber, computeWeeklyScore,
  saveActiveWorkout,
} from "@/lib/storage";
import { getScheduleForDate, getWorkoutTypeForSchedule, generateId, getWeekStartDate } from "@/lib/utils";
import { WORKOUT_PLANS } from "@/lib/data";

export default function MissionApp() {
  const [mounted, setMounted] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("today");
  const [inWorkout, setInWorkout] = useState(false);
  const [workoutShortened, setWorkoutShortened] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [nutritionDays, setNutritionDays] = useState<NutritionDay[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [weeklyScore, setWeeklyScore] = useState<WeeklyScore | undefined>();

  const todayStr = getTodayString();

  useEffect(() => {
    setUser(getUser());
    setWorkoutLogs(getWorkoutLogs());
    setNutritionDays(getNutritionDays());
    setProgressEntries(getProgressEntries());
    setWeeklyScore(getLatestWeeklyScore());
    setMounted(true);
  }, []);

  const schedule = getScheduleForDate(todayStr);
  const weekSchedule = getWeekSchedule();
  const todayLog = workoutLogs.find((l) => l.date === todayStr);
  const weekStart = new Date("2026-06-22");
  const weekNum = user ? getWeekNumber(new Date(), weekStart) : 1;
  const workoutType = getWorkoutTypeForSchedule(schedule);
  const workoutPlan = WORKOUT_PLANS.find((p) => p.id === workoutType);

  function handleStartWorkout() {
    setInWorkout(true);
    setWorkoutShortened(false);
    saveActiveWorkout({ date: todayStr, workoutType });
  }

  function handleWorkoutComplete(log: WorkoutLog) {
    const updatedLogs = [...workoutLogs.filter((l) => l.id !== log.id), log];
    setWorkoutLogs(updatedLogs);
    saveWorkoutLog(log);
    saveActiveWorkout(null);
    setInWorkout(false);
    const wStart = getWeekStartDate();
    const newScore = computeWeeklyScore(updatedLogs, nutritionDays, progressEntries, wStart);
    setWeeklyScore(newScore);
  }

  function handleLogWeight(weight: number) {
    const existing = progressEntries.find((e) => e.date === todayStr);
    const entry: ProgressEntry = {
      ...(existing ?? { id: generateId(), date: todayStr, steps: 0 }),
      weightKg: weight,
    };
    const updated = [...progressEntries.filter((e) => e.date !== todayStr), entry];
    setProgressEntries(updated);
    saveProgressEntry(entry);
    if (user) {
      const updatedUser = { ...user, currentWeightKg: weight };
      setUser(updatedUser);
      saveUser(updatedUser);
    }
    const wStart = getWeekStartDate();
    setWeeklyScore(computeWeeklyScore(workoutLogs, nutritionDays, updated, wStart));
  }

  function handleLogSteps(steps: number) {
    const existing = progressEntries.find((e) => e.date === todayStr);
    const entry: ProgressEntry = {
      ...(existing ?? { id: generateId(), date: todayStr, steps: 0 }),
      steps,
    };
    const updated = [...progressEntries.filter((e) => e.date !== todayStr), entry];
    setProgressEntries(updated);
    saveProgressEntry(entry);
    const wStart = getWeekStartDate();
    setWeeklyScore(computeWeeklyScore(workoutLogs, nutritionDays, updated, wStart));
  }

  function handleOnboardingComplete(newUser: UserProfile) {
    setUser(newUser);
    saveUser(newUser);
  }

  function handleNavChange(screen: ActiveScreen) {
    setActiveScreen(screen);
    setInWorkout(false);
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="font-serif text-gold text-2xl">Mission 100</div>
      </div>
    );
  }

  if (!user.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (inWorkout && workoutPlan) {
    return (
      <WorkoutMode
        plan={workoutPlan}
        onComplete={handleWorkoutComplete}
        onExit={() => { setInWorkout(false); saveActiveWorkout(null); }}
        date={todayStr}
        shortened={workoutShortened}
      />
    );
  }

  const mainContent = (
    <>
      {activeScreen === "today" && (
        <TodayScreen
          schedule={schedule}
          user={user}
          workoutLog={todayLog}
          dateStr={todayStr}
          onStartWorkout={handleStartWorkout}
          onOpenBuffet={() => setActiveScreen("food")}
        />
      )}
      {activeScreen === "week" && (
        <WeekScreen
          schedule={weekSchedule}
          workoutLogs={workoutLogs}
          nutritionDays={nutritionDays}
          currentDate={todayStr}
        />
      )}
      {activeScreen === "food" && (
        <FoodScreen foodMode={schedule.foodMode} proteinTarget={user.proteinTargetG} />
      )}
      {activeScreen === "progress" && (
        <ProgressScreen
          user={user}
          progressEntries={progressEntries}
          weeklyScore={weeklyScore}
          workoutLogs={workoutLogs}
          nutritionDays={nutritionDays}
          onLogWeight={handleLogWeight}
          onLogSteps={handleLogSteps}
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col">
      {/* iPad landscape: sidebar */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <SideNav active={activeScreen} onChange={handleNavChange} />
        <div className="flex-1 overflow-y-auto">
          <AppHeader schedule={schedule} user={user} weekNumber={weekNum} dateStr={todayStr} />
          {mainContent}
        </div>
        <aside className="w-72 border-l border-gold-muted p-5 overflow-y-auto bg-surface-dark flex-shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-stone-app mb-4">Today&apos;s targets</div>
          <QuickStat label="Calories" value={`${schedule.calorieTarget[0]}–${schedule.calorieTarget[1]}`} unit="kcal" />
          <QuickStat label="Protein" value={String(user.proteinTargetG)} unit="g" />
          <QuickStat label="Steps" value={`${(schedule.stepTarget / 1000).toFixed(0)}k`} unit="target" />
          <QuickStat label="Current weight" value={String(user.currentWeightKg)} unit="kg" />
          <QuickStat label="To target" value={(user.currentWeightKg - user.targetWeightKg).toFixed(1)} unit="kg to go" />
          <div className="mt-5 border-t border-gold-muted pt-5">
            <div className="text-[10px] uppercase tracking-widest text-stone-app mb-2">Week score</div>
            <div className="font-serif text-5xl text-gold">{weeklyScore?.totalScore ?? 0}</div>
            <div className="text-[11px] text-stone-app mt-1">out of 100</div>
          </div>
        </aside>
      </div>

      {/* Mobile + iPad portrait */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <AppHeader schedule={schedule} user={user} weekNumber={weekNum} dateStr={todayStr} />
        <div className="flex-1 overflow-y-auto pb-20">
          {mainContent}
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <BottomNav active={activeScreen} onChange={handleNavChange} />
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="mb-3 pb-3 border-b border-white/5 last:border-0">
      <div className="text-[11px] text-stone-app">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="font-serif text-2xl text-gold">{value}</span>
        <span className="text-[11px] text-stone-app">{unit}</span>
      </div>
    </div>
  );
}
