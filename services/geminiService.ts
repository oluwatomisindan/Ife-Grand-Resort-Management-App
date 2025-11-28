import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (prompt: string, context?: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Please assume a mocked intelligent response here.";

  try {
    const fullPrompt = `
      You are an intelligent assistant for the "Ife Grand Resort".
      Your goal is to assist staff with operations, suggest email drafts, analyze maintenance issues, or summarize data.
      
      Context from the current page/module: ${context || 'None'}
      
      User Request: ${prompt}
      
      Keep responses professional, concise, and helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};

export const analyzeMaintenanceTicket = async (description: string): Promise<{ priority: string; category: string }> => {
    if (!apiKey) return { priority: 'Medium', category: 'General' };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this maintenance issue and output JSON with 'priority' (Low, Medium, High, Critical) and 'category' (Plumbing, Electrical, HVAC, Structural, Other). Description: "${description}"`,
             config: { responseMimeType: 'application/json' }
        });
        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (e) {
        return { priority: 'Medium', category: 'General' };
    }
}
