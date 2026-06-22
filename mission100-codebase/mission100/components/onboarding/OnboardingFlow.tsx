"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { UserProfile } from "@/types";
import { DEFAULT_USER } from "@/lib/data";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

type Step = {
  id: string;
  question: string;
  type: "number" | "text" | "select" | "multiselect";
  field: keyof UserProfile | string;
  options?: string[];
  unit?: string;
  placeholder?: string;
};

const STEPS: Step[] = [
  { id: "name", question: "What should I call you?", type: "text", field: "name", placeholder: "Your name" },
  { id: "weight", question: "Current weight", type: "number", field: "currentWeightKg", unit: "kg", placeholder: "e.g. 119.8" },
  { id: "target", question: "Target weight", type: "number", field: "targetWeightKg", unit: "kg", placeholder: "e.g. 90" },
  { id: "height", question: "Height", type: "number", field: "heightCm", unit: "cm", placeholder: "e.g. 175" },
  {
    id: "tracking",
    question: "How do you want to track food?",
    type: "select",
    field: "trackingMode",
    options: ["Calorie tracking", "Portion tracking", "Both"],
  },
  {
    id: "activities",
    question: "Preferred activities",
    type: "multiselect",
    field: "preferredActivities",
    options: ["Badminton", "Table tennis", "Walking", "Swimming", "Cycling"],
  },
];

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string | string[]>>({
    name: DEFAULT_USER.name,
    currentWeightKg: String(DEFAULT_USER.currentWeightKg),
    targetWeightKg: String(DEFAULT_USER.targetWeightKg),
    heightCm: String(DEFAULT_USER.heightCm),
    trackingMode: "both",
    preferredActivities: ["badminton", "table-tennis"],
  });

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      const user: UserProfile = {
        ...DEFAULT_USER,
        name: String(values.name || DEFAULT_USER.name),
        currentWeightKg: parseFloat(String(values.currentWeightKg)) || DEFAULT_USER.currentWeightKg,
        targetWeightKg: parseFloat(String(values.targetWeightKg)) || DEFAULT_USER.targetWeightKg,
        heightCm: parseFloat(String(values.heightCm)) || DEFAULT_USER.heightCm,
        trackingMode: (values.trackingMode === "Calorie tracking"
          ? "calories"
          : values.trackingMode === "Portion tracking"
          ? "portions"
          : "both") as UserProfile["trackingMode"],
        preferredActivities: Array.isArray(values.preferredActivities)
          ? values.preferredActivities.map((a) => a.toLowerCase().replace(" ", "-"))
          : DEFAULT_USER.preferredActivities,
        onboardingComplete: true,
      };
      onComplete(user);
    } else {
      setStep((s) => s + 1);
    }
  }

  function setValue(val: string | string[]) {
    setValues((v) => ({ ...v, [currentStep.field]: val }));
  }

  function toggleMulti(option: string) {
    const current = (values[currentStep.field] as string[]) ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setValue(next);
  }

  const canProceed =
    currentStep.type === "multiselect"
      ? ((values[currentStep.field] as string[]) ?? []).length > 0
      : Boolean(values[currentStep.field]);

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex gap-1 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-0.5 rounded-full transition-all",
                i <= step ? "bg-gold" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <p className="text-[11px] text-stone-app uppercase tracking-widest">
          {step + 1} of {STEPS.length}
        </p>
      </div>

      {/* Logo */}
      <div className="mb-12">
        <div className="font-serif text-gold text-2xl">Mission 100</div>
        <div className="text-[12px] text-stone-app mt-1">
          Build consistency around real constraints.
        </div>
      </div>

      {/* Question */}
      <div className="flex-1">
        <h2 className="font-serif text-2xl text-surface-cream mb-6">{currentStep.question}</h2>

        {currentStep.type === "number" || currentStep.type === "text" ? (
          <div className="flex items-center gap-3">
            <input
              type={currentStep.type}
              value={String(values[currentStep.field] ?? "")}
              onChange={(e) => setValue(e.target.value)}
              placeholder={currentStep.placeholder}
              className="flex-1 bg-surface-card border border-gold-muted rounded-app px-4 py-4 text-xl text-surface-cream focus:outline-none focus:border-gold font-medium"
              autoFocus
            />
            {currentStep.unit && (
              <span className="text-stone-app text-lg">{currentStep.unit}</span>
            )}
          </div>
        ) : currentStep.type === "select" ? (
          <div className="space-y-2">
            {currentStep.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => setValue(opt)}
                className={cn(
                  "w-full text-left px-4 py-4 rounded-app border text-[14px] font-medium transition-all",
                  values[currentStep.field] === opt
                    ? "border-gold bg-gold-light text-gold"
                    : "border-gold-muted text-stone-app hover:border-gold hover:text-surface-cream"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {currentStep.options?.map((opt) => {
              const selected = ((values[currentStep.field] as string[]) ?? []).includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleMulti(opt)}
                  className={cn(
                    "w-full text-left px-4 py-4 rounded-app border text-[14px] font-medium transition-all flex items-center justify-between",
                    selected
                      ? "border-gold bg-gold-light text-gold"
                      : "border-gold-muted text-stone-app hover:border-gold hover:text-surface-cream"
                  )}
                >
                  {opt}
                  {selected && (
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <path d="M1.5 6L6 10.5L14.5 1.5" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {isLast ? "Start Mission 100" : "Continue"}
        </Button>
        {step > 0 && (
          <Button variant="ghost" fullWidth onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
