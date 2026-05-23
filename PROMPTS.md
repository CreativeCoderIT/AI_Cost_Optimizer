# Prompts

## Current Status

StackAudit currently uses a deterministic fallback summary in JavaScript. The audit math is rule-based because financial recommendations should be predictable and testable.

A production version would call an LLM from a serverless backend function, not directly from browser JavaScript. No Anthropic, OpenAI, or Resend secret key should ever be placed in `index.html`.

## Audit Summary Prompt

text
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
