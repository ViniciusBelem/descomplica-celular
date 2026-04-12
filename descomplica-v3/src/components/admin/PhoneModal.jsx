import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

/**
 * PhoneModal
 * Create/Edit smartphone modal with JSONB score support.
 */
export function PhoneModal({ isOpen, onClose, onSave, phoneToEdit = null }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    image_url: '',
    description: '',
    affiliate_link: '',
    match_score: 85,
    profile_tags: [],
    priority_tags: [],
    scores: {
      camera: 80,
      battery: 80,
      performance: 80,
      display: 80
    }
  });

  useEffect(() => {
    if (phoneToEdit) {
      setFormData({
        ...phoneToEdit,
        price: phoneToEdit.price?.toString() || '',
        scores: phoneToEdit.scores || { camera: 0, battery: 0, performance: 0, display: 0 }
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        model: '',
        price: '',
        image_url: '',
        description: '',
        affiliate_link: '',
        match_score: 85,
        profile_tags: [],
        priority_tags: [],
        scores: { camera: 80, battery: 80, performance: 80, display: 80 }
      });
    }
  }, [phoneToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        match_score: parseInt(formData.match_score)
      };
      await onSave(payload, phoneToEdit?.id);
      onClose();
    } catch (err) {
      addToast("Erro ao salvar: " + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (type, tag) => {
    setFormData(prev => {
      const list = [...prev[type]];
      const index = list.indexOf(tag);
      if (index > -1) list.splice(index, 1);
      else list.push(tag);
      return { ...prev, [type]: list };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#1c1b1d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <h2 className="text-xl font-bold text-white">
            {phoneToEdit ? 'Editar Aparelho' : 'Novo Aparelho'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-primary mb-2">Informações Básicas</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Nome Comercial</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: iPhone 15 Pro Max" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Marca</label>
                  <input 
                    required
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                    placeholder="Apple" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Preço (R$)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">URL da Imagem (PNG Transparente ideal)</label>
                <div className="flex gap-4">
                  <input 
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://exemplo.com/imagem.png" 
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-colors"
                  />
                  {formData.image_url && (
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                       <img src={formData.image_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Link de Afiliado</label>
                <input 
                  value={formData.affiliate_link}
                  onChange={e => setFormData({...formData, affiliate_link: e.target.value})}
                  placeholder="https://amzn.to/..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Descrição Curta</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Destaque principal do aparelho..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right Column: Algorithm Stats */}
            <div className="space-y-6">
               <h3 className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">Parâmetros do Algoritmo</h3>
               
               {/* JSONB Scores */}
               <div className="grid grid-cols-2 gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                 {Object.keys(formData.scores).map(key => (
                   <div key={key} className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-500 uppercase">{key}</label>
                     <input 
                       type="number" 
                       min="0" max="100"
                       value={formData.scores[key]}
                       onChange={e => setFormData({
                         ...formData, 
                         scores: { ...formData.scores, [key]: parseInt(e.target.value) }
                       })}
                       className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-secondary transition-colors"
                     />
                   </div>
                 ))}
               </div>

               {/* Profile Tags */}
               <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-400 block">Perfil de Uso (Tags)</label>
                 <div className="flex flex-wrap gap-2">
                   {['power_user', 'photography', 'balanced', 'budget', 'gamer', 'casual'].map(tag => (
                     <button
                       key={tag}
                       type="button"
                       onClick={() => toggleTag('profile_tags', tag)}
                       className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                         formData.profile_tags.includes(tag) 
                          ? 'bg-primary text-black border-primary' 
                          : 'bg-white/5 text-gray-500 border-white/10'
                       }`}
                     >
                       {tag}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Priority Tags */}
               <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-400 block">Prioridades (Tags)</label>
                 <div className="flex flex-wrap gap-2">
                   {['camera', 'performance', 'battery', 'price', 'display'].map(tag => (
                     <button
                       key={tag}
                       type="button"
                       onClick={() => toggleTag('priority_tags', tag)}
                       className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                         formData.priority_tags.includes(tag) 
                          ? 'bg-secondary text-black border-secondary' 
                          : 'bg-white/5 text-gray-500 border-white/10'
                       }`}
                     >
                       {tag}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-4 border-t border-white/5 pt-8">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" className="gap-2 min-w-[140px]" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <><Save size={18} /> {phoneToEdit ? 'Atualizar' : 'Salvar Aparelho'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
