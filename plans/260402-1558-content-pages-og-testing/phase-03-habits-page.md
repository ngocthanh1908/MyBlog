# Phase 3: Habits Page

## Context Links
- Current placeholder: `src/app/habits/page.tsx`
- Homepage card: `src/components/home/latest-run-card.tsx` (static run data pattern)
- User profile: Marathon runner, MAF method blog post exists

## Overview
- **Priority:** P2
- **Status:** Pending
- **Description:** Running/fitness tracker page with static data. Weekly summary, personal records, current goals. No external API — user updates a data file manually.

## Key Insights
- `LatestRunCard` already shows distance/HR/pace pattern — extend this
- Blog post `running-maf-method.mdx` exists, can cross-link
- Keep data static in TS file — no Strava API (YAGNI). User updates after runs.
- MAF (Maximum Aerobic Function) training is key theme for this user

## Requirements
**Functional:**
- Current stats section: weekly distance, monthly distance, total runs
- Latest run detail: date, distance, pace, avg HR, notes
- Personal records: 5K, 10K, half marathon, marathon times
- Current goals: target race, weekly mileage goal, HR zone target
- Running philosophy/quote section

**Non-functional:**
- All data from single `habits-data.ts` file
- Server component, no client JS
- SEO metadata

## Architecture
```
src/data/habits-data.ts                → run stats, PRs, goals, latest run
src/app/habits/page.tsx                → server component, sections layout
src/components/habits/stat-card.tsx     → reusable stat display (number + label)
src/components/habits/personal-records-table.tsx → PR table
```

**Data flow:** `habits-data.ts` -> `page.tsx` renders sections using child components

## Related Code Files
- **Modify:** `src/app/habits/page.tsx`
- **Create:** `src/data/habits-data.ts`, `src/components/habits/stat-card.tsx`, `src/components/habits/personal-records-table.tsx`

## Implementation Steps
1. Create `src/data/habits-data.ts`:
   - `latestRun`: { date, distance, pace, avgHR, notes }
   - `weeklyStats`: { totalDistance, totalRuns, avgPace }
   - `personalRecords`: array of { event, time, date }
   - `currentGoals`: array of { goal, target, progress }
   - `philosophy`: string (running quote/mindset)
2. Create `src/components/habits/stat-card.tsx`:
   - Takes value, label, optional icon
   - Same surface/border styling as BentoCard
3. Create `src/components/habits/personal-records-table.tsx`:
   - Simple table: Event | Time | Date
   - Styled with existing tokens
4. Update `src/app/habits/page.tsx`:
   - Add `generateMetadata()`
   - Sections: Latest Run stats -> Weekly Summary (stat cards grid) -> Personal Records table -> Current Goals -> Philosophy quote
   - FadeUp animations per section
5. Verify build: `npm run build`

## Todo List
- [ ] Create `src/data/habits-data.ts` with running data structure
- [ ] Create `src/components/habits/stat-card.tsx`
- [ ] Create `src/components/habits/personal-records-table.tsx`
- [ ] Rewrite `src/app/habits/page.tsx` with all sections
- [ ] Add page metadata
- [ ] Verify build succeeds

## Success Criteria
- Habits page shows structured running data
- Updating a run = editing one object in data file
- Stats grid responsive (4 cols desktop, 2 mobile)
- Personal records render in clean table

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data gets stale if user forgets to update | Medium | Low | Add comment in data file with update instructions |
| Scope creep to Strava API integration | Medium | Medium | Explicitly out of scope — future phase if needed |

## Security Considerations
- No external data fetching — pure static data, no injection vectors

## Next Steps
- User populates real running data in `habits-data.ts`
- Future: Strava API integration could replace static data (separate plan)
