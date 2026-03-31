import { supabase } from '../lib/supabase';

/**
 * Service to manage catalog operations (Create, Update, Delete)
 */

export const adminService = {
  // CREATE
  async insertPhone(phoneData) {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { data, error } = await supabase
      .from('smartphones')
      .insert([phoneData])
      .select();

    if (error) throw error;
    return data?.[0]; // return the inserted row
  },

  // UPDATE
  async updatePhone(id, phoneData) {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { data, error } = await supabase
      .from('smartphones')
      .update(phoneData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0]; // return the updated row
  },

  // DELETE
  async deletePhone(id) {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { error } = await supabase
      .from('smartphones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
