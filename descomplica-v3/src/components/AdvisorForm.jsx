import { useTranslation } from 'react-i18next';
import { useAdvisorStore } from '../store/useAdvisorStore';
import { BudgetStep } from './advisor/BudgetStep';
import { ProfileStep } from './advisor/ProfileStep';
import { PriorityStep } from './advisor/PriorityStep';
import ResultCard from './ResultCard';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AdvisorForm (Reconstructed)
 * Now an orchestrator of modular step components.
 */
export default function AdvisorForm() {
  const { t } = useTranslation();
  const { results, reset } = useAdvisorStore();

  return (
    <AnimatePresence mode="wait">
      {results ? (
        <motion.div 
          key="results"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 w-full max-w-2xl mx-auto p-8 glass-panel rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold tracking-tighter text-text">
              {t('advisor.resultsTitle')}
            </h3>            <span className="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full border border-secondary/30">
              Neural Match Found
            </span>
          </div>

          <div className="grid gap-6">
            {results.map((r, idx) => (
              <ResultCard key={r.id} item={r} rank={idx + 1} />
            ))}
          </div>

          <Button 
            variant="outline"
            className="mt-10 w-full"
            onClick={reset}
          >
            {t('advisor.btnRedo')}
          </Button>
        </motion.div>
      ) : (
        <motion.div
           key="form"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }}
           className="space-y-12 w-full max-w-2xl mx-auto py-10 px-4 sm:px-0"
        >
          <BudgetStep />
          <ProfileStep />
          <PriorityStep />
          
          <div className="pt-8 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">
              Algoritmo v3.0 // Powered by Supabase
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
