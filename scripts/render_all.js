#!/usr/bin/env node

const {
  loadGuide,
  relativeOutput,
  renderHtml,
  renderImagePreview,
  renderPdfPreview
} = require("./lib/render_guide");

const input = process.argv[2] || "content/structured/shanghai-3days.json";
const guide = loadGuide(input);

for (const output of [renderHtml(guide), renderPdfPreview(guide), renderImagePreview(guide)]) {
  console.log(`Generated ${relativeOutput(output)}`);
}

