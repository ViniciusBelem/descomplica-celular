import { create } from 'zustand';
import { phoneService } from '../services/phoneService';

/**
 * Advisor Store (Zustand)
 * Centralizes the state and transitions for the virtual assistant flux.
 */
export const useAdvisorStore = create((set, get) => ({
  // ─── STATE ───
  step: 1,
  budget: '',
  profile: 'balanced',
  priority: '',
  results: null,
  isComputing: false,
  error: null,

  // ─── COMPUTED ───
  isStep1Valid: () => {
    const b = parseFloat(get().budget);
    return !isNaN(b) && b > 0;
  },
  
  isStep2Valid: () => !!get().profile,
  isStep3Valid: () => !!get().priority,

  // ─── ACTIONS ───
  setBudget: (val) => set({ budget: val, error: null }),
  setProfile: (val) => set({ profile: val, error: null }),
  setPriority: (val) => set({ priority: val, error: null }),
  
  nextStep: () => {
    const { step, isStep1Valid, isStep2Valid } = get();
    if (step === 1 && !isStep1Valid()) return;
    if (step === 2 && !isStep2Valid()) return;
    set({ step: Math.min(step + 1, 3) });
  },
  
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  setStep: (stepNum) => set({ step: stepNum }),

  /**
   * Triggers the neural match algorithm (Service Call)
   */
  executeSearch: async () => {
    set({ isComputing: true, error: null });
    try {
      const { budget, profile, priority } = get();
      const results = await phoneService.getRecommendations({ budget, profile, priority });
      set({ results, isComputing: false });
    } catch {
      set({ error: "Erro ao processar recomendações. Tente novamente.", isComputing: false });
    }
  },

  reset: () => set({ 
    step: 1, 
    budget: '', 
    profile: 'balanced', 
    priority: '', 
    results: null,
    isComputing: false,
    error: null
  })
}));
