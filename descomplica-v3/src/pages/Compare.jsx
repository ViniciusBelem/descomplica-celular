import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftRight, Plus, X, BarChart3, Camera, Battery, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button';

/**
 * Professional Comparison Page
 * Allows users to select 2-3 devices and compare their scores in a grid.
 */
export function Compare() {
  const { t } = useTranslation();
  const [selectedPhones, setSelectedPhones] = useState([null, null, null]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-text tracking-tighter mb-4">
          {t('compare.title', 'Comparativo Técnico')}
        </h1>
        <p className="text-text-muted font-medium text-lg max-w-2xl mx-auto">
          {t('compare.subtitle', 'Cruzamos os dados brutos para você decidir qual entrega mais valor.')}
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {selectedPhones.map((phone, idx) => (
          <div key={idx} className={`relative glass-panel rounded-[2rem] border transition-all duration-500 min-h-[400px] flex flex-col ${phone ? 'border-primary/20 bg-surface' : 'border-dashed border-primary/10 hover:border-primary/30 bg-surface-container/30'}`}>
            {phone ? (
              <div className="p-8 flex-1 flex flex-col">
                <button className="absolute top-4 right-4 text-text-muted hover:text-error transition-colors" onClick={() => {
                  const newSelection = [...selectedPhones];
                  newSelection[idx] = null;
                  setSelectedPhones(newSelection);
                }}>
                  <X size={20} />
                </button>
                <div className="aspect-square bg-surface-container rounded-2xl mb-6 flex items-center justify-center p-6">
                  <img src={phone.image_url} alt={phone.name} className="max-h-full object-contain" />
                </div>
                <h3 className="text-xl font-black text-text text-center mb-6">{phone.name}</h3>
                
                {/* Scores bars */}
                <div className="space-y-4">
                   <ScoreBar label="Câmera" value={phone.scores?.camera || 80} icon={Camera} />
                   <ScoreBar label="Bateria" value={phone.scores?.battery || 75} icon={Battery} />
                   <ScoreBar label="Perfomance" value={phone.scores?.performance || 90} icon={Cpu} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/10">
                  <Plus size={32} />
                </div>
                <div>
                  <h4 className="font-black text-text uppercase tracking-widest text-xs mb-1">Selecionar Aparelho</h4>
                  <p className="text-[10px] text-text-muted font-bold px-4">Escolha um modelo do catálogo para comparar.</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2 rounded-xl border-primary/20 text-primary font-bold">
                   Escolher
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="glass-panel p-8 rounded-3xl border border-primary/10 flex items-start gap-6 max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
          <BarChart3 size={24} />
        </div>
        <div>
          <h4 className="text-lg font-black text-text mb-1 uppercase tracking-tight">Análise de Dados</h4>
          <p className="text-sm text-text-muted font-bold leading-relaxed">
            Nossos scores são calculados com base em testes laboratoriais e reviews de especialistas. A precisão do comparativo ajuda você a entender onde cada centavo do seu investimento está sendo aplicado.
          </p>
        </div>
      </div>
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
