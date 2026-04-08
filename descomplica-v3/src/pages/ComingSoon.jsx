import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

/**
 * Coming Soon Placeholder Page
 * Used for routes that are planned but not yet implemented.
 */
export function ComingSoon() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20">
        <LayoutDashboard size={40} className="text-primary animate-pulse" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
        EM BREVE
      </h1>
      
      <p className="text-gray-400 max-w-md text-lg mb-12">
        Esta funcionalidade está em desenvolvimento e fará parte da próxima atualização do ecossistema Descomplica.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button variant="primary" className="gap-2">
            <ArrowLeft size={18} /> Voltar ao Início
          </Button>
        </Link>
        <Button variant="outline">
          Ficar por dentro
        </Button>
      </div>
      
      <div className="mt-16 pt-16 border-t border-white/5 w-full max-w-2xl grid grid-cols-3 gap-8">
        <div>
          <span className="block text-2xl font-bold text-white mb-1">94%</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Core Completo</span>
        </div>
        <div>
          <span className="block text-2xl font-bold text-white mb-1">V3</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Engine React</span>
        </div>
        <div>
          <span className="block text-2xl font-bold text-white mb-1">2026</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Pronto para o Futuro</span>
        </div>
      </div>
    </div>
  );
}
