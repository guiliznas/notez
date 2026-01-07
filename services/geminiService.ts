import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

console.log(
  "[GEMINI] Inicializando Gemini API...",
  import.meta.env.VITE_GEMINI_API_KEY ? "API Key encontrada" : "API Key ausente"
);

// Initialize the client strictly with import.meta.env.VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
console.log("[GEMINI] Gemini API inicializado");

/**
 * Enhances a quick note by fixing grammar, formatting, or expanding slightly.
 */
export const enhanceNote = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) return text;

  try {
    // Fix: Using generateContent directly with the model name as per guidelines for Basic Text Tasks
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Melhore e formate a seguinte nota para ficar mais clara e profissional, mantendo o idioma original (Português). Se for uma lista, formate como bullets. Mantenha conciso:\n\n"${text}"`,
    });

    // Directly access the .text property as per guidelines (it's not a function)
    return response.text || text;
  } catch (error) {
    console.error("Error enhancing note:", error);
    // Fail gracefully by returning original text
    return text;
  }
};

/**
 * Suggests a title for a new group based on the first note content.
 */
export const suggestTitle = async (content: string): Promise<string> => {
  if (!content || content.trim().length === 0) return "Nova Nota";

  try {
    // Fix: Using generateContent directly with the model name as per guidelines for Basic Text Tasks
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um título curto (máximo 4 palavras) para um grupo de anotações que começa com este texto:\n\n"${content}"\n\nResponda apenas com o título.`,
    });

    // Directly access the .text property as per guidelines
    return response.text ? response.text.trim() : "Nova Nota";
  } catch (error) {
    console.error("Error suggesting title:", error);
    return "Nova Nota";
  }
};
