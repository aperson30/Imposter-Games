
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSecretWord = async (category: string): Promise<{ word: string, category: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a secret word for a social deduction game. 
      The category is: ${category}. 
      Return only JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["word", "category"]
        }
      }
    });
    return JSON.parse(response.text || '{"word": "Apple", "category": "Fruit"}');
  } catch (error) {
    return { word: "Elephant", category: "Animals" };
  }
};

export const generateQuestionPair = async (category: string): Promise<{ questionA: string, questionB: string, category: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a question pair for a social deduction game. 
      Category: ${category}. 
      Question A is for "Innocents". Question B is for the "Imposter". 
      Question B should be similar to Question A but slightly broader or different so the imposter's answer sounds almost right but slightly suspicious.
      Example: A: "What is your favorite planet?" B: "What is your favorite celestial body?"
      Return only JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionA: { type: Type.STRING, description: "True question for majority" },
            questionB: { type: Type.STRING, description: "Slightly different question for imposter" },
            category: { type: Type.STRING }
          },
          required: ["questionA", "questionB", "category"]
        }
      }
    });
    return JSON.parse(response.text || '{"questionA": "Favorite fruit?", "questionB": "Favorite red thing?", "category": "General"}');
  } catch (error) {
    return { questionA: "Favorite movie?", questionB: "Favorite story?", category: "Entertainment" };
  }
};

export const getAIClueCommentary = async (clues: { name: string, clue: string }[], secretWord: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Game Master. Word: "${secretWord}". Clues: ${clues.map(c => `${c.name}: ${c.clue}`).join(', ')}. 
      Witty 15-word commentary without revealing the imposter.`,
    });
    return response.text || "Suspicion is in the air!";
  } catch (error) {
    return "Who is blending in too well?";
  }
};
