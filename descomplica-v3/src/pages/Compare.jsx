import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLibraryStore } from '../store/useLibraryStore';
import { ArrowLeftRight, Plus, X, BarChart3, Camera, Battery, Cpu, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import DetailsModal from '../components/DetailsModal';

/**
 * Professional Comparison Page
 * Restored to original layout with added functional logic.
 */
export function Compare() {
  const { t } = useTranslation();
  const { savedIds } = useLibraryStore();
  const [libraryPhones, setLibraryPhones] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([null, null, null]);
  const [showSelector, setShowSelector] = useState(null);
  const [selectedForDetails, setSelectedForDetails] = useState(null);

  useEffect(() => {
    if (savedIds.length > 0) {
      const fetchLibrary = async () => {
        try {
          const { data, error } = await supabase.from('smartphones').select('*').in('id', savedIds);
          if (error) throw error;
          setLibraryPhones(data || []);
        } catch (err) { console.error(err); }
      };
      fetchLibrary();
    }
  }, [savedIds]);

  const handleSelectPhone = (phone, index) => {
    const newSelection = [...selectedPhones];
    newSelection[index] = phone;
    setSelectedPhones(newSelection);
    setShowSelector(null);
  };

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* SECTION 1: HEADER - Espaçamento original mantido */}
      <section className="max-w-7xl mx-auto pt-20 pb-16 px-4 md:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-text tracking-tighter mb-4">
            {t('compare.title', 'Comparativo Técnico')}
          </h1>
          <p className="text-text-muted font-medium text-lg max-w-2xl mx-auto">
            {t('compare.subtitle', 'Cruzamos os dados brutos para você decidir qual entrega mais valor.')}
          </p>
        </div>
      </section>

      {/* SECTION 2: COMPARISON GRID */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {selectedPhones.map((phone, idx) => (
            <div key={idx} className={`relative glass-panel rounded-[2rem] border transition-all duration-500 min-h-[400px] flex flex-col ${phone ? 'border-primary/20 bg-surface' : 'border-dashed border-primary/10 hover:border-primary/30 bg-surface-container/30'}`}>
              
              {showSelector === idx ? (
                 <div className="p-6 flex flex-col h-full animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sua Biblioteca</span>
                       <button onClick={() => setShowSelector(null)} className="text-text-muted hover:text-text"><X size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                       {libraryPhones.map(libPhone => (
                         <button 
                           key={libPhone.id}
                           onClick={() => handleSelectPhone(libPhone, idx)}
                           className="w-full p-3 rounded-xl border border-primary/5 hover:border-primary/20 bg-surface-container flex items-center gap-3 transition-all"
                         >
                            <img src={libPhone.image_url} alt="" className="w-10 h-10 object-contain bg-surface rounded-lg p-1" />
                            <span className="text-xs font-black text-text text-left truncate">{libPhone.name}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              ) : phone ? (
                <div className="p-8 flex-1 flex flex-col">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setSelectedForDetails(phone)} className="text-text-muted hover:text-primary transition-colors"><Info size={18} /></button>
                    <button className="text-text-muted hover:text-error transition-colors" onClick={() => {
                      const newSelection = [...selectedPhones];
                      newSelection[idx] = null;
                      setSelectedPhones(newSelection);
                    }}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="aspect-square bg-surface-container rounded-2xl mb-6 flex items-center justify-center p-6 cursor-pointer" onClick={() => setSelectedForDetails(phone)}>
                    <img src={phone.image_url} alt={phone.name} className="max-h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-black text-text text-center mb-6 cursor-pointer" onClick={() => setSelectedForDetails(phone)}>{phone.name}</h3>
                  
                  <div className="space-y-4">
                    <ScoreBar label="Câmera" value={phone.scores?.camera || 80} icon={Camera} />
                    <ScoreBar label="Bateria" value={phone.scores?.battery || 75} icon={Battery} />
                    <ScoreBar label="Performance" value={phone.scores?.performance || 90} icon={Cpu} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center group/btn cursor-pointer" onClick={() => setShowSelector(idx)}>
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/10 group-hover/btn:scale-110 group-hover/btn:bg-primary/10 transition-all">
                    <Plus size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-text uppercase tracking-widest text-xs mb-1">Selecionar Aparelho</h4>
                    <p className="text-[10px] text-text-muted font-bold px-4">Escolha um modelo do catálogo para comparar.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FOOTER INFO */}
      <section className="max-w-7xl mx-auto py-24 px-4 md:px-8">
        <div className="glass-panel p-10 md:p-14 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 shadow-inner">
            <BarChart3 size={32} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black text-text mb-2 uppercase tracking-tight">Análise de Dados</h4>
            <p className="text-base text-text-muted font-bold leading-relaxed opacity-80">
              Nossos scores são calculados com base em testes laboratoriais e reviews de especialistas. A precisão do comparativo ajuda você a entender onde cada centavo do seu investimento está sendo aplicado.
            </p>
          </div>
        </div>
      </section>

      <DetailsModal phone={selectedForDetails} onClose={() => setSelectedForDetails(null)} />
    </div>
  );
}

function ScoreBar({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
        <div className="flex items-center gap-1.5">
           <Icon size={12} className="text-primary" />
           <span>{label}</span>
        </div>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="h-2 bg-surface-container rounded-full overflow-hidden border border-primary/5">
        <div 
          className="h-full bg-gradient-to-r from-primary/40 to-primary transition-all duration-1000 shadow-[0_0_10px_rgba(var(--color-primary),0.3)]" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
