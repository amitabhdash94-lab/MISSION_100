"use client";
import { useState } from "react";
import { Card, CardLabel, CardTitle, CardSub } from "@/components/ui/Card";
import { ScoreRing, ProgressBar } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import type { UserProfile, ProgressEntry, WeeklyScore, WorkoutLog, NutritionDay } from "@/types";
import { WEIGHT_MILESTONES, MOTIVATION_MESSAGES } from "@/lib/data";
import { formatWeight, getProgressToTarget, daysUntil } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ProgressScreenProps {
  user: UserProfile;
  progressEntries: ProgressEntry[];
  weeklyScore?: WeeklyScore;
  workoutLogs: WorkoutLog[];
  nutritionDays: NutritionDay[];
  onLogWeight: (weight: number) => void;
  onLogSteps: (steps: number) => void;
}

export function ProgressScreen({
  user,
  progressEntries,
  weeklyScore,
  workoutLogs,
  nutritionDays,
  onLogWeight,
  onLogSteps,
}: ProgressScreenProps) {
  const [weightInput, setWeightInput] = useState("");
  const [stepsInput, setStepsInput] = useState("");
  const [loggingWeight, setLoggingWeight] = useState(false);
  const [loggingSteps, setLoggingSteps] = useState(false);

  const latestWeight = progressEntries
    .filter((e) => e.weightKg)
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.weightKg ?? user.currentWeightKg;

  const progress = getProgressToTarget(latestWeight, user.targetWeightKg, user.currentWeightKg);
  const daysLeft = daysUntil(user.targetDate);
  const kgLost = user.currentWeightKg - latestWeight;
  const kgToGo = latestWeight - user.targetWeightKg;

  // Chart data
  const chartData = progressEntries
    .filter((e) => e.weightKg)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: e.date.slice(5), // MM-DD
      weight: e.weightKg,
    }));

  // Fill in milestones as reference
  const milestoneRef = WEIGHT_MILESTONES.find(
    (m) => !m.achieved && new Date(m.date) > new Date()
  );

  const score = weeklyScore ?? {
    strengthSessions: 0,
    nutritionDays: 0,
    avgSteps: 0,
    travelDaysControlled: 0,
    recoveryScore: 0,
    checkedIn: false,
    totalScore: 0,
  };

  // This week adherence
  const thisWeekWorkouts = workoutLogs.slice(-7).filter((l) =>
    ["strength-a", "strength-b", "strength-c"].includes(l.workoutType)
  ).length;
  const thisWeekProtein = nutritionDays.slice(-7).filter((n) => n.proteinAchieved).length;
  const avgSteps =
    progressEntries.length > 0
      ? Math.round(progressEntries.slice(-7).reduce((s, e) => s + e.steps, 0) / Math.max(1, progressEntries.slice(-7).length))
      : 0;

  function handleLogWeight() {
    const w = parseFloat(weightInput);
    if (!isNaN(w) && w > 50 && w < 200) {
      onLogWeight(w);
      setWeightInput("");
      setLoggingWeight(false);
    }
  }

  function handleLogSteps() {
    const s = parseInt(stepsInput);
    if (!isNaN(s) && s >= 0) {
      onLogSteps(s);
      setStepsInput("");
      setLoggingSteps(false);
    }
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard value={`${latestWeight.toFixed(1)}`} unit="kg" label="Current weight" delta={kgLost > 0 ? `${kgLost.toFixed(1)} kg lost` : undefined} deltaColor="teal" />
        <MetricCard value={`${kgToGo.toFixed(1)}`} unit="kg" label="To target" delta={`${daysLeft} days left`} />
        <MetricCard value={`${progress}%`} unit="" label="Journey complete" delta={`Target: 90 kg`} />
        <MetricCard value={`${(latestWeight * 0.348).toFixed(0)}`} unit="kg" label="Est. fat mass" delta={`~${user.leanMassKg.toFixed(0)} kg lean`} deltaColor="teal" />
      </div>

      {/* Weight log */}
      <Card>
        <CardLabel>Log today's weight</CardLabel>
        <CardSub className="mb-3">Saturday morning, post-bathroom, pre-food</CardSub>
        {loggingWeight ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="e.g. 119.2"
              className="flex-1 bg-white/5 border border-gold-muted rounded-lg px-3 py-2.5 text-surface-cream text-[13px] focus:outline-none focus:border-gold"
              autoFocus
            />
            <Button variant="primary" size="sm" onClick={handleLogWeight}>Save</Button>
            <Button variant="ghost" size="sm" onClick={() => setLoggingWeight(false)}>✕</Button>
          </div>
        ) : (
          <Button variant="secondary" fullWidth onClick={() => setLoggingWeight(true)}>
            + Log weight
          </Button>
        )}
      </Card>

      {/* Weight chart */}
      {chartData.length >= 2 && (
        <Card>
          <CardLabel>Weight trend</CardLabel>
          <CardSub className="mb-3">Weekly average · Normal fluctuation expected</CardSub>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8C8880", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8C8880", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1A1C1B",
                    border: "1px solid rgba(200,169,110,0.25)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#F5F2EC",
                  }}
                  formatter={(v) => [`${Number(v).toFixed(1)} kg`, "Weight"]}
                />
                {milestoneRef && (
                  <ReferenceLine
                    y={milestoneRef.rangeMax}
                    stroke="rgba(74,124,111,0.4)"
                    strokeDasharray="4 2"
                    label={{ value: "Next target", fill: "#4A7C6F", fontSize: 10 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#C8A96E"
                  strokeWidth={2}
                  dot={{ fill: "#C8A96E", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#C8A96E" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-stone-app mt-2">
            Travel, sodium, poor sleep and restaurant food can temporarily increase scale weight without equivalent fat gain.
          </p>
        </Card>
      )}

      {/* Weekly score */}
      <Card>
        <CardLabel>Weekly score</CardLabel>
        <div className="flex items-center gap-4 my-2">
          <ScoreRing score={score.totalScore} />
          <div className="flex-1 space-y-0.5">
            <ScoreRow label="Strength sessions" value={`${score.strengthSessions * 10}/30`} max={30} actual={score.strengthSessions * 10} />
            <ScoreRow label="Nutrition adherence" value={`${Math.round((score.nutritionDays / 7) * 25)}/25`} max={25} actual={Math.round((score.nutritionDays / 7) * 25)} />
            <ScoreRow label="Steps" value={`${Math.round(Math.min(score.avgSteps, 10000) / 10000 * 15)}/15`} max={15} actual={Math.round(Math.min(score.avgSteps, 10000) / 10000 * 15)} />
            <ScoreRow label="Travel control" value={`${score.travelDaysControlled * 7}/15`} max={15} actual={score.travelDaysControlled * 7} />
            <ScoreRow label="Recovery" value={`${score.recoveryScore}/10`} max={10} actual={score.recoveryScore} />
            <ScoreRow label="Weekly check-in" value={score.checkedIn ? "5/5" : "0/5"} max={5} actual={score.checkedIn ? 5 : 0} />
          </div>
        </div>
        {score.totalScore > 0 && (
          <div className="mt-2 rounded-lg border border-teal-border bg-teal-bg p-3 text-center">
            <p className="font-serif text-[13px] text-surface-cream">
              &ldquo;{MOTIVATION_MESSAGES.weekCompleted[0]}&rdquo;
            </p>
          </div>
        )}
      </Card>

      {/* Adherence bars */}
      <Card>
        <CardLabel>This week at a glance</CardLabel>
        <div className="mt-2">
          <ProgressBar
            value={(thisWeekWorkouts / 3) * 100}
            label="Strength sessions"
            sublabel={`${thisWeekWorkouts}/3`}
          />
          <ProgressBar
            value={(thisWeekProtein / 7) * 100}
            label="Protein target days"
            sublabel={`${thisWeekProtein}/7`}
          />
          <ProgressBar
            value={Math.min(100, (avgSteps / 8000) * 100)}
            label="Avg daily steps"
            sublabel={avgSteps.toLocaleString()}
            color="teal"
          />
        </div>
        <div className="mt-1">
          {loggingSteps ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                placeholder="e.g. 8500"
                className="flex-1 bg-white/5 border border-gold-muted rounded-lg px-3 py-2.5 text-surface-cream text-[13px] focus:outline-none focus:border-gold"
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={handleLogSteps}>Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setLoggingSteps(false)}>✕</Button>
            </div>
          ) : (
            <Button variant="secondary" fullWidth onClick={() => setLoggingSteps(true)}>
              + Log today's steps
            </Button>
          )}
        </div>
      </Card>

      {/* Milestones */}
      <Card>
        <CardLabel>Weight trajectory</CardLabel>
        <CardSub className="mb-3">Ranges, not rigid targets · Fluctuation is normal</CardSub>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {WEIGHT_MILESTONES.map((m) => {
            const isCurrent =
              !m.achieved && latestWeight >= m.rangeMin && latestWeight <= m.rangeMax + 5;
            const isPast = m.achieved || latestWeight < m.rangeMax;

            return (
              <div
                key={m.date}
                className={`flex-shrink-0 rounded-lg border px-3 py-2.5 text-center ${
                  m.achieved
                    ? "border-teal-border"
                    : isCurrent
                    ? "border-gold"
                    : "border-gold-muted"
                }`}
              >
                <div className={`font-serif text-[15px] ${m.achieved ? "text-teal-light" : isCurrent ? "text-gold" : "text-surface-cream/60"}`}>
                  {m.rangeMin === m.rangeMax
                    ? `${m.rangeMin}`
                    : `${m.rangeMin}–${m.rangeMax}`}
                </div>
                <div className="text-[9px] text-stone-app mt-1 whitespace-nowrap">{m.label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Body composition note */}
      <div className="rounded-lg border border-white/10 bg-white/3 p-3">
        <p className="text-[11px] text-stone-app leading-relaxed">
          Body composition scan every 8–12 weeks. Readings fluctuate with hydration and sodium — compare only under consistent conditions.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  value,
  unit,
  label,
  delta,
  deltaColor = "stone",
}: {
  value: string;
  unit: string;
  label: string;
  delta?: string;
  deltaColor?: "teal" | "stone" | "gold";
}) {
  return (
    <div className="bg-surface-card rounded-app border border-gold-muted p-3.5">
      <span className="font-serif text-2xl text-gold">
        {value}
        {unit && <span className="text-sm ml-0.5">{unit}</span>}
      </span>
      <div className="text-[11px] text-stone-app mt-1">{label}</div>
      {delta && (
        <div className={`text-[10px] mt-0.5 ${deltaColor === "teal" ? "text-teal-light" : deltaColor === "gold" ? "text-gold" : "text-stone-app"}`}>
          {delta}
        </div>
      )}
    </div>
  );
}

function ScoreRow({
  label,
  value,
  max,
  actual,
}: {
  label: string;
  value: string;
  max: number;
  actual: number;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[11px] text-stone-app">{label}</span>
      <span className="text-[11px] text-gold font-medium">{value}</span>
    </div>
  );
}
