import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Search, Filter, Loader2, Bookmark, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';

/**
 * Professional Catalog Page
 * Fetches all smartphones with real-time filtering and search.
 */
export function Catalog() {
  const { t } = useTranslation();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(10000);

  useEffect(() => {
    fetchCatalog();
  }, []);

  async function fetchCatalog() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('smartphones')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPhones(data || []);
    } catch (err) {
      console.error("Error fetching catalog:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPhones = phones.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    p.price <= priceRange
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black text-text tracking-tighter mb-2">
            {t('catalog.title', 'Catálogo Completo')}
          </h1>
          <p className="text-text-muted font-medium text-lg">
            {t('catalog.subtitle', 'Explore nossa base de dados e encontre o aparelho perfeito.')}
          </p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={t('catalog.searchPlaceholder', 'Buscar modelo ou marca...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-primary/10 rounded-2xl p-4 pl-12 text-text outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-bold"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-primary/10">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <SlidersHorizontal size={18} />
              <h3 className="font-black uppercase tracking-widest text-xs">{t('catalog.filters', 'Filtros')}</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-text-muted mb-4 tracking-widest">
                  {t('catalog.maxPrice', 'Preço Máximo')}: <span className="text-primary">R$ {priceRange}</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="15000" 
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Grid Results */}
        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-text-muted">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">{t('catalog.loading', 'Sincronizando Banco...')}</p>
            </div>
          ) : filteredPhones.length === 0 ? (
            <div className="glass-panel p-20 rounded-3xl text-center border border-dashed border-primary/20">
              <p className="text-text-muted font-bold">{t('catalog.empty', 'Nenhum resultado encontrado para os filtros selecionados.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPhones.map(phone => (
                <CatalogCard key={phone.id} phone={phone} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogCard({ phone }) {
  const { t } = useTranslation();
  
  return (
    <div className="group glass-panel rounded-3xl border border-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden flex flex-col h-full bg-gradient-to-b from-surface/50 to-surface-container/30">
      <div className="aspect-[4/3] bg-surface-container flex items-center justify-center p-8 relative overflow-hidden">
        {phone.image_url ? (
          <img src={phone.image_url} alt={phone.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary/20 font-black text-2xl">?</div>
        )}
        <button className="absolute top-4 right-4 p-3 bg-surface/80 backdrop-blur rounded-xl text-text-muted hover:text-primary transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg">
          <Bookmark size={18} />
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-1 rounded-md">{phone.brand}</span>
          <h3 className="text-lg font-black text-text mt-2 group-hover:text-primary transition-colors">{phone.name}</h3>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-primary/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('catalog.priceFrom', 'A partir de')}</span>
            <span className="text-xl font-black text-secondary">R$ {phone.price?.toLocaleString()}</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl font-bold px-4">
            {t('catalog.details', 'Ver')}
          </Button>
        </div>
      </div>
    </div>
  );
}
