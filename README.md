# Smart Roster Manager

Browser-based monthly roster planner for multiple brands, processes and pods. Single static file (`index.html`, vanilla JS), no build step, no backend.

## Project structure
```
index.html        page markup
src/styles.css    styles
src/data.js       sample data
src/logic.js      scheduling and validation logic (no DOM)
src/ui.js         rendering, events, persistence
tests/            node tests for the logic (npm test)
```

## Run
Open `index.html`, or deploy the folder to Vercel/Netlify/GitHub Pages. No `.env` needed.

## Features
- 34 sample employees, 27 brands (22 single-resource = 81%), 4 pods with leads
- Per-process calendars: 365 days / daily except holidays / Sundays and holidays off, plus minimum staff
- Roster generator (weekly offs, leaves, comp-offs, public holidays, preferences, Sunday-off rotation)
- Views: company, pod, brand, process, employee; click a cell to override
- Conflict detection with plain-language reasons and backup suggestions
- Publish gate (blocked while coverage gaps exist), change simulation, simulated pod-lead notification
- Add employees, brands and assignments in the UI; CSV export

## Assumptions
One weekly off per 7-day week (a leave or a closed day counts as that off); max 6 consecutive working days (warning); required coverage outranks preferred off day; an employee counts toward every process they are assigned to; partial weeks under 5 days get no weekly off.

## How I think
1. **Model:** pods, brands (each with processes: calendar + min staff), employees (pod, preferred off day, leaves, comp-offs, list of brand/process assignments). Brand-employee links live only in assignments, so any shape is possible.
2. **Generation and checking:** operating calendar is separate from employee status. Each employee-day resolves to leave, comp-off, weekly off, closed or working. The generator places weekly offs greedily (least flexible employees first) on the day that avoids dropping any assigned process below minimum, then prefers the preferred day. A separate validator recounts coverage for every open process-day, so manual edits are checked the same way.
3. **Single vs multi:** a single-resource brand has no slack, so a weekly off on an open day is an unavoidable gap, flagged as "single resource". Multi-employee brands are staggered, and shared processes keep coverage while one person is off.
4. **Unavailable sole owner:** the gap is flagged per process and day, with who is unavailable and why, and a ranked backup (same pod, free that day first).
5. **Conflicts:** mandatory (coverage, no assigned employee) are errors and block publishing; preferences and overload (more than 2 brands a day) are warnings. Nothing is silently fixed.
6. **Automation vs human:** automated: offs, validation, suggestions. Human: leave approval, backup choice, publishing, overrides.
7. **Doubling:**use a better database and data warehouse to process the information without causing additional chaos
8. **One more week:**i would make the ui better make it more accesible to users and make the using process more simple for the user.

## Later additions
- Day-specific minimum staffing (Brand/Process view, "Specific day")
- Plan comparison: Balanced, Preference-first, Fairness-first, scored on gap days, preference misses and Sunday-off spread
- Auto-regeneration after a leave or comp-off (toggle), showing gap-days before and after
- "Explain this conflict": rule-based plain-language cause and fix options. It is deterministic, not an LLM call, so it is predictable and works offline.

## Final additions
- **Shifts:** employees have a shift (G any, M morning, E evening) and processes can require one. A shift mismatch, or two processes on incompatible shifts, is a blocking error.
- **Fixed weekly-off patterns:** set per employee in the Employee view. The generator honours it even if coverage suffers, and the resulting gap is flagged.
- **Sample data:** UrbanNest CS needs 2 people on 365 days (3 staff), one employee works across two brands, and one shift conflict is left in on purpose to show validation.
- **Edit and remove:** rename, change pod, shift and weekly off, or remove an employee. Assignments can be added and removed too.
- **Persistence:** data is saved in the browser (localStorage); "Reset data" restores the sample.
- **Apply backups:** one click adds the suggested backup to the gap days.
- **Comp-offs:** working a public holiday creates a "comp-off owed" warning; "Auto-grant comp-offs" schedules them on days with surplus coverage.
