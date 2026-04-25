# Skill: plan-transport

## Description

Plan point-to-point transport between each day's itinerary stops. Must run AFTER the itinerary is finalized, not before.

## When to Use

- After the structured guide JSON has a complete `days` array with stops
- Before writing the guide copy or designing layouts
- When transport context for a city is available or has changed

## When NOT to Use

- Before itinerary stops are finalized (INV-14)
- When the user explicitly says transport is out of scope
- When the guide is for a walking-only route with no inter-stop moves

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| Structured guide | `content/structured/{slug}.json` | Must have completed `days[].segments` |
| Transport preferences | `config/transport_preferences.yaml` | Mode, constraints, cost sensitivity |
| City transport context | Destination brief or inline knowledge | Metro coverage, taxi availability, traffic patterns |
| Accessibility needs | User or profile | Luggage, children, elderly, mobility limits |

## Outputs

| Output | Path |
|--------|------|
| Updated structured guide | `content/structured/{slug}.json` (adds `transport_plan`) |

## Steps

1. **Read the structured guide JSON.**
   - Extract all `days[].segments[].place` and `days[].segments[].transport`.
   - Confirm stops are finalized before planning transport.

2. **For each consecutive pair of stops, build a transport leg.**

3. **For each leg, determine:**
   - `from` — starting place
   - `to` — destination
   - `recommended_mode` — single primary recommendation (walking / subway / bus / taxi / rental_car)
   - `alternatives` — 1-2 backup modes
   - `estimated_time` — range in minutes
   - `estimated_cost` — actual cost or "free" / "by meter" / "per zone"
   - `why` — why this mode is recommended for this leg
   - `pain_points` — known friction (congestion, stairs, transfers, wait times)
   - `booking_or_payment_notes` — if relevant (taxi app, transit card, reservation)

4. **Apply constraints from `config/transport_preferences.yaml`.**
   - Respect `max_single_walk_minutes` — suggest taxi beyond this threshold.
   - Respect `avoid_many_transfers` — prefer direct routes.
   - Respect `avoid_modes` — never suggest excluded modes.
   - Respect `late_night_safe_return` — flag late legs with safety notes.

5. **Write `transport_plan` fields:**
   - `preference` — the dominant mode (matches `config/transport_preferences.yaml`)
   - `summary` — one-sentence overview of the transport approach
   - `days[].legs[]` — array of leg objects from step 3

6. **Validate.**
   - Check `transport_plan.days` covers all days and all intra-day legs.
   - Check every leg has `from`, `to`, `recommended_mode`, `alternatives`, `estimated_time`, `estimated_cost`, `why`, `pain_points` (INV-15).
   - If rental car: check parking, congestion, restrictions, pickup/return (INV-16).

7. **Ask transport-planner-critic to review.**
   - Are recommended modes practical for the traveler profile?
   - Are pain points honest?
   - Are alternatives useful or noise?
   - Do estimates seem realistic for the city?

## Quality Gates

- [ ] Transport plan covers all stops across all days
- [ ] Every leg has all required fields (INV-15)
- [ ] Constraints from `config/transport_preferences.yaml` are respected
- [ ] Rental car legs address parking and restrictions if applicable (INV-16)
- [ ] Transport-planner-critic has signed off

## Agents

- **transport-planner** — designs per-leg recommendations
- **transport-planner-critic** — reviews practicality and honesty
- **verifier** — checks leg completeness

## References

- `config/transport_preferences.yaml` — mode preferences, constraints, cost sensitivity
- `.harness/rules/content-invariants.md` — INV-14, INV-15, INV-16
- `.harness/rules/workflow.md` — transport must follow itinerary
- `content/structured/{slug}.json` — the itinerary JSON to augment
