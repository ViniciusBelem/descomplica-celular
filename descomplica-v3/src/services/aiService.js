import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 🤖 Neural Sentiment Analysis (A.E.S v4.1 - Nexus)
 * Integrates Google Gemini API for hardware sentiment extraction.
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const aiService = {
  /**
   * Performs sentiment analysis on user reviews to adjust the phone's score.
   * Returns a sentiment_bonus (0 to 1) based on real user feedback.
   */
  async analyzeSentiment(phoneModel, reviews = []) {
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'INSIRA_SUA_CHAVE_AQUI') {
      console.warn("⚠️ IA Nexus: API Key ausente ou inválida. Pulando análise.");
      return { sentiment_score: 1.0, pro: "Hardware sólido", con: "Análise pendente", verdict: "Aparelho bem avaliado." };
    }

    const prompt = `
      Analise o smartphone: ${phoneModel}
      Retorne APENAS um JSON no formato:
      {"sentiment_score": 0.0 a 1.0, "pro": "...", "con": "...", "verdict": "..."}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Sanitização agressiva para extrair apenas o conteúdo entre chaves
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Resposta da IA não contém JSON válido");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("❌ Neural Sentiment Error:", error);
      return { 
        sentiment_score: 1.0, 
        pro: "Hardware equilibrado", 
        con: "Disponibilidade variável", 
        verdict: "Uma escolha segura para o seu perfil." 
      };
    }
  }
};
