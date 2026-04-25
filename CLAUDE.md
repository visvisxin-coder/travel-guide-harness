# Travel Guide Harness — 工作流规范

## 核心原则

每次创建攻略，**必须严格按以下 6 步流程执行**，每一步的 agent-critic 对都必须调用，不得跳过。

## 必须执行的 6 步流程

| 步骤 | Skill | Worker Agent | Critic Agent | 输出 |
|:----:|-------|-------------|-------------|------|
| 1 | discover-destination | researcher | **researcher-critic** | `content/drafts/{slug}-brief.md` |
| 2 | plan-itinerary | route-planner | **route-planner-critic** | `content/structured/{slug}.json` |
| 3 | plan-transport | transport-planner | **transport-planner-critic** | `content/structured/{slug}.json` (更新 transport_plan) |
| 4 | write-guide | writer | **writer-critic** | `content/drafts/{slug}.md` |
| 5 | design-html | designer | **designer-critic** | `outputs/html/{slug}.html` |
| 6 | review-output | verifier | — (pass/fail gate) | `quality_reports/reviews/{slug}-review-{YYYY-MM-DD}.md` |

## 强制规则

### 1. 每一步必须先调 critic agent 审核，再进入下一步
- researcher 产出后 → 调 **researcher-critic** 审核 → 修复问题 → 进入 Step 2
- route-planner 产出后 → 调 **route-planner-critic** 审核 → 修复问题 → 进入 Step 3
- transport-planner 产出后 → 调 **transport-planner-critic** 审核 → 修复问题 → 进入 Step 4
- writer 产出后 → 调 **writer-critic** 审核 → 修复问题 → 进入 Step 5
- designer 产出后 → 调 **designer-critic** 审核 → 修复问题 → 进入 Step 6
- **严禁跳过 critic 审核直接进入下一步**

### 2. verifier 必须在交付前调用
- `review-output` 步骤必须调用 **verifier agent** 做正式 pass/fail 检查
- verifier 确认 PASS 后才能交付给用户
- 质量报告必须保存到 `quality_reports/reviews/`

### 3. 单数据源
- `content/structured/{slug}.json` 是唯一权威数据源
- Markdown 草稿、HTML、PDF、图片都必须从 JSON 生成
- 不允许直接编辑 HTML/Markdown 添加 JSON 中没有的内容（INV-1）

### 4. 质量门禁
- Draft: ≥70 — 可继续迭代
- Preview: ≥80 — 可生成预览
- Client-ready: ≥90 — 可交付用户
- Publication: ≥95 — 公开发布
- **低于 70 必须重新调研，不能进入下一步**

### 5. 所有 agent 定义和 skill 说明在 `.harness/` 目录下
- Skills: `.harness/skills/*.md`
- Agents: `.harness/agents/*.md`
- 规则: `.harness/rules/*.md`
- 每次执行前先读取相关 skill 定义，严格按步骤执行

## 可选步骤（按需执行）

| Skill | 适用场景 |
|-------|---------|
| discover-social-trends | 用户要求了解当地热门/趋势信息 |
| add-metro-map | 城市有地铁且有合适的地铁图资源 |

## 快速参考

1. 先读 config/ 下的配置文件了解用户画像
2. 按 6 步流程执行，每一步都调 critic
3. 完成后调用 verifier 做最终检查
4. verifier PASS 后才算完成
