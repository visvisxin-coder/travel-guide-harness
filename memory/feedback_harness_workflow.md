---
name: harness_workflow_compliance
description: User demands strict Harness workflow execution for all travel guide generation — all 6 skills with agent-critic pairs must be invoked, and progress must be tracked with TodoWrite
type: feedback
---

The user explicitly requires strict compliance with the Harness workflow when generating travel guides. Every guide must go through all 6 pipeline steps with agent-critic pairs at each stage.

**Why:** Previous attempts bypassed the agent-critic system entirely, producing guides without proper review. The user said: "为什么每次都不按照Harness 工作流执行？我需要用户使用这个项目都严格按照Harness 工作流生成html攻略". Also, during one execution the TodoWrite tool was not used to track progress, making it invisible to the user.

**How to apply:**
- Start by reading CLAUDE.md at the project root (/Users/lixin/Desktop/travel-guide-harness/CLAUDE.md)
- Execute all 6 mandatory skills in sequence: discover-destination → plan-itinerary → plan-transport → write-guide → design-html → review-output
- Each step MUST invoke the corresponding critic agent before proceeding to the next step
- The verifier agent MUST be called before delivery (pass/fail gate)
- Never skip critic reviews, never skip the verifier
- **ALWAYS use TodoWrite at the start of a multi-step execution** to create a visible task list, and update it as each step completes
- The workflow audit (`npm run audit`) must also pass before delivery
