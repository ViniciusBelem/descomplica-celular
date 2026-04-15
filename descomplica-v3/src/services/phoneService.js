import { supabase } from '../lib/supabase';
import { aiService } from './aiService';

/**
 * 🧠 Intelligence Engine: A.E.S (Algorithmic Evolutionary System) v4.1 - Nexus
 * Calculates real-time affinity and neural sentiment for hardware recommendations.
 */
export const phoneService = {
  async getRecommendations({ budget, profile, priority }) {
    const budgetNum = parseFloat(budget) || 15000;

    try {
      if (!supabase) throw new Error("Conexão Supabase ausente");

      // 1. Fetch phones within budget
      const { data, error } = await supabase
        .from('smartphones')
        .select('*')
        .lte('price', budgetNum)
        .order('price', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // 2. Initial Ranking (Math Base)
      const recommendations = data.map(phone => {
        let score = 0;
        const profileMatch = phone.profile_tags?.includes(profile) ? 1.0 : 0.5;
        score += (profileMatch * 35);
        const priorityMatch = phone.priority_tags?.includes(priority) ? 1.0 : 0.3;
        score += (priorityMatch * 45);
        const priceEfficiency = 1 - (phone.price / (budgetNum * 1.1)); 
        score += (priceEfficiency * 20);

        return {
          ...phone,
          base_score: score,
          tag: this._getPerformanceTag(phone.price),
        };
      });

      // 3. Sort by highest base score and take top 3 for Neural Analysis
      const top3 = recommendations
        .sort((a, b) => b.base_score - a.base_score)
        .slice(0, 3);

      // 4. 🤖 Neural Sentiment Phase (Real API Call)
      // We process the top 3 with Gemini to get real human feedback simulation
      const finalized = await Promise.all(top3.map(async (phone) => {
        const aiData = await aiService.analyzeSentiment(phone.model, [
          "Bateria dura o dia todo, muito satisfeito.",
          "Câmera incrível à noite, recomendo.",
          "Esquenta um pouco em jogos pesados."
        ]);

        // Final score: 70% Math + 30% Sentiment
        const finalScore = Math.min(Math.round((phone.base_score * 0.7) + (aiData.sentiment_score * 30)), 100);

        return {
          ...phone,
          score: finalScore,
          ai_insights: aiData,
          desc: aiData.verdict || phone.description || `${phone.model}: A escolha inteligente.`
        };
      }));

      return finalized.sort((a, b) => b.score - a.score);

    } catch (err) {
      console.error("❌ Neural Match Failure:", err.message);
      return []; 
    }
  },

  _getPerformanceTag(price) {
    if (price > 5000) return 'Premium';
    if (price > 2500) return 'Intermediário Premium';
    if (price > 1500) return 'Intermediário';
    return 'Entrada';
  }
};
