import { supabase } from '../lib/supabase';

/**
 * Analytics Service
 * Provides real-time insights from the database.
 */
export const analyticsService = {
  /**
   * Gets general statistics for the dashboard/analytics.
   */
  async getMarketStats() {
    if (!supabase) return null;

    try {
      // 1. Fetch all phones for calculations
      const { data: phones, error } = await supabase
        .from('smartphones')
        .select('brand, price, match_score');

      if (error) throw error;
      if (!phones || phones.length === 0) return null;

      // 2. Calculate Brand Trends
      const brandCounts = {};
      let totalBudget = 0;
      
      phones.forEach(p => {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
        totalBudget += p.price;
      });

      const topBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(b => b[0])
        .join(', ');

      const avgPrice = totalBudget / phones.length;

      // 3. Get Top Rated (Neural Match)
      const topDevices = [...phones]
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 4);

      return {
        topBrands,
        avgPrice,
        topDevices,
        totalPhones: phones.length
      };
    } catch (err) {
      console.error("Error fetching market stats:", err);
      return null;
    }
  }
};
