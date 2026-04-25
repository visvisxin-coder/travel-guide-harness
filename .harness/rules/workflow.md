# Workflow Rules

## Standard Pipeline

```text
destination idea
  -> destination research
  -> traveler profile
  -> route planning
  -> structured guide JSON
  -> guide copy
  -> polished HTML design
  -> PDF/image export
  -> render
  -> verify
  -> final delivery
```

## Single Source of Truth

Structured JSON under `content/structured/` is authoritative.

Markdown drafts, polished HTML, PDF previews, and image previews must derive from structured content unless the user explicitly asks for a one-off manual design.

Sample guides belong in `examples/`. Active working guides belong in `content/structured/`.

Schema contracts belong in `schemas/`. When the structure changes, update `schemas/guide.schema.json`, `scripts/validate_content.js`, and at least one example together.

## HTML-First Rendering

The preferred visual pipeline is:

```text
structured JSON -> polished HTML -> image/PDF export
```

Do not optimize directly for PDF or PNG until the HTML experience is strong.

## Plans

Save non-trivial plans under:

```text
quality_reports/plans/YYYY-MM-DD_description.md
```

## Session Logs

Save long-running work summaries under:

```text
quality_reports/session_logs/YYYY-MM-DD_description.md
```
