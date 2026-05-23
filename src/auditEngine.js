const TOOL_PLANS = {
  chatgpt: {
    name: "ChatGPT",
    plans: {
      plus: { label: "Plus", cost: 20, perUser: true },
      team: { label: "Team", cost: 30, perUser: true },
      enterprise: { label: "Enterprise", cost: 60, perUser: true },
      api_direct: { label: "API direct", cost: 0, perUser: false, custom: true }
    }
  },
  claude: {
    name: "Claude",
    plans: {
      free: { label: "Free", cost: 0, perUser: false },
      pro: { label: "Pro", cost: 20, perUser: true },
      max: { label: "Max", cost: 100, perUser: true },
      team: { label: "Team", cost: 30, perUser: true },
      enterprise: { label: "Enterprise", cost: 60, perUser: true },
      api_direct: { label: "API direct", cost: 0, perUser: false, custom: true }
    }
  },
  cursor: {
    name: "Cursor",
    plans: {
      hobby: { label: "Hobby", cost: 0, perUser: true },
      pro: { label: "Pro", cost: 20, perUser: true },
      business: { label: "Business", cost: 40, perUser: true },
      enterprise: { label: "Enterprise", cost: 60, perUser: true }
    }
  },
  copilot: {
    name: "GitHub Copilot",
    plans: {
      individual: { label: "Individual", cost: 10, perUser: true },
      business: { label: "Business", cost: 19, perUser: true },
      enterprise: { label: "Enterprise", cost: 39, perUser: true }
    }
  },
  gemini: {
    name: "Gemini",
    plans: {
      pro: { label: "Pro", cost: 20, perUser: true },
      ultra: { label: "Ultra", cost: 250, perUser: true },
      api: { label: "API", cost: 0, perUser: false, custom: true }
    }
  },
  openai_api: {
    name: "OpenAI API direct",
    plans: {
      paygo: { label: "Pay-as-you-go", cost: 0, perUser: false, custom: true },
      credits: { label: "Credits / committed spend", cost: 0, perUser: false, custom: true }
    }
  },
  anthropic_api: {
    name: "Anthropic API direct",
    plans: {
      paygo: { label: "Pay-as-you-go", cost: 0, perUser: false, custom: true },
      credits: { label: "Credits / committed spend", cost: 0, perUser: false, custom: true }
    }
  },
  windsurf: {
    name: "Windsurf",
    plans: {
      free: { label: "Free", cost: 0, perUser: true },
      pro: { label: "Pro", cost: 15, perUser: true },
      teams: { label: "Teams", cost: 35, perUser: true },
      enterprise: { label: "Enterprise", cost: 60, perUser: true }
    }
  }
};

function getPlan(tool) {
  const catalog = TOOL_PLANS[tool.toolId];
  if (!catalog) throw new Error(`Unknown tool: ${tool.toolId}`);

  return catalog.plans[tool.planId] || Object.values(catalog.plans)[0];
}

function calculateCost(tool) {
  const plan = getPlan(tool);
  if (Number(tool.monthlySpend) > 0) return Number(tool.monthlySpend);
  if (plan.custom) return 0;
  return plan.perUser ? plan.cost * Number(tool.seats || 1) : plan.cost;
}

function getRecommendation(tool, context) {
  const catalog = TOOL_PLANS[tool.toolId];
  const plan = getPlan(tool);
  const seats = Number(tool.seats || 1);
  const currentSpend = calculateCost(tool);

  let recommendedPlan = plan;
  let recommendedSpend = currentSpend;
  let action = "Keep current plan";
  let reason = "Current plan looks reasonable for the selected team size and use case.";

  if (tool.toolId === "chatgpt" && tool.planId === "team" && seats <= 2) {
    recommendedPlan = catalog.plans.plus;
    recommendedSpend = recommendedPlan.cost * seats;

    if (recommendedSpend < currentSpend) {
      action = "Downgrade to ChatGPT Plus";
      reason = "For 1-2 users, ChatGPT Plus usually covers individual usage at a lower monthly cost than Team.";
    } else {
      recommendedSpend = currentSpend;
      action = "Review ChatGPT Team fit";
      reason = "ChatGPT Team may be unnecessary for a very small team, but switching plans does not show direct savings based on the spend entered.";
    }
  }

  if (tool.toolId === "claude" && tool.planId === "team" && seats === 1) {
    recommendedPlan = catalog.plans.pro;
    recommendedSpend = recommendedPlan.cost;

    if (recommendedSpend < currentSpend) {
      action = "Downgrade to Claude Pro";
      reason = "Claude Team is hard to justify for one user because Claude Pro provides individual access at a lower monthly cost.";
    } else {
      recommendedSpend = currentSpend;
      action = "Review Claude Team fit";
      reason = "Claude Team may be unnecessary for one user, but Claude Pro does not create direct savings based on the spend entered.";
    }
  }

  if (tool.toolId === "cursor" && ["business", "enterprise"].includes(tool.planId) && seats <= 3) {
    recommendedPlan = catalog.plans.pro;
    recommendedSpend = recommendedPlan.cost * seats;

    if (recommendedSpend < currentSpend) {
      action = "Downgrade to Cursor Pro";
      reason = "Small teams usually do not need Business or Enterprise controls unless centralized admin, security, or procurement features are required.";
    } else {
      recommendedSpend = currentSpend;
      action = "Review Cursor advanced plan fit";
      reason = "Cursor Business or Enterprise may be unnecessary for a small team, but Pro does not create direct savings based on the spend entered.";
    }
  }

  if (tool.toolId === "copilot" && tool.planId === "enterprise" && seats < 10) {
    recommendedPlan = catalog.plans.business;
    recommendedSpend = recommendedPlan.cost * seats;

    if (recommendedSpend < currentSpend) {
      action = "Downgrade to Copilot Business";
      reason = "For teams under 10 seats, Copilot Business is often enough unless enterprise policy controls are mandatory.";
    } else {
      recommendedSpend = currentSpend;
      action = "Review Copilot Enterprise fit";
      reason = "Copilot Enterprise may be unnecessary for a small team, but Business does not create direct savings based on the spend entered.";
    }
  }

  if (tool.toolId === "gemini" && tool.planId === "ultra" && context.useCase !== "research") {
    recommendedPlan = catalog.plans.pro;
    recommendedSpend = recommendedPlan.cost * seats;

    if (recommendedSpend < currentSpend) {
      action = "Downgrade to Gemini Pro";
      reason = "Gemini Ultra is easiest to justify for heavy research workflows; lighter usage can often start with Pro.";
    } else {
      recommendedSpend = currentSpend;
      action = "Review Gemini Ultra fit";
      reason = "Gemini Ultra may be unnecessary outside heavy research workflows, but switching to Pro does not create direct savings based on the spend entered.";
    }
  }

  if (["openai_api", "anthropic_api"].includes(tool.toolId) && currentSpend >= 300 && context.teamSize <= 10) {
    recommendedSpend = Math.round(currentSpend * 0.75);
    action = "Review API usage and credits";
    reason = "API spend above $300/month should be reviewed for unused traffic, caching opportunities, model routing, or committed-use credits.";
  }

  const recommendedCost = Math.min(currentSpend, Math.max(0, recommendedSpend));
  const savings = Math.max(0, currentSpend - recommendedCost);

  return {
    toolName: catalog.name,
    currentPlan: plan.label,
    currentCost: currentSpend,
    recommendedPlan: recommendedPlan.label,
    recommendedCost,
    recommendedAction: action,
    savings,
    reason
  };
}

function runAudit(input) {
  const context = {
    teamSize: Number(input.teamSize || 1),
    useCase: input.useCase || "coding"
  };

  const results = (input.tools || []).map(tool => getRecommendation(tool, context));

  const hasChatGPT = input.tools?.some(tool => tool.toolId === "chatgpt");
  const hasClaude = input.tools?.some(tool => tool.toolId === "claude");

  if (hasChatGPT && hasClaude && ["writing", "research", "mixed"].includes(context.useCase)) {
    const overlapTool = results
      .filter(row => ["ChatGPT", "Claude"].includes(row.toolName))
      .sort((a, b) => b.currentCost - a.currentCost)[0];

    if (overlapTool && overlapTool.currentCost > 0) {
      const consolidationSavings = Math.round(overlapTool.currentCost * 0.5);
      overlapTool.savings += consolidationSavings;
      overlapTool.recommendedCost = Math.max(0, overlapTool.currentCost - consolidationSavings);
      overlapTool.recommendedAction = "Consolidate overlapping AI chat tools";
      overlapTool.reason = "The stack includes both ChatGPT and Claude for a similar use case. Finance should review overlap before paying full retail for both.";
    }
  }

  const totalCurrent = results.reduce((sum, row) => sum + row.currentCost, 0);
  const totalRecommended = results.reduce((sum, row) => sum + row.recommendedCost, 0);
  const totalSavings = Math.max(0, totalCurrent - totalRecommended);

  return {
    results,
    totalCurrent,
    totalRecommended,
    totalSavings,
    annualSavings: totalSavings * 12,
    status: totalSavings > 500 ? "high_savings" : totalSavings === 0 ? "efficient" : "optimization_found"
  };
}

module.exports = {
  TOOL_PLANS,
  calculateCost,
  getRecommendation,
  runAudit
};
