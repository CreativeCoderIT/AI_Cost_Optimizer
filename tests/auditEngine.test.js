const test = require("node:test");
const assert = require("node:assert/strict");

const { runAudit } = require("../src/auditEngine.js");

test("downgrades ChatGPT Team to Plus for 2 seats when it saves money", () => {
  const audit = runAudit({
    teamSize: 2,
    useCase: "coding",
    tools: [
      {
        toolId: "chatgpt",
        planId: "team",
        monthlySpend: 60,
        seats: 2
      }
    ]
  });

  assert.equal(audit.totalCurrent, 60);
  assert.equal(audit.totalRecommended, 40);
  assert.equal(audit.totalSavings, 20);
  assert.match(audit.results[0].recommendedAction, /ChatGPT Plus/);
});

test("downgrades Claude Team to Pro for 1 seat when it saves money", () => {
  const audit = runAudit({
    teamSize: 1,
    useCase: "writing",
    tools: [
      {
        toolId: "claude",
        planId: "team",
        monthlySpend: 30,
        seats: 1
      }
    ]
  });

  assert.equal(audit.totalCurrent, 30);
  assert.equal(audit.totalRecommended, 20);
  assert.equal(audit.totalSavings, 10);
  assert.match(audit.results[0].recommendedAction, /Claude Pro/);
});

test("recommends Cursor Pro for small Cursor Business team when it saves money", () => {
  const audit = runAudit({
    teamSize: 2,
    useCase: "coding",
    tools: [
      {
        toolId: "cursor",
        planId: "business",
        monthlySpend: 80,
        seats: 2
      }
    ]
  });

  assert.equal(audit.totalCurrent, 80);
  assert.equal(audit.totalRecommended, 40);
  assert.equal(audit.totalSavings, 40);
  assert.match(audit.results[0].recommendedAction, /Cursor Pro/);
});

test("flags API spend above threshold and estimates 25 percent savings", () => {
  const audit = runAudit({
    teamSize: 6,
    useCase: "mixed",
    tools: [
      {
        toolId: "openai_api",
        planId: "paygo",
        monthlySpend: 400,
        seats: 6
      }
    ]
  });

  assert.equal(audit.totalCurrent, 400);
  assert.equal(audit.totalRecommended, 300);
  assert.equal(audit.totalSavings, 100);
  assert.match(audit.results[0].recommendedAction, /API usage/);
});

test("does not manufacture savings when current spend is already efficient", () => {
  const audit = runAudit({
    teamSize: 1,
    useCase: "coding",
    tools: [
      {
        toolId: "claude",
        planId: "pro",
        monthlySpend: 20,
        seats: 1
      }
    ]
  });

  assert.equal(audit.totalCurrent, 20);
  assert.equal(audit.totalRecommended, 20);
  assert.equal(audit.totalSavings, 0);
  assert.equal(audit.status, "efficient");
});

test("high savings audits are marked high_savings", () => {
  const audit = runAudit({
    teamSize: 6,
    useCase: "mixed",
    tools: [
      {
        toolId: "openai_api",
        planId: "paygo",
        monthlySpend: 2400,
        seats: 6
      }
    ]
  });

  assert.equal(audit.totalSavings, 600);
  assert.equal(audit.annualSavings, 7200);
  assert.equal(audit.status, "high_savings");
});
