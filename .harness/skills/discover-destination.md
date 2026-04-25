# Skill: discover-destination

## Description

Research a city's travel-relevant information and produce a structured city brief that feeds into route planning. The output is a destination brief file that captures the city's layout, must-see attractions, food scene, transport infrastructure, seasonal considerations, and practical notes.

## When to Use

- Starting a new city guide from scratch
- Adding a new destination to an existing project
- Updating outdated city information for an existing guide

## When NOT to Use

- When the destination is already well-researched and only minor updates are needed (use an inline update instead)
- When the traveler wants spontaneous exploration without research
- When the user has already provided sufficient destination knowledge and wants to skip to route planning

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| City name | User | Target city |
| Trip length | User or `config/trip_context.yaml` | Number of days |
| Visit type | `config/trip_context.yaml` | `first_time`, `return_visit`, or `local_refresh` |
| Traveler profile | `config/traveler_profile.yaml` | Matching profile name |
| Exclusions | `config/trip_context.yaml` → `exclude` | Items to exclude |
| Previously visited | `config/trip_context.yaml` → `visited_before` | Items already seen |

## Outputs

| Output | Path |
|--------|------|
| Destination brief | `content/drafts/{city}-brief.md` |
| Structured guide skeleton | `content/structured/{slug}.json` (optional, partial) |

## Steps

1. **Confirm user intent and constraints.**
   - Trip length, budget, pace, interests.
   - First-time or return visit.

2. **Read all relevant config files.**
   - `config/traveler_profile.yaml` — match pace, budget, interests.
   - `config/trip_context.yaml` — read `visit_type`, `exclude`, `visited_before`.
   - `config/transport_preferences.yaml` — read preferred modes and constraints.

3. **Research the city.**
   - City layout: which areas/neighborhoods matter for tourists.
   - Top attractions by category: landmarks, museums, parks, viewpoints.
   - Food scene: local specialties, popular areas, street food, market culture.
   - Transport: airport/train location, metro coverage, taxi/ride-hail availability.
   - Season/weather: temperature range, rain season, peak vs off-peak.
   - Risks: common scams, safety notes, booking requirements.

4. **Categorize findings.**
   - For `first_time`: prioritize classic landmarks, iconic food, central neighborhoods.
   - For `return_visit`: filter out `visited_before`, seek new neighborhoods, seasonal events, exhibitions.
   - For `local_refresh`: focus on weekend trips, new openings, seasonal content, niche experiences.

5. **Mark volatile facts.**
   - Add a check date next to opening hours, ticket prices, reservation rules, and transport schedules.
   - Use the format: `(需出行前确认, checked YYYY-MM-DD)`.

6. **Save the destination brief.**
   - Write to `content/drafts/{city}-brief.md`.
   - Headings: Layout, Top Attractions, Food, Transport, Season/Weather, Risks, Notes.

7. **Ask researcher-critic to review.**
   - Check for hallucinated places (INV-1).
   - Check volatile facts are marked with dates (INV-2).
   - Check coverage completeness (missing neighborhoods, food categories, transport modes).

## Quality Gates

- [ ] No invented places or facts (INV-1)
- [ ] Volatile facts have check dates or "需出行前确认" (INV-2)
- [ ] Visit type is correctly identified
- [ ] Return-visit exclusions are noted
- [ ] Researcher-critic has signed off

## Agents

- **researcher** — performs the research
- **researcher-critic** — reviews coverage, facts, sources

## References

- `config/traveler_profile.yaml` — pace, budget, interests template
- `config/trip_context.yaml` — visit type, exclusions, prioritization
- `config/transport_preferences.yaml` — transport mode defaults
- `.harness/rules/content-invariants.md` — INV-1, INV-2
- `.harness/references/source-policy.md` — volatile fact guidelines
- `templates/city-brief.md` — brief format template
