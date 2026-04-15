import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { ExternalLink, Info, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import DetailsModal from "./DetailsModal";

/**
 * ResultCard (Neural Nexus Edition)
 * Shows the match result with AI-driven insights and a premium "Glass" look.
 */
export default function ResultCard({ item, rank }) {
  const { t } = useTranslation();
  const [showDetails, setShowNoDetails] = useState(false);

  // AI data fallback if API fails or is not present
  const ai = item.ai_insights || { 
    pro: "Hardware equilibrado", 
    con: "Preço de lançamento", 
    verdict: item.desc 
  };

  return (
    <>
      <div className="group relative p-6 bg-surface-container border border-primary/10 rounded-3xl flex flex-col lg:flex-row justify-between items-start gap-8 hover:border-primary/40 hover:bg-surface transition-all duration-700 overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* Decorative rank background - Top-left with subtle stroke for high-end look */}
        <div 
          className="absolute -top-10 -left-6 text-[12rem] font-black italic select-none pointer-events-none z-0 transition-all duration-700 opacity-[0.05] group-hover:opacity-[0.15] text-primary"
          style={{ WebkitTextStroke: '1.5px currentColor', textStroke: '1.5px currentColor', fill: 'none' }}
        >
          {rank}
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 relative z-10 text-left w-full">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-full border border-primary/20 shadow-inner">
              <BrainCircuit size={12} className="animate-pulse" /> {item.score}% Match IA
            </span>
            {rank === 1 && (
              <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-[11px] font-black uppercase tracking-widest rounded-full border border-secondary/20 shadow-inner">
                🏆 {t('advisor.bestChoice')}
              </span>
            )}
          </div>

          <h4 className="text-2xl font-black text-text mb-3 group-hover:text-primary transition-all duration-500 italic tracking-tight">
            {item.model || item.name}
          </h4>

          {/* AI Verdict Section */}
          <div className="mb-6 p-4 bg-primary/[0.03] border-l-4 border-primary/40 rounded-r-xl">
            <p className="text-[13px] text-text font-semibold leading-relaxed italic opacity-90">
              "{ai.verdict}"
            </p>
          </div>

          {/* AI Pros & Cons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div className="flex items-start gap-3 p-3 bg-green-500/5 rounded-xl border border-green-500/10 hover:bg-green-500/10 transition-colors">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase text-green-500/70 tracking-widest mb-0.5">Ponto Forte</p>
                <p className="text-xs text-text font-bold opacity-80">{ai.pro}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
              <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase text-red-500/70 tracking-widest mb-0.5">Ponto Fraco</p>
                <p className="text-xs text-text font-bold opacity-80">{ai.con}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Actions Area */}
        <div className="flex flex-col items-start lg:items-end justify-center gap-2 relative z-10 w-full lg:w-auto min-w-[220px]">
          <div className="flex flex-col lg:items-end mb-4">
            <span className="text-4xl font-black text-text tracking-tighter group-hover:text-primary transition-all duration-500 italic">
              R$ {item.price.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-text-muted uppercase font-black tracking-[0.2em] opacity-60">
              {t('advisor.lowestPrice')}
            </span>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              variant="secondary" 
              className="w-full rounded-2xl py-6 font-black text-xs uppercase tracking-widest gap-3 shadow-lg hover:shadow-primary/20 transition-all duration-500 group-hover:-translate-y-1"
              onClick={() => item.affiliate_link ? window.open(item.affiliate_link, '_blank') : null}
            >
              {t('advisor.viewOffer')} <ExternalLink size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-2xl py-6 font-black text-xs uppercase tracking-widest border-primary/20 hover:bg-primary/5 gap-3"
              onClick={() => setShowNoDetails(true)}
            >
              <Info size={16} /> {t('advisor.details')}
            </Button>
          </div>
        </div>
      </div>

      <DetailsModal phone={showDetails ? item : null} onClose={() => setShowNoDetails(false)} />
    </>
  );
}
