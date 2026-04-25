# Skill: render-images

## Description

Create mobile-friendly image output (poster, long-image format) from the structured guide. The image output is adapted from the HTML version, optimized for 1080px-wide mobile viewing.

## When to Use

- When the user wants a shareable mobile image (e.g., WeChat, Xiaohongshu poster)
- After the HTML version is finalized and designer-critic approved

## When NOT to Use

- Before the HTML version is solid (VINV-2)
- When the user only needs the HTML version
- When the image layout cannot adapt the content without significant loss

## Inputs

| Input | Source | Description |
|--------|--------|-------------|
| Structured guide | `content/structured/{slug}.json` | Completed guide data |
| Image template | `layouts/image/poster.html` | Mobile image shell |
| Image CSS | `layouts/image/mobile.css` | 1080px-optimized stylesheet |

## Outputs

| Output | Path |
|--------|------|
| Image preview HTML | `outputs/images/{slug}-poster.html` |
| Mobile CSS copy | `outputs/images/mobile.css` |
| PNG screenshot (optional) | `outputs/images/{slug}.png` (via export_image.js) |

## Steps

1. **Read the structured guide JSON.**
   - Identify which sections are essential at a glance for mobile.
   - The render engine (`render_guide.js` → `bodyHtml(guide, "poster")`) handles poster-mode layout.

2. **Choose the image layout format.**
   - Single long image (full guide as a scrollable card stack).
   - The mobile CSS at `layouts/image/mobile.css` controls the visual presentation.

3. **Optimize for 1080px width (VINV-4).**
   - Ensure text does not overflow its container at 1080px.
   - Adjust font sizes for mobile readability.
   - Use stacked layout (single column) where possible.

4. **Edit layout files.**
   - Edit `layouts/image/poster.html` for structural changes.
   - Edit `layouts/image/mobile.css` for mobile styling.

5. **Render preview.**
   - `node scripts/render_image.js content/structured/{slug}.json`
   - Open `outputs/images/{slug}-poster.html` in a browser.
   - Inspect at 1080px viewport width.

6. **Export real image (if Playwright is available).**
   - `node scripts/export_image.js content/structured/{slug}.json`
   - Inspect the generated PNG: check text readability, section visibility, overflow.

7. **Ask designer-critic to review.**
   - Is the image readable at mobile size?
   - Is there text overflow?
   - Does the vertical flow make sense?

## Quality Gates

- [ ] Image renders without overflow (VINV-1)
- [ ] Readable at 1080px width (VINV-4)
- [ ] Content hierarchy is clear (VINV-5)
- [ ] City and trip length visible in first viewport (VINV-9)
- [ ] Metro map readable if enabled (VINV-10)
- [ ] No decorative clutter (VINV-8)
- [ ] Designer-critic has signed off

## Agents

- **designer** — creates/improves image layout and mobile CSS
- **designer-critic** — reviews mobile readability, overflow
- **verifier** — checks output file existence

## References

- `layouts/image/poster.html` — mobile image template
- `layouts/image/mobile.css` — mobile stylesheet
- `scripts/lib/render_guide.js` → `renderImagePreview()` — image rendering entry
- `scripts/export_image.js` — Playwright PNG export
- `.harness/rules/visual-invariants.md` — VINV-1, VINV-4, VINV-5, VINV-8, VINV-9, VINV-10
- `.harness/references/visual-style-guide.md` — design principles
- `outputs/images/shanghai-3days-poster.html` — reference image output
