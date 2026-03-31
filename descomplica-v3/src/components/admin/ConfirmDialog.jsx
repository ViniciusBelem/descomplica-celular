import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="text-error" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
          </div>
          <p className="text-gray-400 mb-8 pl-16">{message}</p>
          
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
               className="bg-error text-white hover:bg-error/80 border-none shadow-error/20"
               onClick={onConfirm}
               disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sim, Excluir"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
