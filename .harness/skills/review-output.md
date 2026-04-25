# Skill: review-output

## Description

Run a final quality check before delivery. Validates structured content, renders all output formats, inspects each file for completeness, and writes a quality report.

## When to Use

- Before delivering any output to the user
- After all design work (HTML, PDF, image) is complete
- When checking whether the output meets a specific quality gate (`draft` / `preview` / `client-ready` / `publication`)

## When NOT to Use

- When content is still in progress (use component-specific critic reviews instead)
- When there are known unaddressed issues

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| Structured guide | `content/structured/{slug}.json` | Completed guide |
| All output files | `outputs/html/`, `outputs/pdf/`, `outputs/images/` | Rendered outputs |
| Content invariants | `.harness/rules/content-invariants.md` | INV-1 through INV-21 |
| Visual invariants | `.harness/rules/visual-invariants.md` | VINV-1 through VINV-10 |
| Quality config | `.harness/rules/quality.md` | Gate scores and components |
| Schema | `schemas/guide.schema.json` | JSON structural contract |

## Outputs

| Output | Path |
|--------|------|
| Quality report | `quality_reports/reviews/{slug}-review-{YYYY-MM-DD}.md` |

## Steps

1. **Validate structured content.**
   - `node scripts/validate_content.js content/structured/{slug}.json` — field-level checks.
   - Validate against `schemas/guide.schema.json` — structural contract.
   - Manually check content invariants (INV-1 through INV-21):
     - No invented facts (INV-1)
     - Volatile facts marked (INV-2)
     - Each day has morning/afternoon/evening (INV-3)
     - Max 4 stops per day (INV-4)
     - Every stop has all required fields (INV-5)
     - Backup plans present (INV-6)
     - Return-visit exclusions respected (INV-12)

2. **Render all output formats.**
   - `node scripts/render_all.js content/structured/{slug}.json`
   - Verify all three files exist:
     - `outputs/html/{slug}.html`
     - `outputs/pdf/{slug}-preview.html`
     - `outputs/images/{slug}-poster.html`

3. **Inspect visual outputs.**
   - Open `outputs/html/{slug}.html` in a browser.
   - Check: text overflow, section hierarchy, image loading, mobile responsiveness.
   - Check visual invariants (VINV-1 through VINV-10):
     - No text overflow (VINV-1)
     - PDF readable on A4 (VINV-3)
     - Image readable at 1080px (VINV-4)
     - City/trip length visible (VINV-9)
     - Metro map readable (VINV-10)

4. **Check file completeness and naming.**
   - `{slug}.html` + `site.css` in `outputs/html/`
   - `{slug}-preview.html` + `print.css` in `outputs/pdf/`
   - `{slug}-poster.html` + `mobile.css` in `outputs/images/`
   - Any exported `.pdf` or `.png` files

5. **Score against quality gates.**
   - Use `.harness/rules/quality.md` scoring components:
     - Destination research, social trend usefulness, route feasibility, transport convenience, guide usefulness, visual design, verification readiness
   - Assign a gate: Draft (70) / Preview (80) / Client-ready (90) / Publication (95)

6. **Write quality report.**
   - Save to `quality_reports/reviews/{slug}-review-{YYYY-MM-DD}.md`
   - Structure from `templates/quality-report.md`
   - Include: score summary, pass/fail per invariant, issues found, recommendations, next gate target

## Quality Gates

- [ ] All invariants pass (INV-1 through INV-21, VINV-1 through VINV-10)
- [ ] Content validates against schema and validate_content.js
- [ ] All output files exist and render correctly
- [ ] Score meets target gate (draft ≥70, preview ≥80, client-ready ≥90, publication ≥95)
- [ ] Quality report is saved

## Agents

- **verifier** — runs all checks, writes quality report
- **researcher-critic** — consulted for fact-checking
- **designer-critic** — consulted for visual issues
- **writer-critic** — consulted for copy issues

## References

- `scripts/validate_content.js` — content validation entry point
- `scripts/render_all.js` — renders all three HTML previews
- `schemas/guide.schema.json` — JSON structural contract
- `.harness/rules/content-invariants.md` — all INV rules
- `.harness/rules/visual-invariants.md` — all VINV rules
- `.harness/rules/quality.md` — scoring components and gates
- `.harness/rules/workflow.md` — standard pipeline and single-source-of-truth
- `templates/quality-report.md` — report format template
