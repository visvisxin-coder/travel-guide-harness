# Skill: write-guide

## Description

Transform structured guide JSON into readable, actionable Chinese travel prose saved as a Markdown draft under `content/drafts/`. The output is a human-readable guide that preserves all factual content from the JSON while adding natural language flow, practical advice, and judgment calls.

## When to Use

- After the structured guide JSON is complete and validated
- Before designing HTML/PDF/image layouts (the draft informs layout structure)
- When updating the guide text without changing the route

## When NOT to Use

- Before the structured JSON is validated
- When the user only needs the JSON (no narrative copy required)
- When the route logic is still changing

## Inputs

| Input | Source | Description |
|-------|--------|-------------|
| Structured guide | `content/structured/{slug}.json` | Must be complete and validated |
| Writing style | `.harness/references/travel-writing-style.md` | Tone, phrasing, and style guidelines |
| Content invariants | `.harness/rules/content-invariants.md` | Rules that copy must not violate |

## Outputs

| Output | Path |
|--------|------|
| Guide draft | `content/drafts/{slug}.md` |

## Steps

1. **Read the structured guide JSON.**
   - Understand the full route: days, stops, transport plan, backup plans, food notes.

2. **Write the guide in clear, practical Chinese.**
   - Follow `.harness/references/travel-writing-style.md`:
     - Use practical, calm, specific language.
     - Avoid "绝美", "宝藏", "必打卡", "氛围感拉满" and similar empty adjectives.
     - Prefer concrete advice over atmospheric description.
   - Structure:
     - Opening paragraph: what this route is and who it's for.
     - For each day: theme → stop-by-stop guide → practical notes.
     - Transport summary: what to expect.
     - Backup plans: when to use each.
     - Closing notes: booking, timing, last-checked date.

3. **Preserve all JSON content faithfully.**
   - Do not add places, times, or prices not in the JSON (INV-1).
   - Keep volatile fact disclaimers ("需出行前确认") intact.
   - Preserve budget estimates and duration ranges.

4. **Add judgment calls that the JSON cannot express.**
   - "这一天步行较多，体力一般可以删掉晚上的第二个点。"
   - "豫园周边商业化程度较高，如果不想逛小商品可跳过直接去外滩。"
   - "热门餐厅需提前预约，临时去可能等位 30-60 分钟。"

5. **Check return-visit language.**
   - If `visit_type` is `return_visit`, explain what is new or different (INV-13).
   - Reference skipped items: "这条路线特意避开了外滩和南京东路，如果你上次去过，这次可以试试这些新地方。"

6. **Review with writer-critic.**
   - Is the language practical and specific?
   - Are there empty adjectives or vague recommendations?
   - Are volatile facts properly flagged?
   - Is the tone appropriate for the traveler profile?

## Quality Gates

- [ ] All JSON facts are preserved (no hallucinated content, INV-1)
- [ ] Volatile facts are flagged with check dates or disclaimers (INV-2)
- [ ] No empty adjectives or marketing language
- [ ] Return-visit guides explain what's new (INV-13)
- [ ] Backup plans are described in actionable terms
- [ ] Writer-critic has signed off

## Agents

- **writer** — produces the draft
- **writer-critic** — reviews style, factual consistency, usefulness

## References

- `.harness/references/travel-writing-style.md` — tone, phrasing, examples
- `.harness/references/source-policy.md` — volatile fact policy
- `.harness/rules/content-invariants.md` — INV-1, INV-2, INV-13
- `content/structured/{slug}.json` — source of factual content
- `templates/city-brief.md` — reference for brief section structure
