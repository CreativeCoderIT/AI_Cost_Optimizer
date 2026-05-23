# Pricing Data

Verified date: 2026-05-23

This file lists the pricing assumptions used by StackAudit. The audit engine uses conservative plan-level prices and user-entered spend. User-entered spend is treated as the source of truth for current monthly cost.

## ChatGPT

Source: https://openai.com/chatgpt/pricing

- Plus: $20/user/month — verified 2026-05-23
- Team: $30/user/month on monthly billing — verified 2026-05-23
- Enterprise: custom pricing; StackAudit placeholder estimate: $60/user/month — verified 2026-05-23
- API direct: usage-based — source: https://openai.com/api/pricing/ — verified 2026-05-23

Note: Enterprise pricing is not publicly fixed. StackAudit uses a conservative placeholder estimate for audit comparison only.

## Claude

Sources:
- https://support.anthropic.com/en/articles/11049762-choose-a-claude-plan
- https://docs.anthropic.com/en/docs/about-claude/pricing

- Free: $0/month — verified 2026-05-23
- Pro: $20/user/month — verified 2026-05-23
- Max: placeholder estimate $100/user/month — verified 2026-05-23
- Team: $30/user/month placeholder for audit comparison — verified 2026-05-23
- Enterprise: custom pricing; StackAudit placeholder estimate: $60/user/month — verified 2026-05-23
- API direct: usage-based — verified 2026-05-23

Note: Claude Team/Enterprise terms can vary by billing model and availability. StackAudit uses user-entered spend as the current-cost source of truth.

## Cursor

Source: https://docs.cursor.com/account/plans

- Hobby: $0/user/month — verified 2026-05-23
- Pro: $20/user/month or current listed equivalent depending on billing period — verified 2026-05-23
- Business/Teams: $40/user/month placeholder from public pricing references — verified 2026-05-23
- Enterprise: custom pricing; StackAudit placeholder estimate: $60/user/month — verified 2026-05-23

Note: Cursor pricing has changed over time. StackAudit keeps current spend editable so the user’s actual bill overrides assumptions.

## GitHub Copilot

Sources:
- https://docs.github.com/en/copilot/get-started/plans
- https://github.com/features/copilot

- Individual: $10/user/month — verified 2026-05-23
- Business: $19/user/month — verified 2026-05-23
- Enterprise: $39/user/month — verified 2026-05-23

## Gemini

Source: https://gemini.google/us/subscriptions/

- Free: $0/month — verified 2026-05-23
- Google AI Pro: $19.99/month; StackAudit rounds to $20/user/month — verified 2026-05-23
- Google AI Ultra: starts at $99.99/month and has higher tiers; StackAudit placeholder estimate: $250/user/month — verified 2026-05-23
- API: usage-based through Google AI/Vertex AI pricing — verified 2026-05-23

Note: Google changed AI subscription tiers in 2026. StackAudit uses user-entered spend for current cost and conservative placeholders for plan comparison.

## OpenAI API Direct

Source: https://openai.com/api/pricing/

- Pay-as-you-go: usage-based — verified 2026-05-23
- Credits / committed spend: usage and agreement dependent — verified 2026-05-23

StackAudit does not estimate token pricing per model in the UI. It flags API spend above a threshold for usage review, caching, model routing, and credit opportunities.

## Anthropic API Direct

Source: https://docs.anthropic.com/en/docs/about-claude/pricing

- Pay-as-you-go: usage-based — verified 2026-05-23
- Credits / committed spend: usage and agreement dependent — verified 2026-05-23

StackAudit does not estimate token pricing per model in the UI. It flags API spend above a threshold for usage review, caching, model routing, and credit opportunities.

## Windsurf

Sources:
- https://windsurf.com/pricing/teams
- https://docs.windsurf.com/windsurf/accounts/usage

- Free: $0/user/month — verified 2026-05-23
- Pro: $15/user/month placeholder — verified 2026-05-23
- Teams: $35/user/month placeholder — verified 2026-05-23
- Enterprise: custom pricing; StackAudit placeholder estimate: $60/user/month — verified 2026-05-23

Note: Windsurf pricing and credits can vary. StackAudit lets users enter actual monthly spend to avoid relying only on static plan assumptions.

## Audit Engine Pricing Philosophy

The audit engine does not blindly assume the calculated plan price is the user’s actual bill. The user-entered monthly spend is treated as the current spend. Plan prices are used for recommendation comparisons.

If a suggested plan would cost more than the user-entered current spend, StackAudit does not count it as savings. It may still show a “review fit” recommendation for governance or plan suitability.
PROMPTS.md
# Prompts

## Current Status

The current MVP uses a deterministic fallback summary generated in JavaScript. This ensures the audit still works if an AI API is unavailable.

The intended production version will call an LLM from a backend/serverless function, not directly from browser JavaScript. API keys must not be stored in `index.html`.

## Audit Summary Prompt
You are writing a concise AI spend audit summary for a business user.

Use only the audit data provided. Do not invent prices, savings, tools, vendors, or recommendations.

Write approximately 100 words.

Include:
- current monthly spend
- estimated monthly savings
- estimated annual savings
- the top 1-2 recommendations
- whether the stack looks efficient or needs review
- if monthly savings are greater than $500, mention that a Credex consultation may help capture more savings

Tone:
- clear
- financially grounded
- honest
- no hype
- no exaggerated claims

If savings are $0, say that no direct monthly savings were found based on the spend entered, but some tools may still deserve a fit review.
Example Input
{
  "teamSize": 6,
  "useCase": "coding",
  "totalCurrent": 1340,
  "totalRecommended": 860,
  "totalSavings": 480,
  "annualSavings": 5760,
  "recommendations": [
    {
      "toolName": "Cursor",
      "currentPlan": "Business",
      "recommendedAction": "Downgrade to Cursor Pro",
      "savings": 120,
      "reason": "Small teams usually do not need Business controls unless centralized admin or procurement features are required."
    }
  ]
}
Example Output
Your 6-person coding team is spending $1,340/month on AI tools. The audit found $480/month, or 
