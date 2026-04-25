# Skill: design-pdf

## Description

Create or improve the A4 PDF layout for printing. The PDF version shares content with the HTML version but uses print-optimized layout and typography.

## When to Use

- After the HTML output passes designer-critic review
- When the user requests a downloadable or printable PDF
- After the structured guide JSON has structurally changed (to keep PDF in sync)

## When NOT to Use

- Before the HTML version is solid — optimize HTML first, then PDF (VINV-2)
- When the user only needs HTML output
- When the structured JSON is still changing

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| Structured guide | `content/structured/{slug}.json` | Completed guide data |
| PDF template | `layouts/pdf/a4.html` | A4 page shell |
| Print CSS | `layouts/pdf/print.css` | Print-optimized stylesheet |
| HTML design (reference) | `outputs/html/{slug}.html` | Visual hierarchy to port to print |

## Outputs

| Output | Path |
|--------|------|
| PDF preview HTML | `outputs/pdf/{slug}-preview.html` |
| Print CSS copy | `outputs/pdf/print.css` |

## Steps

1. **Read the structured guide JSON and HTML output.**
   - Understand the content and the visual hierarchy established in the HTML version.

2. **Review the PDF template and CSS.**
   - `layouts/pdf/a4.html`: page shell, includes print.css.
   - `layouts/pdf/print.css`: print-specific styles (page breaks, font sizes, margins).

3. **Design for A4 constraints.**
   - Page size A4 (210mm × 297mm).
   - Content should fit within 12mm margins (matching `export_pdf.js` margins).
   - Use print-specific CSS: `@page`, `page-break-before`, `page-break-inside: avoid`.
   - Reduce font sizes if HTML version uses large display typography.
   - Ensure metro map images fit within page width.

4. **Edit layout files.**
   - Edit `layouts/pdf/a4.html` for structural changes.
   - Edit `layouts/pdf/print.css` for print styling.
   - The render engine (`render_guide.js` → `bodyHtml(guide, "pdf")`) handles content layout — if PDF-specific layout changes are needed, update the render engine for `mode === "pdf"`.

5. **Render preview and inspect.**
   - `node scripts/render_pdf.js content/structured/{slug}.json`
   - Open `outputs/pdf/{slug}-preview.html` in a browser print preview or view directly.
   - Check: page breaks, text overflow, section ordering.

6. **Export real PDF and inspect (if Playwright is available).**
   - `node scripts/export_pdf.js content/structured/{slug}.json`
   - Open the generated PDF file.
   - Check: each page is readable, no overflow, no orphaned section headers, metro map fits page width (VINV-10).

7. **Ask designer-critic to review.**
   - Is the print layout readable?
   - Are page breaks in reasonable places?
   - Is there any text overflow?
   - Is the metro map readable at print size? (VINV-10)

## Quality Gates

- [ ] PDF preview renders without overflow (VINV-1)
- [ ] A4 readable when printed (VINV-3)
- [ ] Clear hierarchy: cover, overview, daily routes, transport, backup plans (VINV-5)
- [ ] Metro map is readable (VINV-10)
- [ ] Color contrast sufficient (VINV-7)
- [ ] No decorative clutter (VINV-8)
- [ ] Designer-critic has signed off

## Agents

- **designer** — creates/improves PDF layout and print CSS
- **designer-critic** — reviews print readability, page breaks, overflow
- **verifier** — checks output file existence and rendering

## References

- `layouts/pdf/a4.html` — A4 template
- `layouts/pdf/print.css` — print stylesheet
- `scripts/lib/render_guide.js` → `renderPdfPreview()` — PDF rendering entry
- `scripts/export_pdf.js` — Playwright PDF export (real PDF generation)
- `.harness/rules/visual-invariants.md` — VINV-1, VINV-3, VINV-5, VINV-7, VINV-8, VINV-10
- `.harness/references/visual-style-guide.md` — design principles
- `outputs/pdf/shanghai-3days-preview.html` — reference PDF preview
