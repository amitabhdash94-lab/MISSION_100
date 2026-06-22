"use client";
import { cn } from "@/lib/utils";

interface PillProps {
  children: React.ReactNode;
  variant?: "gold" | "teal" | "stone" | "red";
  className?: string;
}

export function Pill({ children, variant = "gold", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-medium px-2.5 py-1 rounded-full tracking-[0.04em]",
        variant === "gold" && "bg-gold-light text-gold",
        variant === "teal" && "bg-teal-bg text-teal-light",
        variant === "stone" && "bg-white/5 text-stone-app",
        variant === "red" && "bg-red-500/10 text-red-400",
        className
      )}
    >
      {children}
    </span>
  );
}
