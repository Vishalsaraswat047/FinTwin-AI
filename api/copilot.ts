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
}