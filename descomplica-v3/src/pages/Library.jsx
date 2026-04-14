import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLibraryStore } from '../store/useLibraryStore';
import { Library as LibraryIcon, Trash2, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import DetailsModal from '../components/DetailsModal';

/**
 * Professional Library (Favorites) Page
 * Restored to original layout with functional logic integration.
 */
export function Library() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { savedIds, toggleLibrary } = useLibraryStore();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    if (savedIds.length > 0) {
      const fetchSavedPhones = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('smartphones').select('*').in('id', savedIds);
          if (error) throw error;
          const orderedData = savedIds.map(id => data.find(p => p.id === id)).filter(Boolean);
          setPhones(orderedData);
        } catch (err) { console.error(err); } finally { setLoading(false); }
      };
      fetchSavedPhones();
    } else { setPhones([]); }
  }, [savedIds]);

  return (
    <div className="w-full px-6 md:px-12 py-10 animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-[0_0_30px_rgba(var(--color-primary),0.1)]">
            <LibraryIcon size={32} />
          </div>
          <h1 className="text-4xl font-black text-text tracking-tighter mb-2">
            {t('library.title')}
          </h1>
          <p className="text-text-muted font-medium text-lg max-w-2xl">
            {t('library.subtitle')}
          </p>
        </div>
        
        {savedIds.length > 0 && (
           <Button variant="outline" onClick={() => navigate('/compare')} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] border-primary/20 text-primary hover:bg-primary/5">
              {t('library.goToCompare')}
           </Button>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : phones.length === 0 ? (
        <div className="glass-panel p-20 rounded-[3rem] text-center border border-primary/10 bg-gradient-to-br from-surface to-surface-container flex flex-col items-center shadow-xl">
           <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-text-muted/20 mb-8 border border-primary/5">
             <Heart size={48} strokeWidth={1} />
           </div>
           <h3 className="text-xl font-black text-text mb-2 uppercase tracking-tight">{t('library.emptyTitle')}</h3>
           <p className="text-text-muted font-bold max-w-md mx-auto mb-8">
             {t('library.emptyDesc')}
           </p>
           <Button variant="primary" className="gap-3 px-8 h-14 rounded-2xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs" onClick={() => navigate('/catalog')}>
             {t('library.goCatalog')} <ArrowRight size={18} />
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {phones.map(phone => (
             <div key={phone.id} className="glass-panel rounded-3xl p-6 border border-primary/5 flex gap-6 hover:border-primary/20 transition-all group">
                <div className="w-32 h-32 bg-surface-container rounded-2xl flex items-center justify-center p-4 shrink-0 overflow-hidden cursor-pointer" onClick={() => setSelectedPhone(phone)}>
                   <img src={phone.image_url} alt={phone.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                   <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{phone.brand}</span>
                     <h3 className="text-xl font-black text-text group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedPhone(phone)}>{phone.name}</h3>
                     <p className="text-lg font-black text-secondary mt-1">R$ {phone.price?.toLocaleString()}</p>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl font-bold px-4" onClick={() => setSelectedPhone(phone)}>
                         {t('library.details')}
                      </Button>
                      <button 
                        onClick={() => toggleLibrary(phone.id)}
                        className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-xl transition-all"
                        title={t('library.remove')}
                      >
                         <Trash2 size={20} />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h4 className="text-lg font-black text-text">{t('library.compareHint')}</h4>
           <p className="text-sm text-text-muted font-bold">{t('library.compareHintDesc')}</p>
        </div>
        <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]" onClick={() => navigate('/compare')}>
          {t('library.startCompare')}
        </Button>
      </div>

      <DetailsModal phone={selectedPhone} onClose={() => setSelectedPhone(null)} />
    </div>
  );
}
