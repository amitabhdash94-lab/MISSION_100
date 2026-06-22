"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label: string;
  sublabel?: string;
  color?: "gold" | "teal" | "stone";
  className?: string;
}

export function ProgressBar({ value, label, sublabel, color = "gold", className }: ProgressBarProps) {
  return (
    <div className={cn("mb-3", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-stone-app">{label}</span>
        {sublabel && (
          <span className="text-xs font-medium text-surface-cream">{sublabel}</span>
        )}
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color === "gold" && "bg-gold",
            color === "teal" && "bg-teal-app",
            color === "stone" && "bg-stone-app"
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 72, strokeWidth = 6 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Weekly score ${score} out of 100`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(200,169,110,0.12)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#C8A96E"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="progress-ring-circle"
      />
      <text
        x={size / 2}
        y={size / 2 + 6}
        textAnchor="middle"
        style={{ fontFamily: "DM Serif Display, serif", fontSize: size * 0.22, fill: "#C8A96E" }}
      >
        {score}
      </text>
    </svg>
  );
}
