#!/usr/bin/env node

const { loadGuide, relativeOutput, renderImagePreview } = require("./lib/render_guide");

const input = process.argv[2];

if (!input) {
  console.error("Usage: node scripts/render_image.js content/structured/{slug}.json");
  process.exit(1);
}

const guide = loadGuide(input);
const output = renderImagePreview(guide);

console.log(`Generated ${relativeOutput(output)}`);

