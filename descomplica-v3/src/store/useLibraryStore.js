import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Professional Library Store (Zustand + Persistence)
 * Manages the user's saved smartphones with automatic localStorage sync.
 */
export const useLibraryStore = create(
  persist(
    (set, get) => ({
      savedIds: [], // Array of smartphone IDs

      // Action: Toggle a phone in the library
      toggleLibrary: (id) => {
        const { savedIds } = get();
        const isSaved = savedIds.includes(id);
        
        if (isSaved) {
          set({ savedIds: savedIds.filter(itemId => itemId !== id) });
        } else {
          // Max 10 items to keep library clean and performant
          if (savedIds.length >= 10) return; 
          set({ savedIds: [...savedIds, id] });
        }
      },

      // Action: Check if an item is saved
      isItemSaved: (id) => get().savedIds.includes(id),

      // Action: Clear everything
      clearLibrary: () => set({ savedIds: [] }),
    }),
    {
      name: 'descomplica-library-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
