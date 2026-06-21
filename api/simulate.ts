import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }
  return new Groq({ apiKey });
};

const MODEL = 'llama-3.3-70b-versatile';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scenarioName, description, variables, financials } = req.body;
    if (!scenarioName || !variables) {
      return res.status(400).json({ error: 'Scenario parameters are required' });
    }

    const groq = getGroqClient();

    const company = financials?.companyName || "StellarTech Solutions Inc.";
    const revValue = financials?.revenue !== undefined ? financials.revenue : 1250000;
    const expValue = financials?.expenses !== undefined ? financials.expenses : 950000;
    const profValue = financials?.profit !== undefined ? financials.profit : 300000;
    const cashValue = financials?.cashOnHand !== undefined ? financials.cashOnHand : 3400000;
    const healthIndex = financials?.healthScore !== undefined ? financials.healthScore : 85;
    const growthIndex = financials?.growthScore !== undefined ? financials.growthScore : 74;
    const cacValue = financials?.cac !== undefined ? financials.cac : 1200;
    const ltvValue = financials?.ltv !== undefined ? financials.ltv : 6500;
    const hcValue = financials?.headcount !== undefined ? financials.headcount : 42;

    const systemMessage = `You are a financial simulation engine. You must respond with valid JSON only, no markdown or explanation outside the JSON object.`;

    const userPrompt = `Perform a premium financial digital twin simulation for ${company} based on this scenario:
- Scenario Group: "${scenarioName}"
- Description: "${description}"

Deterministic baseline factors applied to virtual model:
* Baseline Monthly Revenue: $${revValue.toLocaleString()}
* Baseline Monthly Expenses: $${expValue.toLocaleString()}
* Baseline Monthly Net Profit: $${profValue.toLocaleString()}
* Baseline Corporate Cash: $${cashValue.toLocaleString()}
* Baseline Financial Health Index: ${healthIndex}/100
* Baseline Growth Index: ${growthIndex}/100
* Baseline Headcount: ${hcValue} employees
* Customer Acquisition Cost (CAC): $${cacValue.toLocaleString()}
* Lifetime Value (LTV): $${ltvValue.toLocaleString()}

Delta simulation modifiers to apply:
* Revenue Multiplier: ${variables.revenueFactor}x
* Expenses Multiplier: ${variables.expensesFactor}x
* Headcount modifier: ${variables.headcountChange >= 0 ? '+' : ''}${variables.headcountChange}
* Ad Marketing change: $${variables.marketingChange}
* Instant Cash Outlay: $${variables.cashImpact}

Using your simulation modeling capabilities:
1. Revise the monthly revenue, expenses, net profit, cash, health score, and growth score based on both these exact input parameters and logical cascade effects (e.g., higher marketing can trigger revenue uplift or CAC dilation, expanding operations raises compliance costs, hiring staff incurs ramp-up overheads, contract cancellations adjust cash, etc.). Keep the outputs within realistic proportions (e.g., projectedRevenue = Baseline Monthly Revenue * Revenue Multiplier, but factoring in minor organic boosts).
2. Detail the exact narrative explanation, risk alerts, and key strategic factors influencing the projection.
3. Suggest two alternative mini-scenarios to manage or leverage this forecast.

You must return a JSON object with exactly these fields:
- confidenceScore (integer 0-100)
- projectedRevenue (integer)
- projectedExpenses (integer)
- projectedProfit (integer)
- projectedCash (integer)
- projectedHealthScore (integer 1-100)
- projectedGrowthScore (integer 1-100)
- keyFactors (array of strings, top 3-4 drivers)
- alternativeScenarios (array of objects with "name" and "outcome" string fields)
- explanation (string, detailed financial critique)`;

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error('Simulation engine returned empty forecast data');
    }

    const parsedResult = JSON.parse(resultText.trim());
    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error in simulation engine:', error);
    res.status(500).json({ error: error.message || 'Simulation pipeline failed' });
  }
}