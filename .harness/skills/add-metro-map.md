# Skill: add-metro-map

## Description

Add a city metro/subway map asset and include it as a reference module in the structured guide. The map shows route-relevant lines and stations — not the full official network.

## When to Use

- The city has a useful metro/subway system that travelers will use
- The structured guide JSON already has a `days` array with stops
- The user wants route context visible in the guide

## When NOT to Use

- When the city has no useful metro system
- When the guide's stops are all in a walkable downtown area
- When including a map purely as decoration (INV-21)
- When the official map is sufficient as an external reference

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| City | `content/structured/{slug}.json` → `city` | Target city |
| Route stops | `content/structured/{slug}.json` → `days[].segments[].place` | All places visited |
| Transport plan | `content/structured/{slug}.json` → `transport_plan` | Metro usage context |
| Existing map assets | `assets/maps/metro/` | Already saved SVGs |

## Outputs

| Output | Path |
|--------|------|
| Map SVG asset | `assets/maps/metro/{city}-metro-schematic.svg` |
| Map metadata | `assets/maps/metro/{city}-metro-schematic.meta.json` |
| Updated guide JSON | `content/structured/{slug}.json` (adds `metro_map`) |

## Steps

1. **Confirm the city has a useful metro system for tourists.**
   - Check route-relevant lines against the itinerary stops.

2. **Find or create a schematic map SVG.**
   - Prefer simplifying an existing official map rather than drawing from scratch.
   - Focus on lines and stations relevant to the itinerary (INV-21).
   - Do not copy official maps without modification; create a simplified schematic.
   - Save to `assets/maps/metro/{city}-metro-schematic.svg`.

3. **Create metadata sidecar file.**
   - `assets/maps/metro/{city}-metro-schematic.meta.json`
   - Fields: `source`, `source_url`, `last_checked`, `disclaimer`, `license_note`, `lines_included`, `stations_included`.
   - Include a disclaimer: "示意图仅用于理解路线，实际乘车请以官方地铁图和导航为准。"

4. **Add `metro_map` to the structured guide JSON:**
   - `enabled`: true
   - `image`: path from project root to SVG
   - `alt`: description of the map
   - `caption`: short caption
   - `disclaimer`: same text from metadata
   - `related_lines`: array of line numbers relevant to the route
   - `related_stations`: array of station names used in the itinerary
   - `last_checked`: date

5. **Render HTML preview and inspect.**
   - `node scripts/render_html.js content/structured/{slug}.json`
   - Check that the map image displays at the correct size.
   - Check that `related_lines` pills and `related_stations` text are accurate and useful.

6. **Ask metro-map-critic to review.**
   - Is the map accurate enough for route context?
   - Are the right lines and stations highlighted?
   - Is the disclaimer present?
   - Is the map useful or decorative? (INV-21)

## Quality Gates

- [ ] Map asset has metadata sidecar (source, date, disclaimer)
- [ ] Map lists only route-relevant lines and stations (INV-21)
- [ ] Disclaimer is present: non-official map
- [ ] Map renders correctly in HTML preview
- [ ] Metro-map-critic has signed off

## Agents

- **metro-map-researcher** — finds or creates the map asset
- **metro-map-critic** — reviews accuracy, relevance, disclaimer
- **designer** — inspects rendering
- **verifier** — checks metadata completeness

## References

- `.harness/rules/content-invariants.md` — INV-20, INV-21
- `assets/maps/metro/shanghai-metro-schematic.svg` — reference schematic
- `assets/maps/metro/shanghai-metro-schematic.meta.json` — reference metadata
- `content/structured/{slug}.json` — guide to add metro_map to
