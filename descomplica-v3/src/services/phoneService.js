/**
 * Phone Service (Database-Ready)
 * Connects to the Supabase PostgreSQL database.
 */
import { supabase } from '../lib/supabase';

export const phoneService = {
  /**
   * Fetches all smartphones for the catalog.
   */
  async getAllPhones() {
    try {
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { data, error } = await supabase
        .from('smartphones')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching all phones:", err);
      return [];
    }
  },

  /**
   * Fetches a single smartphone by ID.
   */
  async getPhoneById(id) {
    try {
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { data, error } = await supabase
        .from('smartphones')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching phone by ID:", err);
      return null;
    }
  },

  /**
   * Fetches real recommendations from Supabase using filtered queries.
   */
  async getRecommendations({ budget, profile, priority }) {
    console.log("➡️ Iniciando Neural Match v3. Filtros recebidos:", { budget, profile, priority });
    
    try {
      if (!supabase) throw new Error("Supabase client not initialized.");
      let query = supabase
        .from('smartphones')
        .select('*')
        .lte('price', parseFloat(budget) || 15000);

      // Filter by profile if not 'balanced'
      if (profile && profile !== 'balanced') {
        query = query.contains('profile_tags', [profile]);
      }

      const { data, error } = await query
        .order('match_score', { ascending: false })
        .limit(20); // Get more candidates to refine locally

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Advanced Neural Match Algorithm
        const processedResults = data.map(phone => {
          let dynamicScore = phone.match_score || 70; // Base score
          
          // 1. Tag Match Boost (+15% if exact priority tag matches)
          if (priority && phone.priority_tags?.includes(priority)) {
            dynamicScore += 12;
          }
          
          // 2. Deep Score Analysis (JSONB Parsing)
          if (phone.scores) {
            const { performance, camera, battery, display } = phone.scores;
            if (priority === 'performance' && performance > 85) dynamicScore += (performance - 85) * 0.5;
            if (priority === 'camera' && camera > 85) dynamicScore += (camera - 85) * 0.5;
            if (priority === 'battery' && battery > 85) dynamicScore += (battery - 85) * 0.5;
            if (priority === 'display' && display > 85) dynamicScore += (display - 85) * 0.5;
          }

          // 3. Budget Proximity Boost
          const budgetRatio = phone.price / (parseFloat(budget) || 15000);
          if (budgetRatio > 0.8 && budgetRatio <= 1.0) dynamicScore += 3;
          
          return {
            id: phone.id,
            name: phone.name,
            model: phone.model,
            brand: phone.brand,
            desc: phone.description || `${phone.brand} ${phone.model} - Recomendado para seu perfil ${profile}.`,
            price: phone.price,
            score: Math.min(Math.round(dynamicScore), 100),
            affiliate_link: phone.affiliate_link,
            image_url: phone.image_url
          };
        });

        // Re-sort by dynamic score and return top 3
        return processedResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
      } else {
        console.warn("⚠️ Nenhum celular encontrado no Supabase para este orçamento.");
        return [];
      }
    } catch (err) {
      console.error("❌ Erro crítico no motor de recomendação:", err);
      return [];
    }
  }
};
