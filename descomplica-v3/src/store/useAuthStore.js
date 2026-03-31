import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * Authentication Store
 * Manages the Supabase user session seamlessly across the application.
 */
export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,
  
  // Initializes the session check
  initialize: async () => {
    // Ignore if mock client
    if (!supabase) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user || null, isLoading: false });

      // Listen for auth changes (login/logout/token refresh)
      supabase.auth.onAuthStateChange((_event, newSession) => {
        set({ session: newSession, user: newSession?.user || null });
      });
    } catch (err) {
      console.warn('Auth init failed, possibly no keys?', err);
      set({ isLoading: false });
    }
  },

  // Login action
  signIn: async (email, password) => {
    if (!supabase) throw new Error("Supabase client not initialized. Check your .env file.");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Logout action
  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }
}));
