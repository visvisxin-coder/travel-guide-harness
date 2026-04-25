#!/usr/bin/env node

const {
  loadGuide,
  relativeOutput,
  renderHtml,
  renderImagePreview,
  renderPdfPreview
} = require("./lib/render_guide");

const input = process.argv[2];

if (!input) {
  console.error("Usage: node scripts/render_all.js content/structured/{slug}.json");
  process.exit(1);
}

const guide = loadGuide(input);

for (const output of [renderHtml(guide), renderPdfPreview(guide), renderImagePreview(guide)]) {
  console.log(`Generated ${relativeOutput(output)}`);
}

