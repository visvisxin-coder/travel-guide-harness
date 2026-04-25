# AGENTS.md -- Travel Guide Harness

**Project:** Travel Guide Harness
**Primary Content Source:** `content/structured/*.json`
**Primary Render Output:** polished HTML
**Final Outputs:** HTML first, then PNG/JPG and PDF
**Default Language:** Chinese
**Default Style:** 实用、具体、审美清爽、适合直接出行使用

---

## Core Principles

- **Single source of truth** -- 结构化攻略 JSON 是权威内容源，精美 HTML、PDF、图片和 Markdown 都由它生成。
- **HTML first** -- 先生成高质量 HTML 页面，再从 HTML 渲染图片或 PDF。
- **Route first, prose second** -- 路线合理性优先于文案漂亮。
- **No hallucinated places** -- 不编造景点、餐厅、交通规则、门票价格和开放时间。
- **Verify after render** -- 每次输出 PDF/图片后都要检查文字溢出、页面缺失、路线密度和事实标注。
- **Worker-critic pairs** -- 重要产物由 creator 生成，再由 critic 审查。
- **Human final review** -- 高质量旅行攻略必须经过人工确认，尤其是开放时间、票价、临时闭馆和餐厅营业状态。

---

## Folder Structure

```text
travel-guide-harness/
├── AGENTS.md
├── MEMORY.md
├── CHANGELOG.md
├── schemas/
├── examples/
├── README.md
├── config/
├── .harness/
│   ├── agents/
│   ├── skills/
│   ├── rules/
│   └── references/
├── content/
│   ├── structured/
│   └── drafts/
├── assets/
├── layouts/
│   ├── html/
│   ├── pdf/
│   └── image/
├── scripts/
├── outputs/
├── quality_reports/
└── templates/
```

---

## Standard Workflow

```text
1. Build destination brief          → discover-destination
2. Build traveler profile            → (config/traveler_profile.yaml)
3. Research attractions, food, transport, risks  → discover-destination
4. Discover social trend references  → discover-social-trends  [optional]
5. Plan route strategy               → plan-itinerary
6. Plan point-to-point transportation → plan-transport
7. Add metro map reference           → add-metro-map  [optional]
8. Generate structured itinerary JSON → plan-itinerary
9. Write readable guide copy          → write-guide
10. Design polished HTML              → design-html
11. Design PDF layout                 → design-pdf
12. Render image / PDF from HTML      → render-images
13. Verify facts, visual layout, completeness → review-output
14. Export final PDF / PNG            → render-images + export scripts
```

---

## Agent Map

| Agent | Role | Skills |
|---|---|---|
| `orchestrator` | 管理流程、依赖、质量门槛和升级路径 | all |
| `researcher` | 收集城市资料、景点、美食、交通和注意事项 | `discover-destination` |
| `researcher-critic` | 审查资料覆盖、来源可靠性和事实风险 | `discover-destination` |
| `route-planner` | 设计每日路线、节奏、交通衔接和备选方案 | `plan-itinerary` |
| `route-planner-critic` | 审查路线是否顺路、过密、适合用户画像 | `plan-itinerary`, `discover-social-trends` |
| `social-trend-researcher` | 收集小红书式热搜景点、美食、展览和拍照点 | `discover-social-trends` |
| `social-trend-critic` | 审查热搜推荐是否有参考价值、是否过度营销 | `discover-social-trends` |
| `metro-map-researcher` | 查找或准备城市地铁线图模块 | `add-metro-map` |
| `metro-map-critic` | 审查地铁图来源、可读性和路线相关性 | `add-metro-map` |
| `transport-planner` | 在地点确定后设计点到点交通方案 | `plan-transport` |
| `transport-planner-critic` | 审查交通方式是否方便、现实、符合偏好 | `plan-transport` |
| `writer` | 把结构化内容写成清楚、好读、可执行的攻略 | `write-guide` |
| `writer-critic` | 审查文案是否准确、具体、无空话 | `write-guide` |
| `designer` | 优先设计精美 HTML，再适配 PDF/图片的信息层级、版式、配色和组件 | `design-html`, `design-pdf`, `render-images` |
| `designer-critic` | 审查视觉输出是否专业、可读、无溢出 | `design-html`, `design-pdf`, `render-images` |
| `verifier` | 最终检查内容完整性、事实标注和输出文件 | `review-output` |

---

## Quality Gates

| Gate | Minimum Score | Applies To |
|---|---:|---|
| Draft | 70 | 可继续迭代 |
| Preview | 80 | 可生成预览 |
| Client-ready | 90 | 可交付给用户 |
| Publication | 95 | 可作为公开发布版本 |
