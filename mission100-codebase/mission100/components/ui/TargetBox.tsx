"use client";
import { cn } from "@/lib/utils";

interface TargetBoxProps {
  value: string | number;
  label: string;
  color?: "gold" | "teal" | "stone";
  className?: string;
}

export function TargetBox({ value, label, color = "gold", className }: TargetBoxProps) {
  return (
    <div
      className={cn(
        "flex-1 rounded-lg border p-2.5 text-center",
        color === "gold" && "bg-gold-light border-gold-muted",
        color === "teal" && "bg-teal-bg border-teal-border",
        color === "stone" && "bg-white/5 border-white/10",
        className
      )}
    >
      <span
        className={cn(
          "font-serif text-xl block",
          color === "gold" && "text-gold",
          color === "teal" && "text-teal-light",
          color === "stone" && "text-stone-app"
        )}
      >
        {value}
      </span>
      <div className="text-[10px] text-stone-app uppercase tracking-[0.07em] mt-0.5">{label}</div>
    </div>
  );
}

export function TargetRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex gap-2 mt-2.5", className)}>{children}</div>;
}
