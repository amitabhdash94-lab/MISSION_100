# Mission 100

Adaptive travel fitness coach. 119.8 kg → 90 kg by May 2027.

Built for a frequent business traveller (Bangalore ↔ Ahmedabad) who needs a plan that bends around a real weekly schedule rather than assuming identical training days.

---

## Philosophy

> Build consistency around real constraints rather than designing an ideal routine the user cannot sustain.

A successful week: three strength sessions, one moderate cardio, one badminton, protein on five days, no uncontrolled travel binge, one weekly weigh-in.

---

## Stack

- **Next.js 15** (App Router, static export)
- **TypeScript**
- **Tailwind CSS** with custom design tokens
- **Recharts** for weight trend charts
- **localStorage** for MVP persistence (Supabase migration path in README)

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Build and deploy

```bash
npm run build
```

The `out/` directory is a static site ready for Vercel, Netlify, or any static host.

---

## Project structure

```
app/
  layout.tsx          Root layout, PWA meta, font loading
  globals.css         Design tokens, typography, animations
  page.tsx            Main app: state, routing, data layer

types/index.ts        All TypeScript types

lib/
  data.ts             Seed data: user, workout plans, milestones
  storage.ts          localStorage CRUD + weekly score computation
  utils.ts            Date helpers, formatters, schedule utilities

components/
  layout/             AppHeader, BottomNav, SideNav
  ui/                 Card, Button, Pill, Progress, TargetBox
  today/              TodayScreen (workout + nutrition + check-in)
  week/               WeekScreen (7-day strip, Sat/Sun swap)
  food/               FoodScreen (buffet builder, plate method)
  progress/           ProgressScreen (weight chart, score ring)
  workout/            WorkoutMode (active session, rest timer)
  onboarding/         OnboardingFlow (6-step setup)
```

---

## Configuring plans

All plans live in `lib/data.ts`. Edit these to adjust:

- `DEFAULT_USER` — calorie ranges, protein target, start date
- `DEFAULT_WEEK_SCHEDULE` — day types, locations, step targets
- `WORKOUT_PLANS` — exercises, sets, reps, fallback versions
- `WEIGHT_MILESTONES` — trajectory ranges by date
- `MOTIVATION_MESSAGES` — all in-app copy
- `STEP_TARGETS_BY_WEEK` — progressive target by week

---

## Supabase migration

1. `npm install @supabase/supabase-js`
2. Create tables matching the types in `types/index.ts`
3. Replace functions in `lib/storage.ts` with Supabase queries
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

Every entity has an `id` field and ISO date strings — the model is migration-ready.

---

## PWA installation (iPad)

1. Open in Safari
2. Share button → Add to Home Screen
3. Opens in standalone mode with no browser chrome

---

## Adjustment logic

Progress evaluated after three complete weeks only:

- < 0.3 kg/week: reduce intake 150–200 kcal or add ~1,500 daily steps
- 0.4–0.9 kg/week: continue unchanged
- > 1 kg/week with fatigue: increase intake 150–200 kcal
- Strength falling: review sleep and protein before cutting calories further

One variable changed at a time.
