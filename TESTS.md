# Tests

## Automated Tests

The audit engine tests live in:

```text
tests/auditEngine.test.js
```

They cover the rule-based savings logic used by StackAudit.

## Coverage

1. ChatGPT Team downgrade for a 2-seat team
2. Claude Team downgrade for a 1-seat user
3. Cursor Business downgrade for a small team
4. API spend review for high API usage
5. Zero-savings case does not manufacture savings
6. High-savings audit is marked for Credex-style follow-up

## How To Run Locally

Install dependencies:

```bash
npm install
```

Run lint:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

## CI

GitHub Actions runs lint and tests on every push or pull request to `main`.
Workflow file:

```text
.github/workflows/ci.yml
```

## Notes

The browser app currently keeps its UI logic in `index.html`, while the testable audit logic is mirrored in `src/auditEngine.js`.
A future cleanup would import the same shared audit engine into the frontend so the app and tests use one source of truth.
