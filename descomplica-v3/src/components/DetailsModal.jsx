import { X, ExternalLink, Camera, Battery, Cpu, Monitor, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 📱 Phone Details Modal - Public View
 * Shows full technical specifications and affiliate links.
 */
export default function DetailsModal({ phone, onClose }) {
  if (!phone) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-surface border border-primary/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-text-muted hover:text-primary transition-colors z-20 bg-surface-container rounded-xl border border-primary/10"
          >
            <X size={20} />
          </button>

          {/* Left Side: Visual */}
          <div className="w-full md:w-2/5 bg-surface-container flex items-center justify-center p-12 relative border-b md:border-b-0 md:border-r border-primary/10">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
             <img 
               src={phone.image_url} 
               alt={phone.name} 
               className="max-h-full object-contain drop-shadow-2xl relative z-10" 
             />
          </div>

          {/* Right Side: Content */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
             <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic bg-primary/10 px-3 py-1 rounded-lg">
                  {phone.brand}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-text tracking-tighter leading-none mt-4">
                  {phone.name}
                </h2>
                <p className="text-3xl font-black text-secondary mt-4 italic">
                  R$ {phone.price?.toLocaleString()}
                </p>
             </div>

             {/* Specs Grid */}
             <div className="grid grid-cols-2 gap-6 mb-10">
                <SpecItem icon={Camera} label="Câmera" value={`${phone.scores?.camera}%`} color="text-accent" />
                <SpecItem icon={Battery} label="Bateria" value={`${phone.scores?.battery}%`} color="text-secondary" />
                <SpecItem icon={Cpu} label="Performance" value={`${phone.scores?.performance}%`} color="text-primary" />
                <SpecItem icon={Monitor} label="Tela" value={`${phone.scores?.display || 85}%`} color="text-blue-400" />
             </div>

             {/* Description or Marketing Text */}
             <div className="space-y-4 mb-10 border-t border-primary/5 pt-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Análise do Consultor</h4>
                <p className="text-text font-medium leading-relaxed opacity-80 italic">
                  "{phone.description || `O ${phone.name} é uma escolha estratégica para quem busca o melhor equilíbrio entre ${phone.profile_tags?.join(' e ')}.`}"
                </p>
             </div>

             {/* Call to Action */}
             <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20 group"
                  onClick={() => phone.affiliate_link ? window.open(phone.affiliate_link, '_blank') : null}
                >
                   Ir para Loja Oficial <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 h-16 rounded-2xl font-black uppercase tracking-widest text-xs border-primary/10"
                  onClick={onClose}
                >
                   Voltar
                </Button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SpecItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 bg-surface-container/50 p-4 rounded-2xl border border-primary/5">
       <div className={`w-10 h-10 rounded-xl bg-surface flex items-center justify-center ${color} shadow-inner`}>
          <Icon size={18} />
       </div>
       <div>
          <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>
          <span className="text-lg font-black text-text">{value}</span>
       </div>
    </div>
  );
}
