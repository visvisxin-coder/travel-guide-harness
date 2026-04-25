# Skill: plan-itinerary

## Description

Turn destination research and traveler context into a structured, practical daily route. The output is a valid `content/structured/{slug}.json` file that passes schema validation and content invariant checks.

## When to Use

- After destination research is complete and the brief is written
- When the user explicitly wants a route planned
- When updating an existing route (re-pacing, re-routing)

## When NOT to Use

- When no destination brief exists yet (run `discover-destination` first)
- When the user wants free exploration without a fixed itinerary
- When only minor adjustments are needed (edit the JSON directly)

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| City brief | `content/drafts/{city}-brief.md` | Research output from discover-destination |
| Visit type | `config/trip_context.yaml` → `visit_type` | first_time / return_visit / local_refresh |
| Exclusions | `config/trip_context.yaml` → `exclude` | Items to explicitly exclude |
| Visited before | `config/trip_context.yaml` → `visited_before` | Items already seen |
| Prioritization | `config/trip_context.yaml` → `prioritize` | Preferred neighborhoods, themes, food |
| Traveler profile | `config/traveler_profile.yaml` | Pace, budget, interests, walking tolerance |
| Transport prefs | `config/transport_preferences.yaml` | Mode preferences, constraints |
| Schema | `schemas/guide.schema.json` | Defines valid JSON structure |

## Outputs

| Output | Path |
|--------|------|
| Structured guide JSON | `content/structured/{slug}.json` |

## Steps

1. **Read inputs.**
   - City brief, traveler profile, trip context, transport prefs.
   - Validate that destination research is complete.

2. **Group places by geography and theme.**
   - Assign each day to one area or route theme (e.g., "外滩与老城厢", "浦东天际线").
   - If `return_visit`, remove items from `visited_before.attractions` and `visited_before.neighborhoods`. Apply `exclude` list.
   - Respect `prioritize.neighborhoods` and `prioritize.themes` for return visits.

3. **Limit each day to 3–4 major stops (INV-4).**
   - Each stop must have morning/afternoon/evening placement (INV-3).
   - Leave buffer time for meals, rest, and unexpected delays.
   - Respect `traveler_profile.walking_tolerance_per_day`.

4. **For each stop, specify:**
   - `time` — approximate arrival time
   - `period` — 上午 / 下午 / 晚上
   - `place` — specific name
   - `duration` — e.g. "2h"
   - `transport` — how to get there from the previous stop
   - `budget` — cost level or specific estimates
   - `why` — why this stop fits this day and this traveler

5. **Write `overview` fields.**
   - `best_for`: 2-4 tags describing who this route suits
   - `pace`: light / moderate / relaxed / intensive
   - `budget_level`: budget / moderate / premium
   - `route_logic`: one sentence explaining the structure

6. **Write `backup_plans`.**
   - At minimum: rain plan and low-energy plan (INV-6).
   - If applicable: crowded-day plan, cold-weather plan.

7. **Validate the JSON.**
   - Run `node scripts/validate_content.js content/structured/{slug}.json`
   - Check against `schemas/guide.schema.json` using any JSON Schema validator

8. **Ask route-planner-critic to review.**
   - Geographic coherence: are stops on the same day reasonably close?
   - Pacing: does each day feel rushed or empty?
   - Return-visit fit: does the route avoid excluded/visited items? (INV-12, INV-13)
   - Feasibility: are durations and transport estimates realistic?
   - Backup plans: do they address real failure modes?

## Quality Gates

- [ ] JSON passes `node scripts/validate_content.js` (field completeness)
- [ ] JSON conforms to `schemas/guide.schema.json` (structural validity)
- [ ] Each day has 3-4 major stops (INV-4)
- [ ] Each stop has time/period/place/duration/transport/budget/why (INV-5)
- [ ] Backup plans exist for rain and low energy (INV-6)
- [ ] Return-visit routes exclude visited_before items (INV-12)
- [ ] Route-planner-critic has signed off

## Agents

- **route-planner** — designs the daily itinerary
- **route-planner-critic** — reviews geography, pacing, and feasibility

## References

- `schemas/guide.schema.json` — authoritative JSON structure
- `config/trip_context.yaml` — visit type, exclusions, prioritization
- `config/traveler_profile.yaml` — pace, budget, walking tolerance
- `config/transport_preferences.yaml` — mode preferences, constraints
- `.harness/rules/content-invariants.md` — INV-3, INV-4, INV-5, INV-6, INV-11, INV-12, INV-13
- `.harness/references/source-policy.md` — volatile fact handling
- `templates/city-brief.md` — destination brief format
- `examples/shanghai-3days.json` — reference implementation for first-time layout
- `examples/shanghai-return-visit.json` — reference implementation for return-visit layout
