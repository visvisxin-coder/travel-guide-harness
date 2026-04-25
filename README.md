# Travel Guide Harness

一个城市旅游攻略生成的项目。把城市资料、用户偏好、路线规划、视觉设计和质量审查组织成一条可复用的生产线，生成精美 HTML 页面。

## What It Does

输入城市、天数、旅行偏好，项目会生成：

- 结构化攻略数据：`content/structured/*.json`
- 可编辑文案草稿：`content/drafts/*.md`
- 精美 HTML 页面：`outputs/html/`

Transport is a first-class planning stage. After places are selected, the harness can plan point-to-point movement by subway, taxi, bus, walking, rental car, or mixed modes.

The project also distinguishes between first-time and return visits. Return-visit guides can filter already visited attractions, restaurants, neighborhoods, food categories, or experiences through `trip_context`.

Social trend references can be added as a separate module. Xiaohongshu-style trending places should be shown as inspiration or candidates, but they must be reviewed for route fit, crowd risk, and hype risk before entering the main itinerary.

## Architecture

```text
travel-guide-harness/
├── AGENTS.md
├── MEMORY.md
├── CHANGELOG.md
├── config/
├── .harness/
│   ├── agents/
│   ├── skills/
│   ├── rules/
│   └── references/
├── schemas/
├── examples/
├── content/
├── assets/
├── layouts/
├── scripts/
├── outputs/
├── quality_reports/
└── templates/
```

## Core Idea

- `AGENTS.md` 是项目宪法，告诉 AI 这个项目如何工作。
- `.harness/agents/` 定义角色：researcher、route-planner、writer、designer、verifier。
- `.harness/skills/` 定义可复用能力：研究城市、规划路线、写攻略、设计 HTML、审查输出。
- `.harness/rules/` 定义硬规则：事实、路线、版式、质量门槛。
- `schemas/` 定义结构化攻略的数据契约。
- `examples/` 保存示例攻略，方便测试和复用。
- `content/structured/` 是内容的 single source of truth。
- `layouts/html/` 是设计层，产出可浏览的精美 HTML。
- `scripts/` 负责把结构化内容渲染成 HTML。

## Quick Start

```bash
npm run preview
```

这会生成 HTML 版本到 `outputs/html/`。

You can also render one target at a time:

```bash
npm run render:html
npm run render:image
npm run render:pdf
```

Validate structured content against the schema:

```bash
npm run validate
```

Run the full lightweight project checks (validate + render + verify files exist):

```bash
npm test
```

Try with the return-visit example:

```bash
npm run render:all examples/shanghai-return-visit.json
```

## 工作流

1. 把攻略需求告诉 AI（城市、天数、偏好等）
2. AI 按 Harness 工作流逐步执行：调研 → 路线规划 → 交通规划 → 文案 → 渲染 HTML
3. 在浏览器中打开 `outputs/html/{slug}.html` 查看结果
4. 可按需在浏览器中「打印→另存为 PDF」

## Recommended Workflow

1. `/discover-destination 上海 3天`
2. Configure `config/trip_context.yaml` or the `trip_context` object in structured JSON
3. `/plan-itinerary content/structured/shanghai-3days.json`
4. `/discover-social-trends content/structured/shanghai-3days.json`
5. `/plan-transport content/structured/shanghai-3days.json`
6. `/write-guide content/structured/shanghai-3days.json`
7. `/design-html content/structured/shanghai-3days.json`
8. `/review-output outputs/`
