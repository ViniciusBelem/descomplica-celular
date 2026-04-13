import { useTranslation } from 'react-i18next';
import { Library as LibraryIcon, Trash2, ArrowRight, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

/**
 * Professional Library (Favorites) Page
 * Manages user's saved smartphones for future reference or comparison.
 */
export function Library() {
  const { t } = useTranslation();
  
  // Placeholder para lógica de estado (Zustand será injetado depois)
  const savedPhones = []; 

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-[0_0_30px_rgba(var(--color-primary),0.1)]">
          <LibraryIcon size={32} />
        </div>
        <h1 className="text-4xl font-black text-text tracking-tighter mb-2">
          {t('library.title', 'Minha Biblioteca')}
        </h1>
        <p className="text-text-muted font-medium text-lg max-w-2xl">
          {t('library.subtitle', 'Sua seleção personalizada de aparelhos para facilitar sua escolha final.')}
        </p>
      </div>

      {savedPhones.length === 0 ? (
        <div className="glass-panel p-20 rounded-[3rem] text-center border border-primary/10 bg-gradient-to-br from-surface to-surface-container flex flex-col items-center shadow-xl">
           <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-text-muted/20 mb-8 border border-primary/5">
             <Heart size={48} strokeWidth={1} />
           </div>
           <h3 className="text-xl font-black text-text mb-2 uppercase tracking-tight">{t('library.emptyTitle', 'Sua lista está vazia')}</h3>
           <p className="text-text-muted font-bold max-w-md mx-auto mb-8">
             {t('library.emptyDesc', 'Navegue pelo catálogo e favorite os aparelhos que mais te interessam para vê-los aqui.')}
           </p>
           <Button variant="primary" className="gap-3 px-8 h-14 rounded-2xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs" onClick={() => window.location.href='/catalog'}>
             {t('library.goCatalog', 'Explorar Catálogo')} <ArrowRight size={18} />
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Futura implementação de Map de favoritos */}
        </div>
      )}

      {/* Sugestão de ação secundária */}
      <div className="mt-16 p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h4 className="text-lg font-black text-text">{t('library.compareHint', 'Deseja uma decisão técnica?')}</h4>
           <p className="text-sm text-text-muted font-bold">{t('library.compareHintDesc', 'Compare até 3 modelos da sua biblioteca lado a lado.')}</p>
        </div>
        <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
          {t('library.startCompare', 'Ir para Comparador')}
        </Button>
      </div>
    </div>
  );
}
