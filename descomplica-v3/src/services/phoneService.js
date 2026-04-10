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
   * Fetches real recommendations from Supabase using RPC or filtered queries.
   */
  async getRecommendations({ budget, profile, priority }) {
    console.log("➡️ Iniciando busca. Filtros recebidos:", { budget, profile, priority });
    console.log("➡️ Cliente Supabase está disponível para a busca?", !!supabase);
    
    try {
      // ─── PRODUCTION LOGIC ───
      if (supabase) {
        console.log("➡️ Acessando Banco de Dados Oficial em São Paulo...");
        const { data, error } = await supabase
          .from('smartphones')
          .select('*')
          .lte('price', parseFloat(budget) || 15000)
          .contains('profile_tags', [profile]) // PostgreSQL array contains operator
          .contains('priority_tags', [priority]) // Filtro real de prioridade
          .order('match_score', { ascending: false })
          .limit(3);

        if (error) {
          console.error("❌ Erro do Supabase na hora da Query:", error);
          throw error;
        }
        
        console.log("➡️ Resposta bruta do banco Supabase:", data);

        if (data && data.length > 0) {
          console.log("✅ Supabase Conectado! Dados reais recebidos:", data.length, "celulares");
          // Map data to match the component's expected structure
          return data.map(phone => ({
            id: phone.id,
            name: phone.name,
            desc: phone.description || phone.model,
            price: phone.price,
            score: phone.match_score
          }));
        } else {
          console.warn("⚠️ O banco conectou e respondeu, mas voltou VAZIO (nenhum celular bateu com os filtros de perfil/preço). Usando Mock...");
        }
      } else {
        console.warn("⚠️ Bypass Ativado: Cliente Supabase está 'null'. As chaves falharam na validação inicial. Usando Mock...");
      }

      // ─── DEVELOPMENT MOCK (Fallback if no data) ───
      console.log("➡️ Caiu no Fallback: Retornando lista simulada de testes.");
      return MOCK_PHONES.filter(phone => {
        const budgetNum = parseFloat(budget);
        return isNaN(budgetNum) ? true : phone.price <= budgetNum;
      }).sort((a, b) => b.score - a.score);

    } catch (err) {
      console.error("❌ Failed to fetch from DB, using mock.", err);
      return MOCK_PHONES;
    }
  }
};
