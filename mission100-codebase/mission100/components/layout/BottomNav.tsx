"use client";
import type { ActiveScreen } from "@/types";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  active: ActiveScreen;
  onChange: (screen: ActiveScreen) => void;
}

const NAV_ITEMS: { id: ActiveScreen; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
  { id: "food", label: "Food" },
  { id: "progress", label: "Progress" },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bg-surface-dark border-t border-gold-muted flex safe-bottom">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "flex-1 text-center py-3.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors border-t-2",
            active === item.id
              ? "text-gold border-gold"
              : "text-stone-app border-transparent hover:text-surface-cream"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

// Sidebar nav for iPad landscape
export function SideNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bg-surface-dark border-r border-gold-muted flex flex-col pt-8 px-4 gap-1">
      <div className="font-serif text-gold text-lg mb-8 px-3">Mission 100</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "text-left px-3 py-3 rounded-app text-sm font-medium transition-all",
            active === item.id
              ? "text-gold bg-gold-light border border-gold-muted"
              : "text-stone-app hover:text-surface-cream hover:bg-white/5"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
