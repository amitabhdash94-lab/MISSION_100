"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import type { WorkoutPlan, Exercise, WorkoutLog } from "@/types";
import { formatTimer, generateId, cn } from "@/lib/utils";

interface WorkoutModeProps {
  plan: WorkoutPlan;
  onComplete: (log: WorkoutLog) => void;
  onExit: () => void;
  date: string;
  shortened?: boolean;
}

type WorkoutPhase = "warmup" | "exercise" | "rest" | "done";

export function WorkoutMode({ plan, onComplete, onExit, date, shortened }: WorkoutModeProps) {
  const allExercises = [
    ...(plan.warmup ?? []),
    ...plan.exercises.filter((e) => !e.id.endsWith("b")),
  ];

  const visibleExercises = shortened ? allExercises.slice(0, Math.ceil(allExercises.length * 0.6)) : allExercises;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<WorkoutPhase>("exercise");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [effort, setEffort] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [painNote, setPainNote] = useState("");
  const [showPainInput, setShowPainInput] = useState(false);
  const [substituteMode, setSubstituteMode] = useState<Record<string, boolean>>({});

  const currentExercise = visibleExercises[exerciseIndex];
  const isLastExercise = exerciseIndex >= visibleExercises.length - 1;
  const isLastSet = currentSet >= (currentExercise?.sets ?? 1);
  const progressPct = Math.round((exerciseIndex / visibleExercises.length) * 100);

  // Timer
  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) {
      if (timerSeconds <= 0 && timerActive) setTimerActive(false);
      return;
    }
    const id = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timerActive, timerSeconds]);

  function startRestTimer(exercise: Exercise) {
    setTimerSeconds(exercise.restSeconds);
    setTimerActive(true);
    setPhase("rest");
  }

  function completeSet() {
    if (!currentExercise) return;

    if (isLastSet) {
      // Exercise done
      setCompletedExercises((prev) => [...prev, currentExercise.id]);
      if (isLastExercise) {
        setPhase("done");
        return;
      }
      startRestTimer(currentExercise);
    } else {
      setCurrentSet((s) => s + 1);
      if (currentExercise.restSeconds > 0) {
        startRestTimer(currentExercise);
      }
    }
  }

  function skipRest() {
    setTimerActive(false);
    setTimerSeconds(0);
    if (isLastSet) {
      setExerciseIndex((i) => i + 1);
      setCurrentSet(1);
    }
    setPhase("exercise");
  }

  function nextExercise() {
    setExerciseIndex((i) => i + 1);
    setCurrentSet(1);
    setPhase("exercise");
    setTimerActive(false);
  }

  function handleComplete() {
    const durationMinutes = Math.round((Date.now() - startTime) / 60000);
    const log: WorkoutLog = {
      id: generateId(),
      date,
      workoutType: plan.id,
      completedExercises,
      perceivedEffort: effort,
      durationMinutes,
      energyLevel: "moderate",
      painNotes: painNote || undefined,
      shortened: shortened ?? false,
    };
    onComplete(log);
  }

  // Done screen
  if (phase === "done") {
    const duration = Math.round((Date.now() - startTime) / 60000);
    return (
      <div className="min-h-screen bg-surface-dark flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">◈</div>
          <h1 className="font-serif text-3xl text-gold mb-2">Session complete</h1>
          <p className="text-stone-app mb-8">{duration} minutes · {completedExercises.length} exercises</p>

          <div className="w-full max-w-sm space-y-3">
            <div className="bg-surface-card rounded-app border border-gold-muted p-4">
              <p className="text-[12px] text-stone-app mb-2">Perceived effort</p>
              <div className="flex gap-1.5 justify-center">
                {([1, 2, 3, 4, 5] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEffort(e)}
                    className={cn(
                      "w-10 h-10 rounded-lg border text-[13px] font-medium transition-all",
                      effort === e ? "border-gold bg-gold-light text-gold" : "border-gold-muted text-stone-app hover:border-gold"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {!showPainInput ? (
              <Button variant="ghost" fullWidth onClick={() => setShowPainInput(true)}>
                + Note any pain or discomfort
              </Button>
            ) : (
              <input
                type="text"
                value={painNote}
                onChange={(e) => setPainNote(e.target.value)}
                placeholder="e.g. left knee mild discomfort"
                className="w-full bg-white/5 border border-gold-muted rounded-lg px-3 py-3 text-[13px] text-surface-cream focus:outline-none focus:border-gold"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="primary" fullWidth onClick={handleComplete}>
            Save workout
          </Button>
          <p className="text-center text-[11px] text-stone-app">
            &ldquo;A shortened workout still counts.&rdquo;
          </p>
        </div>
      </div>
    );
  }

  // Rest timer screen
  if (phase === "rest" && timerActive) {
    const nextEx = visibleExercises[isLastSet ? exerciseIndex + 1 : exerciseIndex];
    return (
      <div className="min-h-screen bg-surface-dark flex flex-col p-6">
        <button onClick={onExit} className="self-start text-stone-app text-[13px] mb-8">
          ← Exit
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-widest text-stone-app mb-4">Rest</p>
          <div className={cn("font-serif text-7xl text-gold mb-4", timerSeconds <= 5 && "timer-active")}>
            {formatTimer(timerSeconds)}
          </div>
          {nextEx && (
            <div className="mt-4">
              <p className="text-[11px] text-stone-app">Next</p>
              <p className="text-surface-cream font-medium mt-1">{nextEx.name}</p>
            </div>
          )}
        </div>
        <Button variant="secondary" fullWidth onClick={skipRest}>
          Skip rest
        </Button>
      </div>
    );
  }

  if (!currentExercise) return null;

  const isWarmup = plan.warmup && exerciseIndex < plan.warmup.length;
  const exId = currentExercise.id;
  const useSubstitute = substituteMode[exId] && currentExercise.substituteId;
  const displayExercise = useSubstitute
    ? plan.exercises.find((e) => e.id === currentExercise.substituteId) ?? currentExercise
    : currentExercise;

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <button onClick={onExit} className="text-stone-app text-[13px] min-h-[44px] flex items-center">← Exit</button>
        <span className="text-[12px] text-stone-app">
          {isWarmup ? "Warm-up" : `${exerciseIndex + 1 - (plan.warmup?.length ?? 0)} of ${visibleExercises.length - (plan.warmup?.length ?? 0)}`}
        </span>
        <span className="text-[12px] text-gold font-medium">{progressPct}%</span>
      </div>

      <div className="flex-1 flex flex-col p-5">
        {/* Exercise info */}
        <div className="mb-6">
          {isWarmup && (
            <p className="text-[11px] text-teal-light uppercase tracking-widest mb-1">Warm-up</p>
          )}
          <h2 className="font-serif text-3xl text-surface-cream leading-tight mb-2">
            {displayExercise.name}
          </h2>
          {displayExercise.notes && (
            <p className="text-[13px] text-stone-app">{displayExercise.notes}</p>
          )}
        </div>

        {/* Set/rep display */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-surface-card rounded-app border border-gold-muted p-4 text-center">
            <span className="font-serif text-4xl text-gold block">{currentSet}</span>
            <span className="text-[11px] text-stone-app uppercase tracking-wide">of {displayExercise.sets} sets</span>
          </div>
          <div className="flex-1 bg-surface-card rounded-app border border-gold-muted p-4 text-center">
            <span className="font-serif text-4xl text-gold block">{displayExercise.repsMin}{displayExercise.repsMax !== displayExercise.repsMin ? `–${displayExercise.repsMax}` : ""}</span>
            <span className="text-[11px] text-stone-app uppercase tracking-wide">reps</span>
          </div>
          <div className="flex-1 bg-surface-card rounded-app border border-gold-muted p-4 text-center">
            <span className="font-serif text-4xl text-stone-app block">{displayExercise.restSeconds}</span>
            <span className="text-[11px] text-stone-app uppercase tracking-wide">sec rest</span>
          </div>
        </div>

        {/* Previous set completion */}
        {currentSet > 1 && (
          <div className="mb-4 flex gap-1">
            {Array.from({ length: currentSet - 1 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-teal-app" />
            ))}
            {Array.from({ length: displayExercise.sets - currentSet + 1 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full border border-gold-muted" />
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="space-y-2">
          <Button variant="primary" fullWidth size="lg" onClick={completeSet}>
            {isLastSet && isLastExercise
              ? "Complete workout"
              : isLastSet
              ? `Set ${currentSet} done → Rest`
              : `Set ${currentSet} done`}
          </Button>

          <div className="flex gap-2">
            {displayExercise.substituteId && (
              <Button
                variant="secondary"
                className="flex-1 text-[11px]"
                onClick={() => setSubstituteMode((m) => ({ ...m, [exId]: !m[exId] }))}
              >
                {useSubstitute ? "Use original" : "Substitute"}
              </Button>
            )}
            <Button
              variant="secondary"
              className="flex-1 text-[11px]"
              onClick={() => setShowPainInput((v) => !v)}
            >
              Pain / adjust
            </Button>
            {!isLastExercise && (
              <Button variant="ghost" className="flex-1 text-[11px]" onClick={nextExercise}>
                Skip
              </Button>
            )}
          </div>

          {showPainInput && (
            <input
              type="text"
              value={painNote}
              onChange={(e) => setPainNote(e.target.value)}
              placeholder="Describe pain or modification"
              className="w-full bg-white/5 border border-gold-muted rounded-lg px-3 py-2.5 text-[13px] text-surface-cream focus:outline-none focus:border-gold"
            />
          )}
        </div>
      </div>
    </div>
  );
}
