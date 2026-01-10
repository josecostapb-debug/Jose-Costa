
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

export const chatWithAI = async (message: string, context: Student[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contextStr = context.map(s => `${s.name} (${s.modality}, nível ${s.level}, objetivo: ${s.goal || 'não definido'})`).join(", ");
    
    const systemInstruction = `Você é o assistente inteligente "Coach Digital" do PersonalPro. 
    Sua missão é dar suporte tanto a treinadores quanto a praticantes independentes.
    
    PARA PRATICANTES INDEPENDENTES (Quem treina sozinho):
    - Ajude-os a criar seu ambiente de treinos (Caminhada, Academia, Natação, Corrida).
    - Dê orientações técnicas de como executar os exercícios com segurança.
    - Sugira séries, repetições e tempos de descanso baseados nos objetivos deles.
    - Incentive o registro de atividades no planejador do app.
    
    PARA TREINADORES:
    - Atue como consultor técnico sobre fisiologia e biomecânica dos alunos.
    
    Atletas no contexto: ${contextStr}.
    Seja profissional, empático e técnico. Responda sempre de forma concisa e útil em Português.`;

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
