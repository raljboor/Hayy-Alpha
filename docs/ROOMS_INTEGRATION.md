# Rooms branch → main integration plan

Branch: `claude/gifted-mccarthy-iwXu1` (the rooms work) → `main`.

Grounded in an actual `git merge-tree` dry-run between the two branches.
A merge will succeed without manual conflict resolution on most files —
only three files have real conflicts.

## Conflict map

| File | What `main` has | What this branch has | Recommended resolution |
|------|------------------|----------------------|------------------------|
| `src/App.tsx` | Added `RequireOnboarded` wrapping `/app` and `/app/rooms/:id/live` | Added `/app/rooms/schedule`, `/app/rooms/:id/recap`, `/app/rooms/:id/green` routes | **Combine.** Keep main's `RequireOnboarded` gate, add this branch's three routes inside it (`schedule` and `recap` under the `/app` `AppLayout` block; `green` as a sibling to `/live`, also wrapped in `RequireAuth` + `RequireOnboarded`). |
| `src/pages/app/RoomsList.tsx` | 7781723 version: react-query, bucketed `Tonight / Tomorrow / This week / Later`, inline create-room modal | This branch: `useAsync`, day-by-day by actual date, `Propose a room` → `/app/rooms/schedule`, ended → recap | **Mostly this branch** (the schedule-route flow is what we want now). Optionally lift main's bucket labels on top of this branch's structure if you prefer that grouping over actual-weekday names. Drop main's inline create modal — `ScheduleRoom` replaces it. |
| `src/pages/app/LiveRoom.tsx` | 7781723's Stage direction (`LiveRoomA`), react-query | This branch's Circle direction (`LiveRoomB`), `useAsync` | **This branch.** Circle was explicitly requested. |

## Everything else (no conflict)

- **Purely additive from this branch — take as-is**:
  - `src/pages/app/RoomDetail.tsx` (main's is still the old lucide version)
  - `src/pages/app/GreenRoom.tsx`, `src/pages/app/ScheduleRoom.tsx`, `src/pages/app/RoomRecap.tsx`
  - `src/lib/adapters/roomContentAdapter.ts`
  - New exports in `src/lib/api/rooms.ts` (`getRoomAgenda`, `getRoomRules`, `getRoomHosts`, `DEFAULT_AGENDA`, `DEFAULT_RULES`, host-participant write in `createRoom`)
  - `supabase/migrations/008_room_agenda_and_rules.sql`
- **Only main changed — keep as-is**:
  `Profile.tsx`, `AppSidebar.tsx` (palette toggle), `src/lib/palette.ts`, `RequireOnboarded`, `routing.ts`, `Dashboard.tsx`, `Onboarding.tsx`, `Settings.tsx`, `Login/Signup`, `index.css`, `supabase/migrations/007_add_onboarding_completed.sql`, etc.

## Migrations

No collision — this branch's migration is already renumbered to `008`. They apply in order: `007_add_onboarding_completed` → `008_room_agenda_and_rules`.

## Suggested merge mechanics

1. From `main`: `git merge --no-ff claude/gifted-mccarthy-iwXu1`.
2. Resolve the three conflicts per the table above. Most of the work is `App.tsx`; `LiveRoom` and `RoomsList` are "take ours" decisions.
3. **Optional consistency pass** — this branch's new pages use `useAsync` while the rest of the redesigned main uses `@tanstack/react-query`. Converting `RoomDetail` / `GreenRoom` / `ScheduleRoom` / `RoomRecap` to `useQuery` would unify them with `Dashboard` / `LiveRoom` / `RoomsList`. Not blocking.
4. Verify:
   ```
   npm ci
   npx vite build
   npx eslint .
   npx tsc -p tsconfig.app.json --noEmit
   ```
   The 4 pre-existing tsc errors in `referralsAdapter` / `auth` / `messages` will still be present — they pre-date both branches.
5. Manual smoke:
   - `/app/rooms` → click a room → Join → Green Room → Live
   - `/app/rooms/schedule` create
   - `/app/rooms/:id/recap` for an ended room
   - Theme toggle still works in the sidebar (from main)

## Final commits on this branch (in order)

```
59dd93b  Polish ScheduleRoom and RoomRecap against the real room record
a7d218a  Renumber rooms migration 007 → 008 to clear main's 007 collision
a5a66c4  Load room agenda, rules, and hosts from the database
cd0c272  Scaffold Green Room, Schedule a Room, and Post-room Recap
2bfa56b  Port LiveRoom to redesign Circle direction
735e0dd  Port RoomDetail to redesign idiom
16f1a14  Port RoomsList to redesign agenda-timeline layout
```
