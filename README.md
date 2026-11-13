# Pawlane — boutique mobile pet care (frontend)

Booking site for neighborhood dog walks, private puppy socialization, drop-in visits and sitter consults. Everything runs on dummy data. A backend can be plugged in later without touching the UI.

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · Tailwind CSS v4 · Motion · lucide-react · TypeScript

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + type check
```

## Screens

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero with a live-route widget, quick-book bar, services, how it works, interactive coverage map with ZIP check, testimonials, FAQ |
| `/book` | 5-step booking wizard: **Service → Address (ZIP → lane) → Pets → Schedule → Review**, then a confirmation screen. Supports one-off visits and recurring weekly slots (e.g. every Tue & Thu at 2 PM), lane-day pricing, an inline "add pet" profile form, and a draft saved in `sessionStorage`. Accepts `?service=` and `?zip=` |
| `/account` | Client portal overview: next visit, upcoming visits (skip/undo), last walk report, pets, vaccine alerts |
| `/account/pets` · `/account/pets/[id]` | Pet profiles: breed, vaccination records with expiry status, behavior notes, care info, visit reports |
| `/account/plans` | Recurring plans: pause, resume, change days/time, end plan |
| `/admin` | Ops "Today": KPIs, map of today's lane routes, request queue (approve/decline), ordered stop list per lane |
| `/admin/routes` | Lane-load matrix (lanes × days), per-day route map, suggestions to move off-lane bookings |
| `/admin/bookings` | Searchable and filterable bookings table with approve/decline |

## Core idea: lanes

Each ZIP code belongs to a **lane** (a neighborhood) that has one walker and set **lane days**. Visits on a lane day get a small discount. The planner groups each day's bookings by lane, so walkers don't zigzag across town. `src/lib/routing.ts` orders the stops and compares drive time against time-ordered dispatch.

## Project layout

```text
src/
  app/                  routes (site, book, account, admin)
  components/
    ui/                 primitives: Button, Badge, Field, Eyebrow
    shared/             Logo, PetAvatar, status badges, RouteMap (SVG)
    marketing/          landing-page sections
    booking/            wizard steps, calendar, pet form, summary
    account/            client portal pieces
    admin/              ops dashboard pieces
  lib/
    api.ts              ← the only data-access layer (swap point for the backend)
    types.ts            domain types: Pet, Booking, Subscription, Zone…
    data/               dummy data (services, zones, clients, pets, bookings)
    booking.ts          pricing, availability, booking draft
    routing.ts          lane grouping and route ordering
    schedule.ts         date helpers and recurrence expansion
```

## Connecting the backend

1. Replace the function bodies in `src/lib/api.ts` with real `fetch` calls and keep the return types from `src/lib/types.ts`.
2. Replace the simulated submit in `components/booking/booking-wizard.tsx` (`submit`) with `POST /bookings`.
3. Approve/decline, skip, pause and plan edits currently update local state only. Search for `useState` in `components/admin` and `components/account` to wire them to mutations.
4. The demo clock is fixed at `TODAY` in `src/lib/schedule.ts` so every screen agrees. Switch it to the real date once data is live.
5. Availability (`spotsLeft`, `recurringOpen` in `lib/booking.ts`) is faked from a hash and should come from the API.

Photos come from Unsplash via a custom image loader (`src/lib/image-loader.ts`).
