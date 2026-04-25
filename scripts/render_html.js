#!/usr/bin/env node

const { loadGuide, relativeOutput, renderHtml } = require("./lib/render_guide");

const input = process.argv[2] || "content/structured/shanghai-3days.json";
const guide = loadGuide(input);
const output = renderHtml(guide);

console.log(`Generated ${relativeOutput(output)}`);

