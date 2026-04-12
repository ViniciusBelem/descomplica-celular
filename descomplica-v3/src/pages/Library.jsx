import { useState, useEffect } from 'react';
import { Bookmark, Trash2, ChevronRight, Search, Cloud, CloudOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { favoriteService } from '../services/favoriteService';
import { useToast } from '../components/ui/Toast';

/**
 * Library Page (User Favorites)
 * Manages both local session pins and authenticated cloud favorites.
 */
export function Library() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { addToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      if (user) {
        // Fetch from Supabase if logged in
        console.log("☁️ Syncing with Cloud Favorites...");
        const cloudFavs = await favoriteService.getFavorites();
        setFavorites(cloudFavs);
      } else {
        // Fallback to local storage for guests
        const saved = localStorage.getItem('descomplica_favs');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      }
      setLoading(false);
    }
    
    loadData();
  }, [user]);

  const removeFavorite = async (id) => {
    try {
      if (user) {
        await favoriteService.removeFavorite(id);
      } else {
        const updated = favorites.filter(f => f.id !== id);
        localStorage.setItem('descomplica_favs', JSON.stringify(updated));
      }
      setFavorites(prev => prev.filter(f => f.id !== id));
      addToast("Aparelho removido da biblioteca.", "info");
    } catch (err) {
      addToast("Erro ao remover aparelho.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando Biblioteca...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Minha Biblioteca</h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Sua coleção pessoal de dispositivos salvos. {user ? 'Sincronizada em tempo real na nuvem.' : 'Salva apenas no seu navegador.'}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-xl">
              <div className="text-right">
                 <span className="block text-2xl font-black text-primary leading-none">{favorites.length}</span>
                 <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Aparelhos Salvos</span>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                 {user ? <Cloud size={20} /> : <Bookmark size={20} />}
              </div>
           </div>
           {!user && (
             <Link to="/register" className="text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-1">
               <CloudOff size={10} /> Sincronizar na Nuvem
             </Link>
           )}
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-surface-container/50 border border-white/5 rounded-3xl p-16 text-center max-w-2xl mx-auto border-dashed">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sua biblioteca está vazia</h3>
          <p className="text-gray-500 mb-8">Navegue pelo catálogo e favorite os aparelhos que mais gostar para vê-los aqui.</p>
          <Link to="/phones">
            <Button variant="primary">Explorar Catálogo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(phone => (
            <div 
              key={phone.id}
              className="group relative bg-surface-container border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-lg"
            >
              <div className="aspect-video bg-black/40 flex items-center justify-center p-6 relative">
                 {phone.image_url ? (
                   <img src={phone.image_url} alt={phone.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <Bookmark size={40} className="text-white/5" />
                 )}
                 <button 
                   onClick={() => removeFavorite(phone.id)}
                   className="absolute top-4 right-4 p-2 bg-black/60 text-gray-400 hover:text-error rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                   title="Remover"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <span className="text-[10px] uppercase font-bold text-primary tracking-widest block mb-1">{phone.brand}</span>
                     <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{phone.name}</h3>
                   </div>
                   <div className="text-right">
                      <span className="text-lg font-black text-white leading-none">R$ {phone.price?.toLocaleString('pt-BR')}</span>
                      <span className="block text-[8px] text-success font-bold uppercase tracking-widest mt-1 italic">Best Match</span>
                   </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link to={`/phones/${phone.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-xs py-2">Ver Detalhes</Button>
                  </Link>
                  <Button variant="primary" className="px-3" onClick={() => window.open(phone.affiliate_link, '_blank')}>
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
