"use client";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gold?: boolean;
  teal?: boolean;
  flat?: boolean;
}

export function Card({ children, className, onClick, gold, teal, flat }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-app-lg border p-4",
        flat
          ? "bg-transparent"
          : "bg-surface-card",
        gold
          ? "border-gold-border bg-gold-light"
          : teal
          ? "border-teal-border bg-teal-bg"
          : "border-gold-muted",
        onClick && "cursor-pointer card-interactive",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[10px] font-medium uppercase tracking-[0.1em] text-stone-app mb-2", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("font-serif text-lg text-surface-cream leading-tight mb-1", className)}>
      {children}
    </div>
  );
}

export function CardSub({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-xs text-stone-app leading-relaxed", className)}>
      {children}
    </div>
  );
}
