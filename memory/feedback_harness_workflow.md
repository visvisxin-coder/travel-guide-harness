---
name: harness_workflow_compliance
description: User demands strict Harness workflow execution for all travel guide generation — all 6 skills with agent-critic pairs must be invoked
type: feedback
---

The user explicitly requires strict compliance with the Harness workflow when generating travel guides. Every guide must go through all 6 pipeline steps with agent-critic pairs at each stage.

**Why:** Previous attempts bypassed the agent-critic system entirely, producing guides without proper review. The user said: "为什么每次都不按照Harness 工作流执行？我需要用户使用这个项目都严格按照Harness 工作流生成html攻略".

**How to apply:**
- Start by reading CLAUDE.md at the project root (/Users/lixin/Desktop/travel-guide-harness/CLAUDE.md)
- Execute all 6 mandatory skills in sequence: discover-destination → plan-itinerary → plan-transport → write-guide → design-html → review-output
- Each step MUST invoke the corresponding critic agent before proceeding to the next step
- The verifier agent MUST be called before delivery (pass/fail gate)
- Never skip critic reviews, never skip the verifier
