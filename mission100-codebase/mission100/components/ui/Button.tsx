"use client";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-sans font-semibold rounded-app transition-all duration-150 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
        variant === "primary" && "bg-gold text-surface-dark hover:bg-yellow-400",
        variant === "secondary" &&
          "bg-transparent text-stone-app border border-gold-muted hover:border-gold hover:text-surface-cream",
        variant === "ghost" &&
          "bg-transparent text-stone-app hover:text-surface-cream",
        variant === "danger" &&
          "bg-transparent text-red-400 border border-red-400/30 hover:border-red-400",
        size === "sm" && "text-xs px-3 py-2",
        size === "md" && "text-[13px] px-4 py-3",
        size === "lg" && "text-sm px-6 py-4",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
