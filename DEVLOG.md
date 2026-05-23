# Devlog

## Day 1 — 2026-05-20

**Hours worked:** 2  
**What I did:** Built the first single-file HTML prototype for an AI cost audit tool. Added tool selection, plan selection, seats, and simple savings output.  
**What I learned:** A static HTML app is enough to test the core workflow before choosing a larger framework.  
**Blockers / what I'm stuck on:** I was unsure whether Vercel would deploy a plain HTML file correctly.  
**Plan for tomorrow:** Deploy the prototype and fix any hosting issues.

## Day 2 — 2026-05-21

**Hours worked:** 2  
**What I did:** Created the GitHub repo, renamed the main file to `index.html`, and deployed the static site on Vercel.  
**What I learned:** Static hosts expect `index.html` as the default entry point.  
**Blockers / what I'm stuck on:** The first deployment showed a 404 because the file was named `ai_cost_optimizer.html`.  
**Plan for tomorrow:** Add real backend storage for leads.

## Day 3 — 2026-05-22

**Hours worked:** 3  
**What I did:** Created Supabase tables for leads and reports. Added Row Level Security policies and connected the frontend to Supabase using the publishable key.  
**What I learned:** Supabase publishable keys are safe in frontend code only when RLS policies are configured carefully.  
**Blockers / what I'm stuck on:** I initially used the wrong Supabase URL format with `/rest/v1`, which caused failed requests.  
**Plan for tomorrow:** Add shareable report URLs.

## Day 4 — 2026-05-23

**Hours worked:** 3  
**What I did:** Added report saving to Supabase and public share URLs using `?report=share_id`. Tested opening shared reports in incognito.  
**What I learned:** Public report data should be stored separately from lead data so personal fields are not exposed.  
**Blockers / what I'm stuck on:** I needed to make sure shared reports hide personal email/company fields.  
**Plan for tomorrow:** Improve the audit engine and make recommendations more defensible.

## Day 5 — 2026-05-24

**Hours worked:** 4  
**What I did:** Improved the audit engine with more conservative rules, monthly/annual savings, no-fake-savings behavior, and better recommendation wording.  
**What I learned:** It is better to show $0 savings honestly than to manufacture optimization claims.  
**Blockers / what I'm stuck on:** Some recommendations increased spend, so I changed the logic to treat those as fit reviews rather than savings.  
**Plan for tomorrow:** Add tests, CI, and required engineering docs.

## Day 6 — 2026-05-25

**Hours worked:** 4  
**What I did:** Added `src/auditEngine.js`, automated tests, `package.json`, `TESTS.md`, and GitHub Actions CI. Confirmed the workflow runs green on GitHub.  
**What I learned:** Separating the audit engine from the HTML makes it much easier to test important business logic.  
**Blockers / what I'm stuck on:** The browser app still has duplicate audit logic in `index.html`; a future cleanup should share one module.  
**Plan for tomorrow:** Finish required docs and business files.

## Day 7 — 2026-05-26

**Hours worked:** 4  
**What I did:** Added README, architecture notes, pricing sources, prompts, GTM, economics, reflection, and interview documentation. Final-tested the live deployed app.  
**What I learned:** The assignment evaluates the product, reasoning, documentation, and entrepreneurial thinking, not just the UI.  
**Blockers / what I'm stuck on:** Real transactional email and backend AI summary are still the main next implementation steps.  
**Plan for tomorrow:** If continuing, add Vercel functions for Resend email and Anthropic summary generation.
