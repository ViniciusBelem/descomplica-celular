import { supabase } from '../lib/supabase';

/**
 * Admin Service
 * Handles administrative operations for the smartphone catalog.
 */
export const adminService = {
  /**
   * Inserts a new smartphone into the catalog.
   */
  async insertPhone(phoneData) {
    if (!supabase) throw new Error("Supabase client not initialized.");
    
    const { data, error } = await supabase
      .from('smartphones')
      .insert([phoneData])
      .select();
    
    if (error) {
      console.error("Error inserting phone:", error);
      throw error;
    }
    return data;
  },

  /**
   * Updates an existing smartphone's data.
   */
  async updatePhone(id, updateData) {
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { data, error } = await supabase
      .from('smartphones')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating phone:", error);
      throw error;
    }
    return data;
  },

  /**
   * Deletes a smartphone from the database.
   */
  async deletePhone(id) {
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase
      .from('smartphones')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting phone:", error);
      throw error;
    }
    return true;
  }
};
