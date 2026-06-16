import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in the Secrets panel.');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Financial Copilot endpoint
app.post('/api/copilot', async (req, res) => {
  try {
    const { message, history = [], financials } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

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

    // Map history to the format required by contents parameter in SDK
    const formattedContents = [];
    
    // Add history elements
    for (const msg of history) {
      formattedContents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to analyze that request. Could you try rephrasing?";
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in corporate copilot:', error);
    res.status(500).json({ error: error.message || 'Internal server error while calling Gemini API' });
  }
});

// 2. Future Simulation endpoint
app.post('/api/simulate', async (req, res) => {
  try {
    const { scenarioName, description, variables, financials } = req.body;
    if (!scenarioName || !variables) {
      return res.status(400).json({ error: 'Scenario parameters are required' });
    }

    const ai = getGeminiClient();

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

    const prompt = `Perform a premium financial digital twin simulation for ${company} based on this scenario:
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

Generate a JSON object strictly conforming to the requested response schema. Make sure all returned projected values represent integers of actual dollars, reflecting real and authentic financial mathematics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidenceScore: { type: Type.INTEGER, description: 'Percentage confidence from 0 to 100' },
            projectedRevenue: { type: Type.INTEGER, description: 'Simulated overall monthly revenue in dollars' },
            projectedExpenses: { type: Type.INTEGER, description: 'Simulated overall monthly expenses in dollars' },
            projectedProfit: { type: Type.INTEGER, description: 'Simulated monthly net profit in dollars' },
            projectedCash: { type: Type.INTEGER, description: 'Simulated cash balance in dollars' },
            projectedHealthScore: { type: Type.INTEGER, description: 'Simulated creditworthiness index from 1 to 100' },
            projectedGrowthScore: { type: Type.INTEGER, description: 'Simulated growth rating from 1 to 100' },
            keyFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 3 or 4 strategic drivers or cascade impacts identified'
            },
            alternativeScenarios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  outcome: { type: Type.STRING }
                }
              },
              description: 'Two tactical pathways proposed to contrast or optimize the resulting trajectory'
            },
            explanation: { type: Type.STRING, description: 'Detailed, highly expert financial critique of the scenario' }
          },
          required: [
            'confidenceScore', 'projectedRevenue', 'projectedExpenses', 'projectedProfit',
            'projectedCash', 'projectedHealthScore', 'projectedGrowthScore', 'keyFactors',
            'alternativeScenarios', 'explanation'
          ]
        },
        temperature: 0.4
      }
    });

    const resultText = response.text;
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinTwin AI backend active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
