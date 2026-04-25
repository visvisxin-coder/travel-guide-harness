#!/usr/bin/env node

/**
 * create_guide.js — Interactive CLI for generating a travel guide JSON skeleton.
 *
 * This script creates a placeholder skeleton. The AI (Claude) fills in real
 * content — attractions, restaurants, transport — using web search and
 * domain knowledge.
 *
 * Usage: node scripts/create_guide.js
 *        npm run create
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = path.resolve(__dirname, "..");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, (a) => r(a.trim())));

const TODAY = new Date().toISOString().slice(0, 10);

const CITY_SLUGS = {
  "上海": "shanghai", "北京": "beijing", "杭州": "hangzhou",
  "成都": "chengdu", "广州": "guangzhou", "深圳": "shenzhen",
  "重庆": "chongqing", "西安": "xian", "南京": "nanjing",
  "苏州": "suzhou", "武汉": "wuhan", "长沙": "changsha",
  "厦门": "xiamen", "青岛": "qingdao", "大连": "dalian",
  "昆明": "kunming", "丽江": "lijiang", "三亚": "sanya",
  "香港": "hongkong", "台北": "taipei", "京都": "kyoto",
  "东京": "tokyo", "大阪": "osaka", "首尔": "seoul",
  "曼谷": "bangkok", "普吉": "phuket", "巴厘岛": "bali",
  "巴黎": "paris", "伦敦": "london", "纽约": "newyork",
  "洛杉矶": "losangeles", "旧金山": "sanfrancisco", "悉尼": "sydney",
  "新加坡": "singapore",
};

const isInt = (s, min = 1) => {
  const n = parseInt(s, 10);
  return Number.isInteger(n) && n >= min ? n : null;
};

const isIn = (s, choices) =>
  choices.includes(s.toLowerCase()) ? s.toLowerCase() : null;

const nonEmpty = (s) => (s.length > 0 ? s : null);

function guessProfileName(pace, budget, visitType) {
  if (visitType === "return_visit") return "return_city_walker";
  if (visitType === "local_refresh") return "local_explorer";
  if (pace === "intensive") return "ambitious_sightseer";
  if (pace === "light") return "casual_stroller";
  return "first_time_city_walk";
}

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("  📋  旅行攻略创建向导");
  console.log("  ⚡  生成骨架后请交给 AI 填充内容");
  console.log("=".repeat(50) + "\n");

  let city = "";
  while (!nonEmpty(city)) {
    city = await ask("城市名称（如 上海）: ");
  }

  const defaultSlug = CITY_SLUGS[city] || city.toLowerCase().replace(/\s+/g, "");
  let slug = await ask(`英文标识（用于文件名）[${defaultSlug}]: `);
  if (!slug) slug = defaultSlug;

  let days = null;
  while (!days) {
    const raw = await ask("行程天数: ");
    days = isInt(raw);
    if (!days) console.log("  请输入有效数字（至少 1 天）");
  }

  const defaultTitle = `${city} ${days}日攻略`;
  const title = await ask(`攻略标题 [${defaultTitle}]: `) || defaultTitle;
  const subtitle = await ask("副标题/一句话介绍（可选）: ");

  let pace = "";
  while (!pace) {
    const raw = await ask("节奏（light / moderate / relaxed / intensive）[moderate]: ") || "moderate";
    pace = isIn(raw, ["light", "moderate", "relaxed", "intensive"]);
    if (!pace) console.log("  可选: light, moderate, relaxed, intensive");
  }

  let budget = "";
  while (!budget) {
    const raw = await ask("预算（budget / moderate / premium）[moderate]: ") || "moderate";
    budget = isIn(raw, ["budget", "moderate", "premium"]);
    if (!budget) console.log("  可选: budget, moderate, premium");
  }

  let visitType = "";
  while (!visitType) {
    const raw = await ask("出行类型（first_time / return_visit / local_refresh）[first_time]: ") || "first_time";
    visitType = isIn(raw, ["first_time", "return_visit", "local_refresh"]);
    if (!visitType) console.log("  可选: first_time, return_visit, local_refresh");
  }

  let visitedBefore = [];
  let excludeItems = [];
  let prioritize = {};

  if (visitType === "return_visit") {
    const v = await ask("已去过的地方（逗号分隔，如 外滩, 南京东路，没有直接回车）: ");
    visitedBefore = v ? v.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    const e = await ask("要排除的地方（逗号分隔，回车跳过）: ");
    excludeItems = e ? e.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    const p = await ask("优先区域或主题（逗号分隔，如 徐汇, 展览，回车跳过）: ");
    if (p) {
      prioritize = { neighborhoods: [], themes: p.split(/[,，]/).map((s) => s.trim()).filter(Boolean) };
    }
  }

  const tagsRaw = await ask("适合人群标签（逗号分隔，如 第一次来, 喜欢城市漫步）: ");
  const bestFor = tagsRaw ? tagsRaw.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
  const routeLogic = await ask("路线逻辑（一句话概括路线怎么设计）: ");
  const foodRaw = await ask("美食类别（逗号分隔，如 湘菜, 小吃，回车跳过）: ");
  const foodCategories = foodRaw ? foodRaw.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
  const transportMain = await ask("主要交通方式 [地铁 + 步行 + 短途打车]: ") || "地铁 + 步行 + 短途打车";

  const fullSlug = `${slug}-${days}days`;

  const guide = {
    slug: fullSlug,
    city,
    title,
    subtitle: subtitle || `${city} ${days}日行程规划`,
    language: "zh-CN",
    last_checked: TODAY,
    traveler_profile: guessProfileName(pace, budget, visitType),

    trip_context: {
      visit_type: visitType,
      visited_before: {
        attractions: visitedBefore, neighborhoods: [], restaurants: [], food_categories: [],
      },
      exclude: {
        attractions: excludeItems, neighborhoods: [], restaurants: [], food_categories: [], experiences: [],
      },
      prioritize: Object.keys(prioritize).length > 0 ? prioritize : undefined,
    },

    overview: {
      best_for: bestFor.length > 0 ? bestFor : [`${city}旅行`],
      pace,
      budget_level: budget,
      route_logic: routeLogic || `${city} ${days}日行程，按区域和主题规划每日路线。`,
    },

    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `第 ${i + 1} 天`,
      theme: "待规划",
      segments: [
        { time: "09:30", period: "上午", place: "待填写", duration: "2h", transport: "待填写", budget: "待填写", why: "待填写" },
        { time: "13:30", period: "下午", place: "待填写", duration: "2h", transport: "待填写", budget: "待填写", why: "待填写" },
        { time: "18:30", period: "晚上", place: "待填写", duration: "2h", transport: "待填写", budget: "待填写", why: "待填写" },
      ],
    })),

    food: foodCategories.map((cat) => ({
      category: cat,
      note: "待补充：推荐餐厅和点餐建议",
      budget: "待补充：人均预算范围",
    })),

    transport: {
      main: transportMain,
      tips: ["待补充：交通提示 1", "待补充：交通提示 2"],
    },

    backup_plans: [
      { scenario: "雨天", plan: "待补充：雨天替代方案" },
      { scenario: "体力不足", plan: "待补充：可删减或替换的行程段" },
    ],
  };

  if (!guide.trip_context.prioritize) delete guide.trip_context.prioritize;

  const outputDir = path.join(root, "content", "structured");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${fullSlug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(guide, null, 2) + "\n");

  console.log("\n" + "=".repeat(50));
  console.log(`  ✅ 骨架已生成: content/structured/${fullSlug}.json`);
  console.log("=".repeat(50));
  console.log("\n📌 接下来交给 AI：");
  console.log(`  把此文件交给 AI，告诉它你的具体需求，AI 会：`);
  console.log(`    1. 联网搜索真实景点、餐厅、交通信息`);
  console.log(`    2. 填入内容到 JSON`);
  console.log(`    3. 运行 npm run render:all 生成精美网页\n`);

  rl.close();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
