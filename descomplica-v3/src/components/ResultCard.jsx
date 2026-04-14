import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { ExternalLink, Info } from "lucide-react";
import DetailsModal from "./DetailsModal";

/**
 * ResultCard (Refined)
 * Shows the match result with a premium "Glass" look and functional CTAs.
 */
export default function ResultCard({ item, rank }) {
  const { t } = useTranslation();
  const [showDetails, setShowNoDetails] = useState(false);

  return (
    <>
      <div className="group relative p-6 bg-surface-container border border-primary/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-primary/40 hover:bg-surface transition-all duration-500 overflow-hidden shadow-xl">
        {/* Decorative rank background */}
        <div className="absolute -top-4 -right-4 text-8xl font-black text-text/5 italic select-none">
          0{rank}
        </div>
        
        <div className="flex-1 relative z-10 text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
              {item.score}% Match
            </span>
            {rank === 1 && (
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full border border-secondary/20">
                {t('advisor.bestChoice')}
              </span>
            )}
          </div>
          <h4 className="text-xl font-black text-text mb-2 group-hover:text-primary transition-colors italic">
            {item.name}
          </h4>
          <p className="text-sm text-text-muted leading-relaxed max-w-md font-medium">
            {item.desc}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1 relative z-10 w-full sm:w-auto">
          <span className="text-3xl font-black text-text tracking-tighter group-hover:text-primary transition-colors italic">
            R$ {item.price.toLocaleString('pt-BR')}
          </span>
          <span className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-4">
            {t('advisor.lowestPrice')}
          </span>
          
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-xl font-black text-[10px] uppercase border-primary/10"
              onClick={() => setShowNoDetails(true)}
            >
              <Info size={14} className="mr-2" /> Detalhes
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1 rounded-xl font-black text-[10px] uppercase gap-2"
              onClick={() => item.affiliate_link ? window.open(item.affiliate_link, '_blank') : null}
            >
              {t('advisor.viewOffer')} <ExternalLink size={14} />
            </Button>
          </div>
        </div>
      </div>

      <DetailsModal phone={showDetails ? item : null} onClose={() => setShowNoDetails(false)} />
    </>
  );
}
