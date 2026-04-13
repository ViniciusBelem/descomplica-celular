/**
 * Phone Service (Database-Ready)
 * Connects to the Supabase PostgreSQL database.
 */
import { supabase } from '../lib/supabase';

// MOCK_PHONES as fallback for development/offline
const MOCK_PHONES = [
  { id: 1, name: "Samsung Galaxy A55 5G", score: 86, price: 2100, desc: "Equilíbrio perfeito de câmera e bateria." },
  { id: 2, name: "POCO X6 Pro", score: 82, price: 2400, desc: "Poder bruto para perfis Heavy Duty." },
  { id: 3, name: "Motorola Edge 40 Neo", score: 78, price: 1900, desc: "Design curvo e bom conjunto geral." },
  { id: 4, name: "iPhone 15 Pro Plus", score: 100, price: 8500, desc: "O máximo em IA e fotografia móvel." }
];

export const phoneService = {
  /**
   * Fetches recommendations from Supabase or Fallback Mock
   */
  async getRecommendations({ budget, profile, priority }) {
    const budgetNum = parseFloat(budget) || 15000;

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('smartphones')
          .select('*')
          .lte('price', budgetNum)
          .contains('profile_tags', [profile])
          .contains('priority_tags', [priority])
          .order('match_score', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          return data.map(phone => ({
            id: phone.id,
            name: phone.name,
            desc: phone.description || phone.model,
            price: phone.price,
            score: phone.match_score
          }));
        }
        
        // Se o banco retornou vazio, podemos avisar ou retornar lista vazia
        console.warn("Nenhum smartphone encontrado para os filtros aplicados.");
      }
    } catch (err) {
      console.error("Erro na conexão com Supabase:", err.message);
      // Aqui decidimos se queremos que o usuário saiba do erro ou veja o Mock
    }

    // Fallback para Mock (Apenas se falhar ou não houver Supabase)
    return MOCK_PHONES.filter(phone => phone.price <= budgetNum)
      .sort((a, b) => b.score - a.score);
  }
};
