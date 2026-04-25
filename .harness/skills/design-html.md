# Skill: design-html

## Description

Create or improve the primary polished HTML travel guide output. The HTML version is the primary visual artifact — PDF and image outputs are exported from this representation or adapted from it.

## When to Use

- After the structured guide JSON is complete and validated
- Before exporting PDF or image (HTML-first pipeline)
- When improving the visual design of the guide

## When NOT to Use

- Before the structured JSON and guide copy are ready
- When the user only needs the JSON or Markdown draft
- When rushing to PDF before the HTML experience is solid (VINV-2)

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| Structured guide | `content/structured/{slug}.json` | Completed guide data |
| HTML template | `layouts/html/guide.html` | Page shell with `{{title}}` and `{{content}}` placeholders |
| CSS source | `layouts/html/site.css` | Editorial theme stylesheet |
| Visual style guide | `.harness/references/visual-style-guide.md` | Design principles and components |
| Visual style config | `config/visual_style.yaml` | Color, font, spacing overrides |
| Cover asset | `assets/images/covers/{city}-cover.svg` | (Optional) hero image |
| Metro map asset | `assets/maps/metro/{city}-metro-schematic.svg` | (Optional) if metro_map is enabled |
| Render engine | `scripts/lib/render_guide.js` | Generates HTML from JSON |

## Outputs

| Output | Path |
|--------|------|
| HTML preview | `outputs/html/{slug}.html` |
| CSS copy | `outputs/html/site.css` |

## Steps

1. **Read structured guide JSON and visual style config.**
   - Understand all sections: cover, overview, days, transport plan, social trends, metro map, backup plans.

2. **Inspect the current HTML layout.**
   - Read `layouts/html/guide.html` (template shell).
   - Read `layouts/html/site.css` (editorial theme).
   - Read `scripts/lib/render_guide.js` → `bodyHtml()` (content generation per layout mode).

3. **Design or refine the visual hierarchy.**
   - Cover zone: city name, title, subtitle, `best_for` pills, overview grid, optional cover image.
   - Daily routes: card-based day layout with segment blocks.
   - Transport plan: two-column leg cards (HTML mode) or stacked (PDF/image mode).
   - Social trends: section-grid note cards, clearly distinct from main route (INV-17).
   - Metro map: figure block with image, pills, and stations.
   - Backup plans: note cards at the end.

4. **Edit layout files.**
   - Use `render_guide.js` to control content layout per mode.
   - Edit `layouts/html/guide.html` only for structural template changes.
   - Edit `layouts/html/site.css` for styling changes.
   - Follow `.harness/references/visual-style-guide.md`: clean editorial, restrained color, strong spacing, no decorative clutter.

5. **Render and iterate.**
   - `node scripts/render_html.js content/structured/{slug}.json`
   - Open `outputs/html/{slug}.html` in a browser.
   - Check: title visibility, section hierarchy, text overflow, pill wrapping, image loading, mobile responsiveness.

6. **Ask designer-critic to review.**
   - Is the information hierarchy clear at a glance?
   - Are there text overflow or readability issues?
   - Is color contrast sufficient (VINV-7)?
   - Is the visual style consistent with `visual-style-guide.md`?
   - Is the design free of decorative clutter (VINV-8)?

## Quality Gates

- [ ] HTML renders without visual overflow (VINV-1)
- [ ] All sections render: cover, overview, days, transport, backup plans (VINV-5)
- [ ] City and trip length visible in first viewport (VINV-9)
- [ ] Metro map renders correctly if enabled (VINV-10)
- [ ] Color contrast is readable (VINV-7)
- [ ] No decorative clutter (VINV-8)
- [ ] Mobile-responsive layout works
- [ ] Designer-critic has signed off

## Agents

- **designer** — creates/improves HTML layout and CSS
- **designer-critic** — reviews hierarchy, readability, visual consistency
- **verifier** — checks output file existence and rendering

## References

- `layouts/html/guide.html` — template shell
- `layouts/html/site.css` — stylesheet
- `scripts/lib/render_guide.js` — content generation engine
- `.harness/references/visual-style-guide.md` — design principles
- `config/visual_style.yaml` — visual configuration
- `.harness/rules/visual-invariants.md` — VINV-1 through VINV-10
- `.harness/rules/content-invariants.md` — INV-17 (separate social trends)
- `outputs/html/shanghai-3days.html` — reference output to inspect
