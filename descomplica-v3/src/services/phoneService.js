import { supabase } from '../lib/supabase';
import { aiService } from './aiService';
import { searchService } from './searchService';

/**
 * 🧠 Intelligence Engine: A.E.S (Algorithmic Evolutionary System) v4.1 - Nexus
 * Calculates real-time affinity and neural sentiment for hardware recommendations.
 */
export const phoneService = {
  // 🧼 Helper to prevent 406/403 errors with huge strings
  _sanitizeModel(model) {
    if (!model) return "";
    // Remove symbols, common prefixes and take only the main model parts
    const clean = model
      .replace(/\b(Smartphone|Celular|Xiaomi|Samsung|Motorola|Apple|iPhone)\b/gi, '') 
      .replace(/[()\-+]/g, ' ')
      .trim();
    
    // Take first 3 significant words
    return clean.split(/\s+/).slice(0, 3).join(' ');
  },

  _isSearching: false,

  async getRecommendations({ budget, profile, priority }) {
    if (this._isSearching) {
      console.warn("⏳ Já existe uma busca neural em curso. Aguarde...");
      return [];
    }
    
    const budgetNum = parseFloat(budget) || 15000;
    this._isSearching = true;

    // 🧠 Camada 1: Interceptação de Contexto (Hashing)
    const scenarioHash = `B${budgetNum}_P${profile}_Pr${priority}`.toLowerCase();

    try {
      if (!supabase) throw new Error("Conexão Supabase ausente");

      // 🔍 Verificação de Cache de Cenário (Latência Zero)
      let scenarioCache = null;
      try {
        const { data } = await supabase
          .from('context_cache')
          .select('*')
          .eq('scenario_hash', scenarioHash)
          .maybeSingle();
        scenarioCache = data;
      } catch (cacheFetchErr) {
        console.warn("ℹ️ Cache de cenário indisponível (Tabela não encontrada). Prosseguindo sem cache.");
      }

      // Se existir cache com menos de 7 dias, retorna instantâneo
      if (scenarioCache && scenarioCache.results) {
        const cacheAgeDays = (new Date() - new Date(scenarioCache.created_at)) / (1000 * 60 * 60 * 24);
        if (cacheAgeDays < 7) {
          console.log(`🚀 Neural Cache Scenario Hit [${scenarioHash}]: Latência Zero.`);
          return scenarioCache.results;
        }
      }

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

      // 3. Take top 3 for Neural Comparison & Discovery
      const top3 = recommendations
        .sort((a, b) => b.base_score - a.base_score)
        .slice(0, 3);

      // 4. 🤖 Neural Discovery & Analysis Phase (Layer 2 & 3)
      console.log("🧠 Initiating Neural Discovery for context:", { budget, profile, priority });
      const neuralData = await aiService.analyzeAndDiscover(top3, { budget, profile, priority });

      let finalResults = top3.map((phone, idx) => {
        // Busca Infalível por Índice (Layer 4.3)
        const analysis = neuralData.local_analysis?.[idx.toString()] || {};
        
        return this._formatResult(phone, {
          sentiment_score: analysis.score || 1.0,
          pro: analysis.pro || "Construção de alto padrão",
          con: analysis.con || "Disponibilidade limitada",
          verdict: analysis.verdict || phone.description || "Análise técnica em processamento."
        });
      });

      // 5. 🚀 Injetar Descoberta se a IA achou algo melhor (Layer 4)
      if (neuralData.discovery?.found && neuralData.discovery.data) {
        const newPhone = neuralData.discovery.data;
        console.log(`✨ AI Discovered a better model: ${newPhone.name}`);

        try {
          const dbSafeName = newPhone.name.trim();
          const { data: exists } = await supabase
            .from('smartphones')
            .select('name')
            .ilike('name', dbSafeName)
            .maybeSingle();

          if (!exists) {
            console.log(`💾 Registering ${newPhone.name} into Supabase autonomously...`);
            const { data: inserted } = await supabase.from('smartphones').insert([{
              name: newPhone.name,
              brand: newPhone.brand,
              model: newPhone.name,
              price: parseFloat(newPhone.price),
              match_score: 95,
              image_url: null,
              affiliate_link: newPhone.affiliate_link || null,
              profile_tags: newPhone.profile_tags,
              priority_tags: newPhone.priority_tags,
              scores: newPhone.scores,
              description: newPhone.ai_insights.verdict
            }]).select();

            if (inserted?.[0]) {
               const discoveredWithScore = { ...inserted[0], base_score: 100 };
               const discoveredFormatted = this._formatResult(discoveredWithScore, newPhone.ai_insights);
               finalResults.pop();
               finalResults.unshift(discoveredFormatted);
            }
          }
        } catch (dbErr) {
          console.error("❌ Autonomous Injection Failed:", dbErr.message);
        }
      }

      const sortedResults = finalResults.sort((a, b) => b.score - a.score);

      // 💾 Camada 4: Persistência de Cenário
      await supabase.from('context_cache').upsert({
        scenario_hash: scenarioHash,
        results: sortedResults,
        created_at: new Date().toISOString()
      }, { onConflict: 'scenario_hash' });

      return sortedResults;

    } catch (err) {
      console.error("❌ Neural Match Failure:", err.message);
      return []; 
    } finally {
      this._isSearching = false; // Libera para a próxima busca
    }
  },

  _formatResult(phone, aiData) {
    const base = phone.base_score || 80;
    const sentiment = aiData?.sentiment_score !== undefined ? aiData.sentiment_score : 1.0;
    const finalScore = Math.min(Math.round((base * 0.7) + (sentiment * 30)), 100);
    
    return {
      ...phone,
      score: finalScore,
      ai_insights: aiData,
      desc: aiData?.verdict || phone.description || `${phone.model}: Potencial técnico mapeado.`
    };
  },

  _getPerformanceTag(price) {
    if (price > 5000) return 'Premium';
    if (price > 2500) return 'Intermediário Premium';
    if (price > 1500) return 'Intermediário';
    return 'Entrada';
  }
};
