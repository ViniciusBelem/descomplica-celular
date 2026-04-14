import { supabase } from '../lib/supabase';

/**
 * 🧠 Intelligence Engine
 * Calculates real-time affinity between user profile and hardware specs.
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
        .lte('price', budgetNum);

      if (error) throw error;

      if (!data || data.length === 0) return [];

      // 2. Dynamic Match Algorithm (A.E.S Scoring)
      const recommendations = data.map(phone => {
        let affinity = 0;
        
        // Base Match from Profile (40% weight)
        if (phone.profile_tags?.includes(profile)) affinity += 40;
        
        // Priority Match (40% weight)
        if (phone.priority_tags?.includes(priority)) affinity += 40;

        // Price Value Score (20% weight - cheaper phones in the same tier get bonus)
        const priceRatio = 1 - (phone.price / budgetNum);
        affinity += (priceRatio * 20);

        // Map to UI Structure
        return {
          ...phone,
          score: Math.min(Math.round(affinity), 100), // Cap at 100%
          desc: phone.description || phone.model || "Aparelho ideal para seu perfil."
        };
      });

      // 3. Sort by highest score and take top 3
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    } catch (err) {
      console.error("❌ Neural Match Failure:", err.message);
      return []; // Return empty to avoid showing fake data if back-end is the target
    }
  }
};
