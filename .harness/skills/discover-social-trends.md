# Skill: discover-social-trends

## Description

Research social media trending items (e.g., Xiaohongshu) for a destination and add them as a reference module in the structured guide. This module is for inspiration only — trend popularity does not override route quality or traveler fit.

## When to Use

- After the itinerary is drafted but before finalizing the JSON
- When the user wants "what's trending" alongside the core route
- When the city has active social media food/attraction/exhibition scenes

## When NOT to Use

- When the user explicitly wants no social media influence
- When the destination has weak or irrelevant social media coverage
- When the itinerary is already packed and there is no space for optional items
- When trends would displace route logic (INV-19)

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| City | `content/structured/{slug}.json` → `city` | Target city |
| Traveler profile | `config/traveler_profile.yaml` | Interests, avoid list |
| Trip context | `config/trip_context.yaml` | Exclusions, visited_before, visit_type |
| Season/dates | User or inline | Current or planned travel dates |
| Social trend config | `config/social_trends.yaml` | Platform, categories, ranking policy |

## Outputs

| Output | Path |
|--------|------|
| Updated guide JSON | `content/structured/{slug}.json` (adds `social_trends`) |

## Steps

1. **Read the itinerary and context.**
   - Understand which neighborhoods, themes, and food categories are already covered.
   - Read `config/social_trends.yaml` for platform, categories, and policy.
   - Apply `trip_context.exclude` and `trip_context.visited_before` filters.

2. **Research trending items by category.**
   - Categories from `config/social_trends.yaml`: attractions, food, neighborhoods, exhibitions, photo_spots, seasonal.
   - Note each item's type and why it is trending.

3. **For each item, evaluate:**
   - Does it fit the current route or a nearby area?
   - Does it fit the traveler profile and interests?
   - Does it conflict with `exclude` or `visited_before` lists?

4. **Add caveats for each item (INV-18):**
   - Crowds, booking difficulty, distance from route, commercial hype, photo-only value, weather dependence.
   - Every caveat must be specific, not generic.

5. **Assign a `recommended_action` (INV-18):**
   - `include` — fits route and traveler well, worth adding to the main itinerary
   - `optional` — good if the traveler has time/interest, but not essential
   - `skip` — does not fit this trip, included only as reference
   - `verify` — popularity or details need confirmation before deciding

6. **Write `social_trends` fields:**
   - `purpose`: always "reference"
   - `source_policy`: from `config/social_trends.yaml` or default disclaimer
   - `items[]`: each with `name`, `type`, `trend_reason`, `fit_for`, `caveats`, `recommended_action`, `source_note`, `last_checked`

7. **Ask social-trend-critic to review.**
   - Are the recommended actions reasonable?
   - Are caveats specific and useful?
   - Are any items dangerously over-hyped or likely outdated?
   - Is social trend content clearly separate from core itinerary? (INV-17)

## Quality Gates

- [ ] Trend items are clearly separated from core itinerary (INV-17)
- [ ] Every item has a `recommended_action` (INV-18)
- [ ] Every item has at least one specific caveat
- [ ] No trend item overrides route logic (INV-19)
- [ ] Excluded and visited-before items are filtered out
- [ ] Social-trend-critic has signed off

## Agents

- **social-trend-researcher** — collects and categorizes trending items
- **social-trend-critic** — reviews actionability, caveats, signal quality
- **route-planner** — consulted for route fit
- **verifier** — checks filtering and separation rules

## References

- `config/social_trends.yaml` — platform, categories, ranking policy, actions
- `config/trip_context.yaml` — exclusions, visited_before, prioritization
- `config/traveler_profile.yaml` — interests, avoid list
- `.harness/rules/content-invariants.md` — INV-17, INV-18, INV-19
- `.harness/references/source-policy.md` — social content as weak signal
