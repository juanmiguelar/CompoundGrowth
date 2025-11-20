import { GoogleGenAI } from "@google/genai";
import { CalculationResult, CalculationParams } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getFinancialAdvice = async (
  params: CalculationParams,
  result: CalculationResult
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "## Error\n\nAPI Key is missing. Please check your configuration.";
  }

  const prompt = `
    You are a helpful, expert financial advisor.
    A user has performed a compound interest calculation with the following parameters:
    - Initial Principal: $${params.initialPrincipal.toLocaleString()}
    - Monthly Contribution: $${params.monthlyContribution.toLocaleString()}
    - Interest Rate: ${params.interestRate}%
    - Time Horizon: ${params.years} years
    - Compounding Frequency: ${params.compoundFrequency} times/year

    The Result is:
    - Total Contributed: $${result.totalInvested.toLocaleString()}
    - Total Interest Earned: $${result.totalInterest.toLocaleString()}
    - Future Value: $${result.futureValue.toLocaleString()}

    Please provide a concise analysis in Markdown format.
    1. Comment on the effectiveness of this strategy.
    2. Highlight the "magic" of compound interest in this specific scenario (e.g., how much of the final value is free money).
    3. Suggest 2-3 brief actionable tips to improve this outcome (e.g., increasing contribution slightly, seeking better rates).
    4. Keep the tone encouraging but realistic regarding inflation or risk.
    
    Limit the response to approx 200 words. Use bullet points for readability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "## Error\n\nUnable to fetch financial insights at this moment. Please try again later.";
  }
};