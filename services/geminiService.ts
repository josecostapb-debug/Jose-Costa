
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

// Always use the API key from process.env.API_KEY directly.

export const getAITrainingTip = async (studentName: string, level: string, modality: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um personal trainer especialista em ${modality}. Gere uma dica rápida e motivadora (máximo 3 frases) em Português para o aluno(a) ${studentName}, que está no nível ${level}. Foque em técnica ou consistência de acordo com a modalidade (${modality}).`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Mantenha o foco na respiração e na constância dos movimentos!";
  }
};

export const chatWithAI = async (message: string, students: Student[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const studentsContext = students.map(s => `${s.name} (${s.modality}, nível ${s.level})`).join(", ");
    const systemInstruction = `Você é o assistente inteligente do AquaPro. 
    Sua função é ajudar o Personal Trainer com informações técnicas de Natação, Hidroginástica, Musculação e Pilates.
    Você conhece os seguintes alunos: ${studentsContext}.
    Seja profissional, motivador e técnico. Responda de forma concisa sobre qualquer uma das 4 áreas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemInstruction
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro no Chat IA:", error);
    return "Desculpe, tive um problema ao processar sua mensagem. Tente novamente em instantes.";
  }
};
