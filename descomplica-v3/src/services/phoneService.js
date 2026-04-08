/**
 * Phone Service (Database-Ready)
 * Connects to the Supabase PostgreSQL database.
 */
import { supabase } from '../lib/supabase';

// MOCK_PHONES maintained as fallback for offline testing
const MOCK_PHONES = [
  { id: 1, name: "Samsung Galaxy A55 5G", score: 86, price: 2100, desc: "Equilíbrio perfeito de câmera e bateria." },
  { id: 2, name: "POCO X6 Pro", score: 82, price: 2400, desc: "Poder bruto para perfis Heavy Duty." },
  { id: 3, name: "Motorola Edge 40 Neo", score: 78, price: 1900, desc: "Design curvo e bom conjunto geral." },
  { id: 4, name: "iPhone 15 Pro Plus", score: 100, price: 8500, desc: "O máximo em IA e fotografia móvel." }
];

export const phoneService = {
  /**
   * Fetches all smartphones for the catalog.
   */
  async getAllPhones() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('smartphones')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        return data || [];
      }
      return MOCK_PHONES;
    } catch (err) {
      console.error("Error fetching all phones:", err);
      return MOCK_PHONES;
    }
  },

  /**
   * Fetches a single smartphone by ID.
   */
  async getPhoneById(id) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('smartphones')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      }
      return MOCK_PHONES.find(p => p.id === parseInt(id)) || MOCK_PHONES[0];
    } catch (err) {
      console.error("Error fetching phone by ID:", err);
      return MOCK_PHONES[0];
    }
  },

  /**
   * Fetches real recommendations from Supabase using RPC or filtered queries.
   */
  async getRecommendations({ budget, profile, priority }) {
    console.log("➡️ Iniciando busca. Filtros recebidos:", { budget, profile, priority });
    
    try {
      if (supabase) {
        let query = supabase
          .from('smartphones')
          .select('*')
          .lte('price', parseFloat(budget) || 15000);

        // Filter by profile if not 'balanced' (which matches everything usually)
        if (profile && profile !== 'balanced') {
          query = query.contains('profile_tags', [profile]);
        }

        const { data, error } = await query
          .order('match_score', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Dynamic scoring based on priority
          const processedResults = data.map(phone => {
            let dynamicScore = phone.match_score;
            
            // If priority matches a tag or a score field, boost it
            if (priority && phone.priority_tags.includes(priority)) {
              dynamicScore += 10;
            }
            
            // Adjust based on specific score in JSONB if priority matches
            // priorities: 'performance', 'camera', 'battery', 'price'
            if (priority === 'performance' && phone.scores?.performance > 90) dynamicScore += 5;
            if (priority === 'camera' && phone.scores?.camera > 90) dynamicScore += 5;
            if (priority === 'battery' && phone.scores?.battery > 90) dynamicScore += 5;
            
            return {
              id: phone.id,
              name: phone.name,
              desc: phone.description || `${phone.brand} ${phone.model} - Excelente escolha para seu perfil.`,
              price: phone.price,
              score: Math.min(dynamicScore, 100),
              affiliate_link: phone.affiliate_link
            };
          });

          // Re-sort by dynamic score
          return processedResults.sort((a, b) => b.score - a.score).slice(0, 3);
        }
      }

      // ─── DEVELOPMENT MOCK (Fallback) ───
      const budgetNum = parseFloat(budget) || 5000;
      return MOCK_PHONES
        .filter(p => p.price <= budgetNum)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    } catch (err) {
      console.error("❌ Failed to fetch from DB, using mock.", err);
      return MOCK_PHONES.slice(0, 3);
    }
  }
};
