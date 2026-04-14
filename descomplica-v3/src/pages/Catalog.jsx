import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLibraryStore } from '../store/useLibraryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Loader2, 
  Bookmark, 
  ChevronRight, 
  X, 
  Smartphone, 
  Check, 
  ArrowUpDown, 
  Camera, 
  Battery, 
  Cpu,
  Star,
  Target
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import DetailsModal from '../components/DetailsModal';

export function Catalog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceTier, setPriceTier] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Modal State
  const [selectedPhone, setSelectedPhone] = useState(null);

  const priceTiers = [
    { id: 'all', label: 'Todos os Segmentos', min: 0, max: 99999 },
    { id: 'entry', label: 'Entrada (Até 2k)', min: 0, max: 2000 },
    { id: 'mid', label: 'Intermediário (2k-4k)', min: 2000, max: 4000 },
    { id: 'premium', label: 'Premium (4k-7k)', min: 4000, max: 7000 },
    { id: 'enthusiast', label: 'Elite (7k+)', min: 7000, max: 99999 },
  ];

  useEffect(() => { fetchCatalog(); }, []);

  async function fetchCatalog() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('smartphones').select('*').order('name');
      if (error) throw error;
      setPhones(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  const brands = useMemo(() => {
    const counts = phones.reduce((acc, p) => {
      acc[p.brand] = (acc[p.brand] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [phones]);

  const filteredAndSortedPhones = useMemo(() => {
    let result = phones.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const tier = priceTiers.find(t => t.id === priceTier);
      const matchesPrice = p.price >= tier.min && p.price <= tier.max;
      return matchesSearch && matchesBrand && matchesPrice;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'score') return (b.match_score || 0) - (a.match_score || 0);
      return a.name.localeCompare(b.name);
    });
  }, [phones, searchTerm, selectedBrands, priceTier, sortBy]);

  return (
    <div className="animate-in fade-in duration-1000 pb-32">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto pt-24 pb-8 px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="max-w-xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
               <Target size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Database</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-text tracking-tighter leading-none">
              Smart Catalog
            </h1>
            <p className="text-text-muted font-medium text-lg md:text-xl opacity-80 leading-relaxed">
              Explore a base de dados neural e filtre por performance bruta.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-[450px]">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="O que você procura?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container border border-primary/10 rounded-2xl p-5 pl-14 text-text outline-none focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all font-bold text-lg shadow-inner"
              />
            </div>
            <div className="flex items-center gap-3 px-2">
               <ArrowUpDown size={16} className="text-primary" />
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="bg-transparent text-text-muted font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer hover:text-primary transition-colors"
               >
                  <option value="name" className="bg-surface">Ordem: A — Z</option>
                  <option value="price-asc" className="bg-surface">Menor Investimento</option>
                  <option value="price-desc" className="bg-surface">Maior Investimento</option>
                  <option value="score" className="bg-surface">Melhor Match Score</option>
               </select>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-primary/5 space-y-10 bg-surface-container/10 backdrop-blur-xl shadow-2xl">
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic">Fabricantes</h3>
                 {selectedBrands.length > 0 && (
                   <button onClick={() => setSelectedBrands([])} className="text-[10px] font-black text-primary hover:text-secondary uppercase tracking-widest flex items-center gap-1 transition-colors">
                      <X size={12} /> Resetar Filtros
                   </button>
                 )}
              </div>
              <div className="flex flex-wrap gap-3">
                 {brands.map(([brand, count]) => (
                   <button
                     key={brand}
                     onClick={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                     className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${selectedBrands.includes(brand) ? 'bg-primary border-primary text-background shadow-lg shadow-primary/20' : 'bg-surface-container/50 border-primary/5 text-text-muted hover:border-primary/30'}`}
                   >
                     {brand} <span className="ml-2 opacity-40 font-mono">{count}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4 border-t border-primary/5 pt-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic">Segmentação de Mercado</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {priceTiers.map(tier => (
                   <button
                     key={tier.id}
                     onClick={() => setPriceTier(tier.id)}
                     className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex flex-col items-center gap-2 ${priceTier === tier.id ? 'bg-secondary/10 border-secondary text-secondary shadow-lg' : 'bg-surface-container/30 border-primary/5 text-text-muted hover:border-primary/20'}`}
                   >
                     {priceTier === tier.id ? <Check size={14} className="animate-in zoom-in" /> : <div className="h-[14px]" />}
                     <span className="text-center">{tier.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 3. GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={56} strokeWidth={3} />
            <p className="font-black animate-pulse uppercase tracking-[0.3em] text-[10px] italic text-primary">Sincronizando Banco...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 w-full">
            <AnimatePresence>
              {filteredAndSortedPhones.map(phone => (
                <CatalogCard key={phone.id} phone={phone} onDetails={() => setSelectedPhone(phone)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Details Modal Overlay */}
      <DetailsModal phone={selectedPhone} onClose={() => setSelectedPhone(null)} />
    </div>
  );
}

function CatalogCard({ phone, onDetails }) {
  const { t } = useTranslation();
  const { toggleLibrary, isItemSaved } = useLibraryStore();
  const isSaved = isItemSaved(phone.id);
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group glass-panel rounded-[2.5rem] border border-primary/5 hover:border-primary/20 transition-all duration-700 overflow-hidden flex flex-col h-full bg-gradient-to-b from-surface/50 to-surface-container/30 shadow-lg"
    >
      <div className="aspect-[4/3] bg-surface-container flex items-center justify-center p-10 relative overflow-hidden shadow-inner border-b border-primary/5">
        {phone.image_url ? (
          <img src={phone.image_url} alt={phone.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-1000 drop-shadow-2xl" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-primary/20 font-black text-3xl">?</div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleLibrary(phone.id); }}
          className={`absolute top-6 right-6 p-4 rounded-2xl transition-all shadow-xl border z-20 ${isSaved ? 'bg-primary text-background border-primary scale-110' : 'bg-surface/80 backdrop-blur text-text-muted hover:text-primary border-primary/10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0'}`}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
           <TechBadge icon={Camera} value={phone.scores?.camera} color="text-accent" />
           <TechBadge icon={Battery} value={phone.scores?.battery} color="text-secondary" />
           <TechBadge icon={Cpu} value={phone.scores?.performance} color="text-primary" />
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col cursor-pointer" onClick={onDetails}>
        <div className="mb-6 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-lg italic">{phone.brand}</span>
            <div className="flex items-center gap-1 text-primary">
               <Star size={14} className="fill-primary" />
               <span className="text-xs font-black">{phone.match_score || 85}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-text group-hover:text-primary transition-colors line-clamp-1 tracking-tighter italic">{phone.name}</h3>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-primary/5">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Preço Estimado</span>
            <span className="text-2xl font-black text-secondary italic">R$ {phone.price?.toLocaleString()}</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl font-black px-6 h-12 border-primary/10 hover:border-primary/30 group/btn shadow-sm" onClick={onDetails}>
            Ver Detalhes
            <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function TechBadge({ icon: Icon, value, color }) {
  return (
    <div className="bg-surface/90 backdrop-blur px-3 py-1.5 rounded-xl border border-primary/10 flex items-center gap-2 shadow-lg">
       <Icon size={14} className={color} />
       <span className="text-[10px] font-black text-text font-mono">{value}%</span>
    </div>
  );
}
