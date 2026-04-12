import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { Settings as SettingsIcon, Globe, Moon, Database, Shield, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/admin/ConfirmDialog';
import { useToast } from '../components/ui/Toast';

/**
 * Settings Page
 * User and System preferences center.
 */
export function Settings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    addToast(`Idioma alterado para ${lng.toUpperCase()}`, 'success');
  };

  const handleClearHistory = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleThemeClick = () => {
    addToast("O tema Dark Glassmorphism é a assinatura visual deste projeto e não pode ser desativado.", "info");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Configurações</h1>
        <p className="text-gray-400 text-lg">Personalize sua experiência no ecossistema Descomplica.</p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-surface-container border border-white/5 rounded-3xl p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 text-white/5 opacity-20">
             <Shield size={120} />
          </div>
          
          <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
            <Shield size={16} /> Conta & Segurança
          </h3>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-3xl font-black border border-primary/20 shadow-xl shadow-primary/10">
              {user ? user.email?.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
               <span className="block text-xl font-bold text-white mb-1">
                 {user ? user.email : 'Visitante'}
               </span>
               <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/5">
                 {user ? 'Acesso Administrativo' : 'Sessão Anônima'}
               </span>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-surface-container border border-white/5 rounded-3xl p-8 group">
              <Globe className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h4 className="text-lg font-bold text-white mb-2">Idioma / Language</h4>
              <p className="text-sm text-gray-500 mb-6">Altere o idioma de toda a interface do Smart Advisor.</p>
              
              <div className="flex gap-2">
                 <button 
                   onClick={() => changeLanguage('pt')}
                   className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                     i18n.language === 'pt' ? 'bg-secondary text-black border-secondary' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                   }`}
                 >
                   Português (BR)
                 </button>
                 <button 
                   onClick={() => changeLanguage('en')}
                   className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                     i18n.language === 'en' ? 'bg-secondary text-black border-secondary' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                   }`}
                 >
                   English (US)
                 </button>
              </div>
           </div>

           <div className="bg-surface-container border border-white/5 rounded-3xl p-8 group">
              <Moon className="text-accent mb-4 group-hover:scale-110 transition-transform" size={24} />
              <h4 className="text-lg font-bold text-white mb-2">Aparência</h4>
              <p className="text-sm text-gray-500 mb-6">Alternar entre os modos de visualização do sistema.</p>
              <Button 
                variant="outline" 
                className="w-full text-xs border-primary/20 text-primary hover:bg-primary/10" 
                onClick={handleThemeClick}
              >
                Manter Dark Glassmorphism
              </Button>
           </div>
        </div>

        {/* Data & Reset */}
        <div className="bg-surface-container border border-white/5 rounded-3xl p-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-error/70 mb-6 flex items-center gap-2">
             <Database size={16} /> Dados do Aplicativo
           </h3>
           
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                 <span className="block text-lg font-bold text-white mb-1">Limpar Cache e Histórico</span>
                 <p className="text-sm text-gray-500">Isso removerá seus favoritos e logs de busca do navegador.</p>
              </div>
              <Button 
                variant="outline" 
                className="text-error border-error/20 hover:bg-error/10 hover:border-error gap-2"
                onClick={() => setIsConfirmOpen(true)}
              >
                <Trash2 size={16} /> Resetar App
              </Button>
           </div>
        </div>

        <div className="text-center pt-8">
           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">
             Versão 3.0.0-Stable // Build 2026.04
           </p>
        </div>
      </div>
      
      <ConfirmDialog 
         isOpen={isConfirmOpen}
         onClose={() => setIsConfirmOpen(false)}
         onConfirm={handleClearHistory}
         title="Limpar Histórico"
         message="Tem certeza que deseja limpar todo o seu histórico local e favoritos da sessão? Esta ação é irreversível."
      />
    </div>
  );
}
