import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      palette: 'default',
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setPalette: (palette) => set({ palette }),
      
      applyTheme: () => {
        const { theme, palette } = useThemeStore.getState();
        const root = window.document.documentElement;
        
        // Handle Light/Dark
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        
        // Handle Palettes
        root.classList.remove('theme-ocean', 'theme-forest');
        if (palette !== 'default') {
          root.classList.add(`theme-${palette}`);
        }
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);
