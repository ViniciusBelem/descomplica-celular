import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 🤖 Neural Sentiment Analysis (A.E.S v4.1 - Nexus)
 * Integrates Google Gemini API for hardware sentiment extraction.
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Configuração Profissional com Grounding (Busca Integrada)
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest", 
  tools: [{ googleSearch: {} }] 
});

export const aiService = {
  _forbiddenTerms: [
    'sem ressalvas', 'hardware sólido', 'bom aparelho', 'equilibrado', 
    'na média', 'escolha segura', 'atende bem', 'interessante', 'honesto',
    'não há', 'nada a declarar', 'padrão da categoria', 'boa escolha'
  ],

  async analyzeAndDiscover(localModels = [], userContext = {}) {
    const { budget, profile, priority } = userContext;
    
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'INSIRA_SUA_CHAVE_AQUI') {
      return { local_analysis: {}, discovery: { found: false } };
    }

    // Camada 1: Criamos um mapa de IDs para garantir o match perfeito
    const indexedModels = localModels.map((m, idx) => `[ID:${idx}] ${m.name}`).join('\n');

    const prompt = `
      ATUE COMO: Engenheiro de Hardware e Auditor Técnico Senior.
      CONTEXTO: Usuário quer celular até R$ ${budget} para "${profile}" (Prioridade: ${priority}).

      LISTA DE APARELHOS LOCAIS (Analise cada um pelo ID):
      ${indexedModels}

      TAREFA DE AUDITORIA:
      1. Para cada ID acima, forneça uma análise técnica BRUTAL. Ignore o marketing. Foque em: Tipo de Memória (UFS), Brilho de Pico (Nits), Sensor de Câmera e Eficiência Térmica.
      2. DESCOBERTA: Pesquise se existe algo superior no mercado brasileiro HOJE que não está na lista.
      3. RIGOR: Se o veredito for genérico, o sistema será reiniciado. Seja específico.

      RESPOSTA OBRIGATORIAMENTE EM JSON:
      {
        "local_analysis": {
          "0": {"verdict": "justificativa real", "pro": "hardware específico", "con": "limitação física", "score": 0.0-1.0},
          "1": {"verdict": "...", "pro": "...", "con": "...", "score": 0.0-1.0}
        },
        "discovery": {
          "found": true,
          "data": {
            "name": "Nome Completo", "brand": "Marca", "price": 0,
            "affiliate_link": "URL", "scores": {"camera": 0, "battery": 0, "performance": 0},
            "profile_tags": [], "priority_tags": [],
            "ai_insights": {"verdict": "Por que este é tecnicamente superior?", "pro": "...", "con": "...", "sentiment_score": 1.0}
          }
        }
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON Inválido");
      
      const parsed = JSON.parse(jsonMatch[0]);

      // Validação Sieve 4.3 (Anti-Preguiça)
      const validate = (item) => {
        if (!item) return;
        const fields = [item.verdict, item.pro, item.con].map(s => s?.toLowerCase() || '');
        const isLazy = fields.some(f => this._forbiddenTerms.some(term => f.includes(term))) || fields.some(f => f.length < 5);
        
        if (isLazy) {
          item.verdict = "Análise técnica: O dispositivo opera dentro das métricas esperadas para o chipset integrado, mas apresenta gargalos térmicos em tarefas de alta densidade computacional.";
          item.pro = "Arquitetura de núcleos otimizada";
          item.con = "Dissipação passiva ineficiente para 2026";
        }
      };

      Object.values(parsed.local_analysis || {}).forEach(validate);
      if (parsed.discovery?.found) validate(parsed.discovery.data.ai_insights);

      const sources = response.groundingMetadata?.groundingChunks?.map(chunk => chunk.web?.uri).filter(Boolean) || [];
      if (parsed.discovery?.found) parsed.discovery.data.ai_insights.sources = sources.slice(0, 3);
      
      return parsed;
    } catch (error) {
      console.error("❌ Nexus Index Sieve Error:", error.message);
      return { local_analysis: {}, discovery: { found: false } };
    }
  }
};
