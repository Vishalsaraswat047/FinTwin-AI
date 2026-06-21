import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';

// Load environment variables (local overrides .env for permanent key setup)
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const app = express();
const PORT = 5000;

app.use(express.json());

// Lazy-initialized Groq client
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required. Set it in .env.local');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

const MODEL = 'llama-3.3-70b-versatile';

// 1. Financial Copilot endpoint
app.post('/api/copilot', async (req, res) => {
  try {
    const { message, history = [], financials } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const groq = getGroqClient();

    const company = financials?.companyName || "StellarTech Solutions Inc.";
    const industryValue = financials?.industry || "B2B SaaS & IoT Devices";
    const revValue = financials?.revenue !== undefined ? financials.revenue : 1250000;
    const expValue = financials?.expenses !== undefined ? financials.expenses : 950000;
    const profValue = financials?.profit !== undefined ? financials.profit : 300000;
    const cashValue = financials?.cashOnHand !== undefined ? financials.cashOnHand : 3400000;
    const healthIndex = financials?.healthScore !== undefined ? financials.healthScore : 85;
    const growthIndex = financials?.growthScore !== undefined ? financials.growthScore : 74;
    const cacValue = financials?.cac !== undefined ? financials.cac : 1200;
    const ltvValue = financials?.ltv !== undefined ? financials.ltv : 6500;
    const hcValue = financials?.headcount !== undefined ? financials.headcount : 42;

    const systemInstruction = `You are FinTwin AI, the Autonomous Financial Digital Twin Platform virtual CFO.
You are acting as an expert CFO and Strategy Advisor for ${company}, operating in the "${industryValue}" sector.
Here is the real-time, real and actual Digital Twin context of the business:
- Core metrics:
  * Company Name: "${company}"
  * Industry: "${industryValue}"
  * Total Monthly Revenue: $${revValue.toLocaleString()}
  * Total Monthly Expenses: $${expValue.toLocaleString()}
  * Monthly Net Profit: $${profValue.toLocaleString()}
  * Corporate Cash Balance: $${cashValue.toLocaleString()} (runway is currently ${(cashValue / (expValue || 1)).toFixed(1)} months)
  * Financial Health index: ${healthIndex}/100
  * Growth rating: ${growthIndex}/100
  * Headcount: ${hcValue} employees
  * Customer Acquisition Cost (CAC): $${cacValue.toLocaleString()}
  * Lifetime Value (LTV): $${ltvValue.toLocaleString()} (LTV/CAC ratio is ~${(ltvValue / (cacValue || 1)).toFixed(1)}x)
  
Key warnings and risks in the twin logs:
  * Microcontroller hardware and logistics are expected to see supplier fluctuations next quarter.
  * Paid advertising bidding is inflating, pushing CAC limits uphill.
  * Inflow collection times (DSO) occasionally affect quick operating liquidity.

Provide structured, friendly, action-oriented, and data-backed CFO insights. ALWAYS refer to the user's REAL and ACTUAL numbers listed above to give accurate corporate advice.
Reference specific metrics of the digital twin whenever appropriate. Keep responses relatively concise, readable, and highly professional. Feel free to format your response with beautiful Markdown, including subheadings, font weight styling, bullet points, numbers, or simple tables if relevant. Do not output raw JSON unless specifically requested.`;

    // Build messages array for Groq
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemInstruction }
    ];

    for (const msg of history) {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }

    messages.push({ role: 'user', content: message });

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "I was unable to analyze that request. Could you try rephrasing?";
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in corporate copilot:', error);
    res.status(500).json({ error: error.message || 'Internal server error while calling Groq API' });
  }
});

// 2. Future Simulation endpoint
app.post('/api/simulate', async (req, res) => {
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
});

// Configure Vite integration or Static Files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode - Mount Vite Dev Server Middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Mounting Vite dev server middlewares for digital twin development');
  } else {
    // Production mode - Serve static files from compiled dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production bundles from client builds in dist/ folder');
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`FinTwin AI backend active on http://localhost:${PORT}`);
  });
}

startServer();
