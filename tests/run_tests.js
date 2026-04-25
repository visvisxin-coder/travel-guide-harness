#!/usr/bin/env node

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function run(command, args) {
  execFileSync(command, args, {
    cwd: root,
    stdio: "inherit"
  });
}

function assertExists(filePath) {
  const absolutePath = path.resolve(root, filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Expected file to exist: ${filePath}`);
  }
}

run("node", ["scripts/validate_content.js", "content/structured/shanghai-3days.json"]);
run("node", ["scripts/validate_content.js", "examples/shanghai-return-visit.json"]);
run("node", ["scripts/render_all.js", "content/structured/shanghai-3days.json"]);

assertExists("outputs/html/shanghai-3days.html");
assertExists("outputs/images/shanghai-3days-poster.html");
assertExists("outputs/pdf/shanghai-3days-preview.html");

console.log("Tests passed");

