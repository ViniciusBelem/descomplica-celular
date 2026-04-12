import { supabase } from '../lib/supabase';

/**
 * Favorite Service
 * Manages user-specific favorite smartphones in the cloud.
 */
export const favoriteService = {
  /**
   * Fetches all favorite smartphones for the current user.
   */
  async getFavorites() {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('smartphone_id, smartphones(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
    
    // Flatten the join result
    return data.map(f => f.smartphones).filter(Boolean);
  },

  /**
   * Adds a smartphone to the user's favorites.
   */
  async addFavorite(smartphoneId) {
    if (!supabase) return false;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_favorites')
      .upsert({ user_id: user.id, smartphone_id: smartphoneId });

    if (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
    return true;
  },

  /**
   * Removes a smartphone from the user's favorites.
   */
  async removeFavorite(smartphoneId) {
    if (!supabase) return false;

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('smartphone_id', smartphoneId);

    if (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
    return true;
  }
};
