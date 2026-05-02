/**
 * 🔍 Search Service
 * Connects to Google Custom Search JSON API to fetch real user reviews and snippets.
 */
export const searchService = {
  async getReviewsForPhone(phoneModel) {
    const apiKey = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
    const cx = import.meta.env.VITE_GOOGLE_SEARCH_CX;

    if (!apiKey || !cx) {
      console.warn("⚠️ Google Search credentials missing. Using fallback reviews.");
      return [
        "Ótimo desempenho em jogos.",
        "A bateria poderia durar mais.",
        "Câmera surpreendente pelo preço."
      ];
    }

    try {
      const query = encodeURIComponent(`${phoneModel} reviews prós e contras brasil`);
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn("ℹ️ Google Search: Cota esgotada ou API não ativada. Usando conhecimento base da IA.");
          return ["Cota de busca esgotada. Usando conhecimento técnico prévio."];
        }
        const errorData = await response.json();
        console.error(`❌ Google Search API Error (${response.status}):`, errorData);
        throw new Error(`Google Search API returned ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // Extract snippets from the first 5 results
        return data.items.slice(0, 5).map(item => item.snippet);
      }

      return ["Sem avaliações recentes encontradas."];
    } catch (error) {
      console.error("❌ Google Search Failure:", error);
      return ["Erro ao buscar avaliações reais."];
    }
  }
};
