# Architecture

## System Diagram

flowchart TD
  A["Visitor opens StackAudit"] --> B["Static HTML/CSS/JS on Vercel"]
  B --> C["User enters tools, plans, seats, spend, team size, use case"]
  C --> D["Rule-based audit engine in browser"]
  D --> E["Audit result page"]
  E --> F["Save public report to Supabase reports table"]
  E --> G["Optional lead capture form"]
  G --> H["Save lead to Supabase leads table"]
  F --> I["Shareable URL: /?report=share_id"]
  I --> J["Public visitor loads report"]
  J --> K["Fetch report_data from Supabase"]
Data Flow
A visitor lands on the static Vercel page.
The user enters team size, primary use case, AI tools, plan, current monthly spend, and seats.
The browser stores form state in LocalStorage so reloads do not wipe progress.
When the user runs the audit, the JavaScript audit engine evaluates each tool.
The audit engine returns current spend, recommended spend, monthly savings, annual savings, and per-tool recommendations.
The result is shown before email capture.
A public version of the audit is saved to the Supabase reports table.
The public report link uses ?report=share_id.
Optional lead capture stores email, company, role, savings, and share ID in the Supabase leads table.
Shared reports load only public report data and do not expose email/company/name/role.
Supabase Tables
reports
Stores public audit data only.

share_id      text primary key
report_data   jsonb
created_at    timestamptz
The report data includes tools, use case, team size, audit result, and summary. It does not include personal lead fields.

leads
Stores captured user/contact information after the audit value is shown.

id
name
email
company
role
company_size
monthly_spend
monthly_savings
annual_savings
share_id
tools
audit_result
created_at
Security
Supabase Row Level Security is enabled.
Public users can insert leads.
Public users can insert/read reports.
Public report data excludes personal contact details.
Supabase publishable key is used in the frontend.
Secret keys such as Resend, Anthropic, OpenAI, or Supabase service role keys are not stored in the repo.
Abuse Protection
The MVP uses a honeypot field on the lead capture form. It is invisible to normal users but may be filled by bots. If populated, the submission is ignored.

I chose honeypot protection because the assignment requires no login before using the tool, and a honeypot adds basic protection without adding friction to the audit flow.

Why This Stack
I used vanilla HTML/CSS/JavaScript because the first prototype was already working as a single static file. This kept deployment simple and allowed me to focus on the product flow: audit input, recommendations, lead capture, and shareable reports.

Supabase was chosen because it provides a real backend quickly without building a custom server. Vercel was chosen because it supports static deployment directly from GitHub.

What I Would Change For 10k Audits/Day
If StackAudit needed to handle 10k audits/day, I would:

Move audit logic into a tested shared module.
Add a serverless API layer for report creation and lead capture.
Add rate limiting by IP and/or hCaptcha.
Move secrets and third-party calls into Vercel functions.
Add database indexes on share_id and created_at.
Add monitoring for Supabase insert failures.
Add background email sending with retry behavior.
Migrate to Next.js for dynamic Open Graph previews and cleaner routing.
