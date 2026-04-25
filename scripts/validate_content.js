#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const input = process.argv[2];

if (!input) {
  console.error("Usage: node scripts/validate_content.js content/structured/shanghai-3days.json");
  process.exit(1);
}

const guide = JSON.parse(fs.readFileSync(path.resolve(root, input), "utf8"));
const schema = JSON.parse(fs.readFileSync(path.resolve(root, "schemas/guide.schema.json"), "utf8"));
const errors = [];

function requireField(obj, field, label) {
  if (!obj[field]) errors.push(`${label} 缺少 ${field}`);
}

["slug", "city", "title", "subtitle", "last_checked", "days"].forEach((field) => {
  requireField(guide, field, "guide");
});

function validateSchemaContract() {
  for (const field of schema.required || []) {
    requireField(guide, field, "schema");
  }
}

validateSchemaContract();

if (guide.cover) {
  ["image", "alt", "caption", "credit"].forEach((field) => {
    requireField(guide.cover, field, "cover");
  });
  if (guide.cover.image && !fs.existsSync(path.resolve(root, guide.cover.image))) {
    errors.push(`cover.image 文件不存在: ${guide.cover.image}`);
  }
}

if (!Array.isArray(guide.days) || guide.days.length === 0) {
  errors.push("days 必须是非空数组");
} else {
  guide.days.forEach((day) => {
    requireField(day, "title", `Day ${day.day || "?"}`);
    if (!Array.isArray(day.segments) || day.segments.length < 3) {
      errors.push(`Day ${day.day || "?"} 至少需要上午、下午、晚上 3 个行程段`);
    }
    if (day.segments && day.segments.length > 4) {
      errors.push(`Day ${day.day || "?"} 行程段过多，建议不超过 4 个主要地点`);
    }
    for (const segment of day.segments || []) {
      ["time", "period", "place", "duration", "transport", "budget", "why"].forEach((field) => {
        requireField(segment, field, `Day ${day.day} segment`);
      });
    }
  });
}

if (!guide.backup_plans || guide.backup_plans.length === 0) {
  errors.push("必须包含 backup_plans");
}

if (!guide.transport || !guide.transport.main) {
  errors.push("必须包含 transport.main");
}

if (guide.metro_map && guide.metro_map.enabled) {
  ["image", "alt", "caption", "disclaimer", "last_checked"].forEach((field) => {
    requireField(guide.metro_map, field, "metro_map");
  });
  if (guide.metro_map.image && !fs.existsSync(path.resolve(root, guide.metro_map.image))) {
    errors.push(`metro_map.image 文件不存在: ${guide.metro_map.image}`);
  }
}

if (guide.transport_plan) {
  if (!guide.transport_plan.summary) {
    errors.push("transport_plan 必须包含 summary");
  }
  if (!Array.isArray(guide.transport_plan.days)) {
    errors.push("transport_plan.days 必须是数组");
  } else {
    for (const day of guide.days || []) {
      const transportDay = guide.transport_plan.days.find((item) => item.day === day.day);
      if (!transportDay) {
        errors.push(`Day ${day.day} 缺少 transport_plan`);
        continue;
      }
      const expectedLegs = Math.max(0, (day.segments || []).length - 1);
      if (!Array.isArray(transportDay.legs) || transportDay.legs.length < expectedLegs) {
        errors.push(`Day ${day.day} transport_plan 至少需要 ${expectedLegs} 个点到点交通段`);
      }
      for (const leg of transportDay.legs || []) {
        ["from", "to", "recommended_mode", "alternatives", "estimated_time", "estimated_cost", "why", "pain_points"].forEach((field) => {
          requireField(leg, field, `Day ${day.day} transport leg`);
        });
      }
    }
  }
}

if (guide.social_trends) {
  if (!Array.isArray(guide.social_trends.items)) {
    errors.push("social_trends.items 必须是数组");
  } else {
    const allowedActions = new Set(["include", "optional", "skip", "verify"]);
    for (const item of guide.social_trends.items) {
      ["name", "type", "trend_reason", "fit_for", "caveats", "recommended_action", "source_note", "last_checked"].forEach((field) => {
        requireField(item, field, "social_trends item");
      });
      if (item.recommended_action && !allowedActions.has(item.recommended_action)) {
        errors.push(`social_trends item ${item.name || "?"} 的 recommended_action 必须是 include、optional、skip 或 verify`);
      }
    }
  }
}

if (!guide.trip_context || !guide.trip_context.visit_type) {
  errors.push("必须包含 trip_context.visit_type");
}

const allowedVisitTypes = new Set(["first_time", "return_visit", "local_refresh"]);
if (guide.trip_context && !allowedVisitTypes.has(guide.trip_context.visit_type)) {
  errors.push("trip_context.visit_type 必须是 first_time、return_visit 或 local_refresh");
}

function normalizeList(value) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

function includesBlocked(text, blockedItems) {
  const normalized = String(text || "");
  return blockedItems.filter((item) => normalized.includes(item));
}

const tripContext = guide.trip_context || {};
const exclude = tripContext.exclude || {};
const visitedBefore = tripContext.visited_before || {};
const blockedAttractions = [
  ...normalizeList(exclude.attractions),
  ...normalizeList(visitedBefore.attractions)
];
const blockedNeighborhoods = [
  ...normalizeList(exclude.neighborhoods),
  ...normalizeList(visitedBefore.neighborhoods)
];
const blockedRestaurants = [
  ...normalizeList(exclude.restaurants),
  ...normalizeList(visitedBefore.restaurants)
];
const blockedFoodCategories = [
  ...normalizeList(exclude.food_categories),
  ...normalizeList(visitedBefore.food_categories)
];

if (guide.days) {
  for (const day of guide.days) {
    for (const segment of day.segments || []) {
      const blocked = [
        ...includesBlocked(segment.place, blockedAttractions),
        ...includesBlocked(segment.place, blockedNeighborhoods),
        ...includesBlocked(segment.place, blockedRestaurants)
      ];
      if (blocked.length) {
        errors.push(`Day ${day.day} 包含已访问或排除项: ${blocked.join(", ")}`);
      }
    }
  }
}

if (guide.food) {
  for (const food of guide.food) {
    const blocked = includesBlocked(food.category, blockedFoodCategories);
    if (blocked.length) {
      errors.push(`food 包含已访问或排除的美食类别: ${blocked.join(", ")}`);
    }
  }
}

// ─── 工作流审计检查 ──────────────────────────────────────────────

const MANDATORY_AGENTS = [
  "orchestrator", "researcher", "researcher-critic",
  "route-planner", "route-planner-critic",
  "transport-planner", "transport-planner-critic",
  "writer", "writer-critic",
  "designer", "designer-critic",
  "verifier"
];

const MANDATORY_SKILLS = [
  "discover-destination", "plan-itinerary", "plan-transport",
  "write-guide", "design-html", "review-output"
];

if (guide.workflow_audit) {
  if (!Array.isArray(guide.workflow_audit.agents_invoked)) {
    errors.push("workflow_audit.agents_invoked 必须是数组");
  } else {
    for (const agent of MANDATORY_AGENTS) {
      if (!guide.workflow_audit.agents_invoked.includes(agent)) {
        errors.push(`工作流缺失: agent "${agent}" 未被调用`);
      }
    }
    const extraAgents = guide.workflow_audit.agents_invoked.filter(
      (a) => !MANDATORY_AGENTS.includes(a)
    );
    if (extraAgents.length) {
      console.warn(`⚠️  workflow_audit 包含非标准 agent: ${extraAgents.join(", ")}`);
    }
  }

  if (!Array.isArray(guide.workflow_audit.skills_executed)) {
    errors.push("workflow_audit.skills_executed 必须是数组");
  } else {
    for (const skill of MANDATORY_SKILLS) {
      if (!guide.workflow_audit.skills_executed.includes(skill)) {
        errors.push(`工作流缺失: skill "${skill}" 未执行`);
      }
    }
  }
} else {
  console.warn("⚠️  警告: JSON 中缺少 workflow_audit 字段，无法验证工作流完整性");
}

// ─── 错误汇总 ────────────────────────────────────────────────────

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Validation passed");
