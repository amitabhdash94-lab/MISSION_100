"use client";
import { useState } from "react";
import { Card, CardLabel, CardTitle, CardSub } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { FoodMode } from "@/types";
import { cn } from "@/lib/utils";

interface FoodScreenProps {
  foodMode: FoodMode;
  proteinTarget: number;
}

type MealTab = "breakfast" | "lunch" | "snack" | "dinner";
type PlateItem = "protein" | "veg" | "carb" | "fruit" | "coffee" | "dessert" | "extra-protein" | "extra-carb";

const PLATE_ITEMS: { id: PlateItem; icon: string; label: string; warn?: boolean; gold?: boolean }[] = [
  { id: "protein", icon: "🥚", label: "3 eggs", gold: true },
  { id: "extra-protein", icon: "🍗", label: "+ protein", gold: true },
  { id: "carb", icon: "🍚", label: "1 carb" },
  { id: "fruit", icon: "🍓", label: "Fruit" },
  { id: "veg", icon: "🥗", label: "Vegetables" },
  { id: "coffee", icon: "☕", label: "Coffee" },
  { id: "dessert", icon: "🍩", label: "Dessert?", warn: true },
  { id: "extra-carb", icon: "🫓", label: "2nd carb?", warn: true },
];

const SNACK_OPTIONS = [
  "Roasted chana",
  "Buttermilk",
  "Protein shake",
  "Fruit",
  "Measured nuts",
  "Boiled eggs",
];

const HOME_MEALS = {
  breakfast: [
    "Eggs + toast",
    "Idli + sambar",
    "Besan chilla + curd",
    "Paneer bhurji",
    "Dosa + eggs or sambar",
  ],
  lunch: ["150–250g cooked protein", "Dal + vegetables", "2 rotis or measured rice", "Curd"],
  dinner: ["Similar to lunch", "Slightly lower carbs", "Unless high-intensity badminton day"],
};

export function FoodScreen({ foodMode, proteinTarget }: FoodScreenProps) {
  const [activeTab, setActiveTab] = useState<MealTab>("breakfast");
  const [selectedItems, setSelectedItems] = useState<Set<PlateItem>>(new Set(["protein", "extra-protein"]));

  function toggleItem(id: PlateItem) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const proteinFromSelection = Array.from(selectedItems).reduce((sum, id) => {
    const estimates: Partial<Record<PlateItem, number>> = {
      protein: 18, "extra-protein": 20, veg: 5, carb: 6, fruit: 2, coffee: 1, dessert: 3,
    };
    return sum + (estimates[id] ?? 0);
  }, 0);

  const TABS: MealTab[] = ["breakfast", "lunch", "snack", "dinner"];

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Meal tabs */}
      <div className="flex gap-1 bg-surface-card rounded-app p-1 border border-gold-muted">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 text-[11px] font-medium rounded transition-all capitalize",
              activeTab === tab
                ? "bg-gold text-surface-dark"
                : "text-stone-app hover:text-surface-cream"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Breakfast — buffet builder */}
      {activeTab === "breakfast" && (
        <>
          {(foodMode === "hotel-buffet" || foodMode === "client-meal") ? (
            <Card>
              <CardLabel>Buffet mode · Breakfast</CardLabel>
              <CardTitle>Build your plate</CardTitle>
              <CardSub>Tap to confirm choices · Walk the line once first</CardSub>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {PLATE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "rounded-lg border py-2.5 px-1 text-center transition-all",
                      item.warn
                        ? selectedItems.has(item.id)
                          ? "border-red-400/60 bg-red-500/10"
                          : "border-red-400/20 hover:border-red-400/40"
                        : item.gold
                        ? selectedItems.has(item.id)
                          ? "border-gold bg-gold-light"
                          : "border-gold-muted hover:border-gold"
                        : selectedItems.has(item.id)
                        ? "border-teal-border bg-teal-bg"
                        : "border-gold-muted hover:border-gold/40"
                    )}
                  >
                    <span className="text-lg block">{item.icon}</span>
                    <span className={cn(
                      "text-[10px] block mt-0.5",
                      item.warn ? "text-red-400/70" : selectedItems.has(item.id) ? item.gold ? "text-gold" : "text-teal-light" : "text-stone-app"
                    )}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between p-2.5 bg-white/5 rounded-lg">
                <span className="text-[12px] text-stone-app">Est. protein</span>
                <span className={cn("text-[13px] font-semibold", proteinFromSelection >= 35 ? "text-teal-light" : "text-gold")}>
                  ~{proteinFromSelection}g / 35–45g target
                </span>
              </div>

              <div className="mt-3 border-l-2 border-gold pl-3 space-y-1.5">
                <p className="text-[11px] text-stone-app">Walk the buffet once before serving.</p>
                <p className="text-[11px] text-stone-app">Protein and vegetables first.</p>
                <p className="text-[11px] text-stone-app">One carbohydrate — not two.</p>
                <p className="text-[12px] text-gold font-medium">You may eat anything, not everything.</p>
              </div>

              <div className="mt-3 border-t border-white/5 pt-3">
                <p className="text-[11px] text-stone-app mb-2">Avoid stacking:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Paratha", "Dosa + poori", "Croissant", "Juice", "Sugary coffee"].map((item) => (
                    <span key={item} className="text-[10px] px-2 py-1 rounded-full border border-red-400/20 text-red-400/70">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-stone-app mt-2">The issue is cumulative selection, not any single item.</p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardLabel>Home breakfast</CardLabel>
              <CardTitle>Suggested options</CardTitle>
              <div className="mt-2 space-y-2">
                {HOME_MEALS.breakfast.map((opt) => (
                  <div key={opt} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-[13px] text-surface-cream">{opt}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Lunch */}
      {activeTab === "lunch" && (
        <Card>
          <CardLabel>
            {foodMode === "client-meal" ? "Client lunch" : "Lunch"}
          </CardLabel>
          <CardTitle>Plate method</CardTitle>
          <CardSub>Visual portions · No calorie counting needed</CardSub>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <PlateZone fraction="½" icon="🥦" label="Vegetables" color="teal" />
            <PlateZone fraction="¼" icon="🍗" label="Protein" color="gold" />
            <PlateZone fraction="¼" icon="🍛" label="Rice or roti" color="stone" />
          </div>

          <div className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
            <p className="text-[12px] text-stone-app">Protein priority:</p>
            {["Chicken, fish or eggs", "Paneer, tofu or soy", "Dal + curd"].map((p, i) => (
              <div key={p} className="flex items-center gap-2 text-[12px] text-surface-cream">
                <span className="text-gold font-medium">{i + 1}.</span> {p}
              </div>
            ))}
          </div>

          <div className="mt-3 border-l-2 border-gold pl-3 text-[12px] text-gold font-medium">
            Default: 2 rotis, or 1 moderate bowl of rice. Not both.
          </div>

          {foodMode === "home-food" || foodMode === "home-relaxed" ? (
            <div className="mt-3 border-t border-white/5 pt-3 space-y-1">
              {HOME_MEALS.lunch.map((item) => (
                <p key={item} className="text-[12px] text-stone-app">• {item}</p>
              ))}
            </div>
          ) : null}
        </Card>
      )}

      {/* Snack */}
      {activeTab === "snack" && (
        <Card>
          <CardLabel>Mid-day snack</CardLabel>
          <CardTitle>25–30g protein target</CardTitle>
          <CardSub>Prevent all-day grazing · One planned snack</CardSub>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {SNACK_OPTIONS.map((snack) => (
              <div
                key={snack}
                className="flex items-center gap-2 p-3 rounded-lg border border-gold-muted bg-white/3 text-[13px] text-surface-cream"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-app flex-shrink-0" />
                {snack}
              </div>
            ))}
          </div>

          <div className="mt-3 border-l-2 border-teal-app pl-3 text-[12px] text-stone-app leading-relaxed">
            Prevent all-day grazing. One planned snack, not continuous picking through travel or client downtime.
          </div>
        </Card>
      )}

      {/* Dinner */}
      {activeTab === "dinner" && (
        <Card>
          <CardLabel>Dinner</CardLabel>
          <CardTitle>
            {foodMode === "hotel-buffet" ? "Hotel buffet dinner" : "Home dinner"}
          </CardTitle>

          {foodMode === "hotel-buffet" ? (
            <>
              <div className="mt-3 space-y-2">
                {["Protein", "Vegetables", "Dal", "Salad", "One controlled carb"].map((item) => (
                  <div key={item} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-[13px] text-surface-cream">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-l-2 border-gold pl-3 space-y-1.5">
                <p className="text-[12px] text-gold font-medium">One main plate.</p>
                <p className="text-[12px] text-stone-app">Second serving only for protein or vegetables.</p>
                <p className="text-[12px] text-stone-app">One small dessert — max twice per week.</p>
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 space-y-1.5">
                {HOME_MEALS.dinner.map((item) => (
                  <p key={item} className="text-[12px] text-stone-app">• {item}</p>
                ))}
              </div>
              <div className="mt-3 border-l-2 border-teal-app pl-3 text-[12px] text-stone-app leading-relaxed">
                One enjoyable meal per weekend is allowed. One enjoyable meal ≠ an unrestricted weekend.
              </div>
            </>
          )}
        </Card>
      )}

      {/* Daily protein tracker */}
      <Card>
        <CardLabel>Protein distribution target</CardLabel>
        <div className="space-y-2 mt-1">
          {[
            { meal: "Breakfast", target: "35–45g" },
            { meal: "Lunch", target: "40–50g" },
            { meal: "Snack", target: "20–30g" },
            { meal: "Dinner", target: "45–55g" },
          ].map((m) => (
            <div key={m.meal} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-[12px] text-stone-app">{m.meal}</span>
              <span className="text-[12px] font-medium text-gold">{m.target}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[13px] font-medium text-surface-cream">Daily total</span>
            <span className="text-[13px] font-semibold text-teal-light">{proteinTarget}g</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PlateZone({
  fraction,
  icon,
  label,
  color,
}: {
  fraction: string;
  icon: string;
  label: string;
  color: "gold" | "teal" | "stone";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-center",
        color === "gold" && "border-gold-border bg-gold-light",
        color === "teal" && "border-teal-border bg-teal-bg",
        color === "stone" && "border-white/10 bg-white/3"
      )}
    >
      <span className="text-xl block">{icon}</span>
      <span className="text-[11px] text-stone-app block mt-1">{fraction} plate</span>
      <span className={cn("text-[11px] font-medium block mt-0.5", color === "gold" ? "text-gold" : color === "teal" ? "text-teal-light" : "text-stone-app")}>
        {label}
      </span>
    </div>
  );
}
