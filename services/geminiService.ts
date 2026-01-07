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

/**
 * Gera um resumo estruturado de múltiplas notas
 * Formato: Anotações/Informações + Ações
 */
export const summarizeNotes = async (notes: string[]): Promise<string> => {
  if (!notes || notes.length === 0) {
    return "Nenhuma nota para resumir.";
  }

  try {
    const notesText = notes
      .map((note, idx) => `${idx + 1}. ${note}`)
      .join("\n");

    const prompt = `Analise as seguintes anotações e crie um resumo estruturado em português:

${notesText}

Por favor, organize o resumo no seguinte formato:

📝 ANOTAÇÕES E INFORMAÇÕES:
• [Liste aqui os pontos informativos, observações, contextos e dados relevantes em tópicos]

✅ AÇÕES E TAREFAS:
• [Liste aqui as ações identificadas, tarefas pendentes, itens que requerem follow-up ou decisões]

Seja conciso e objetivo. Se não houver ações identificadas, escreva "Nenhuma ação identificada."`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o resumo.";
  } catch (error) {
    console.error("Error summarizing notes:", error);
    return "Erro ao gerar resumo. Tente novamente.";
  }
};

/**
 * Gera um resumo estruturado de notas de uma data específica
 * Formato: Anotações/Informações + Ações
 */
export const summarizeNotesByDate = async (
  notes: string[],
  date: string
): Promise<string> => {
  if (!notes || notes.length === 0) {
    return "Nenhuma nota encontrada para esta data.";
  }

  try {
    const notesText = notes
      .map((note, idx) => `${idx + 1}. ${note}`)
      .join("\n");

    const prompt = `Analise as seguintes anotações do dia ${date} e crie um resumo estruturado em português:

${notesText}

Por favor, organize o resumo no seguinte formato:

📅 RESUMO DO DIA ${date}

📝 ANOTAÇÕES E INFORMAÇÕES:
• [Liste aqui os pontos informativos, observações, contextos e dados relevantes em tópicos]

✅ AÇÕES E TAREFAS:
• [Liste aqui as ações identificadas, tarefas pendentes, itens que requerem follow-up ou decisões]

Seja conciso e objetivo. Se não houver ações identificadas, escreva "Nenhuma ação identificada."`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o resumo.";
  } catch (error) {
    console.error("Error summarizing notes by date:", error);
    return "Erro ao gerar resumo. Tente novamente.";
  }
};
