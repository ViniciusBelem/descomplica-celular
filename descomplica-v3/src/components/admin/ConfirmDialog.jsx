import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * ConfirmDialog
 * Generic modal to confirm destructive or critical actions.
 */
export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Tem certeza?", 
  message = "Esta ação não pode ser desfeita.",
  isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1c1b1d] border border-white/5 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 bg-error hover:bg-error-hover text-white shadow-error/20" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Excluir"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
