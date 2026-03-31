import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

// Default empty state for the form
const initialState = {
  name: '',
  brand: '',
  price: '',
  match_score: '',
  camera_score: '',
  battery_score: '',
  performance_score: '',
  image_url: '',
  affiliate_link: '',
  profile_tags: '',
  priority_tags: ''
};

export function PhoneModal({ isOpen, onClose, onSave, phoneToEdit = null }) {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (isOpen) {
      if (phoneToEdit) {
        setFormData({
          name: phoneToEdit.name || '',
          brand: phoneToEdit.brand || '',
          price: phoneToEdit.price?.toString() || '',
          match_score: phoneToEdit.match_score?.toString() || '',
          camera_score: phoneToEdit.scores?.camera?.toString() || phoneToEdit.camera_score?.toString() || '',
          battery_score: phoneToEdit.scores?.battery?.toString() || phoneToEdit.battery_score?.toString() || '',
          performance_score: phoneToEdit.scores?.performance?.toString() || phoneToEdit.performance_score?.toString() || '',
          image_url: phoneToEdit.image_url || '',
          affiliate_link: phoneToEdit.affiliate_link || '',
          profile_tags: (phoneToEdit.profile_tags || []).join(', '),
          priority_tags: (phoneToEdit.priority_tags || []).join(', ')
        });
      } else {
        setFormData(initialState);
      }
      setError(null);
    }
  }, [isOpen, phoneToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate empty numerical fields before saving
      const requiredNumbers = ['price', 'match_score', 'camera_score', 'battery_score', 'performance_score'];
      for (const key of requiredNumbers) {
         if (formData[key] === '' || isNaN(formData[key])) {
            throw new Error(`O campo numérico "${key}" é obrigatório e precisa ser um número válido.`);
         }
      }

      // Format payload for EXACT Supabase Schema
      // Relational fields + JSONB conversions
      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.name.trim(), // Fallback model to name as it is NOT NULL in the schema
        price: parseFloat(formData.price),
        image_url: formData.image_url.trim() || null,
        affiliate_link: formData.affiliate_link.trim() || null, // Returned to the payload!
        description: "",
        match_score: parseInt(formData.match_score, 10),
        
        // Tags are arrays of texts
        profile_tags: formData.profile_tags.split(',').map(t => t.trim()).filter(Boolean),
        priority_tags: formData.priority_tags.split(',').map(t => t.trim()).filter(Boolean),

        // Deep JSONB
        scores: {
          camera: parseInt(formData.camera_score, 10),
          battery: parseInt(formData.battery_score, 10),
          performance: parseInt(formData.performance_score, 10),
          display: 50 // Default
        }
      };

      await onSave(payload, phoneToEdit?.id); // Trigger parent save function
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || 'Erro ao preparar dados do celular. Verifique os formatos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={!loading ? onClose : undefined} />
      
      {/* Modal Content */}
      <div className="relative bg-surface border border-white/10 rounded-2xl w-full max-w-4xl max-h-full flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 rounded-t-2xl shrink-0">
          <div>
             <h2 className="text-2xl font-black text-white">{phoneToEdit ? 'Editar Celular' : 'Novo Celular'}</h2>
             <p className="text-gray-400 text-sm mt-1">Preencha todos os dados para alimentar o Algoritmo.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" disabled={loading}>
             <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-4 mb-6 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}
          
          <form id="phone-form" onSubmit={handleSubmit} className="space-y-8">
             
             {/* Section 1: Identifier */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Modelo</label>
                   <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Galaxy S24 Ultra" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Marca</label>
                   <input required type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Ex: Samsung" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" />
                </div>
             </div>

             {/* Section 2: Numbers */}
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="col-span-2 md:col-span-1 border-r border-white/5 pr-4">
                   <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Preço (R$)</label>
                   <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="3500.00" className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors font-mono" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Geral (x/100)</label>
                   <input required type="number" name="match_score" value={formData.match_score} onChange={handleChange} placeholder="95" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white transition-colors font-mono text-center" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Câmera</label>
                   <input required type="number" name="camera_score" value={formData.camera_score} onChange={handleChange} placeholder="9.5" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white transition-colors font-mono text-center" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bateria</label>
                   <input required type="number" name="battery_score" value={formData.battery_score} onChange={handleChange} placeholder="9.0" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white transition-colors font-mono text-center" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Perform.</label>
                   <input required type="number" name="performance_score" value={formData.performance_score} onChange={handleChange} placeholder="9.8" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white transition-colors font-mono text-center" />
                </div>
             </div>

             {/* Section 3: Arrays (Tags) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-black/20 border border-white/5">
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Profile Tags</label>
                   <p className="text-[10px] text-gray-400 mb-3">Separadas por vírgula (ex: gamer, battery, camera)</p>
                   <input type="text" name="profile_tags" value={formData.profile_tags} onChange={handleChange} placeholder="gamer, battery" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors font-mono text-sm" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Priority Tags</label>
                   <p className="text-[10px] text-gray-400 mb-3">Separadas por vírgula (ex: gaming_performance, long_battery)</p>
                   <input type="text" name="priority_tags" value={formData.priority_tags} onChange={handleChange} placeholder="camera_quality, software_updates" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors font-mono text-sm" />
                </div>
             </div>

             {/* Section 4: URLs */}
             <div className="grid grid-cols-1 gap-6">
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">URL da Imagem</label>
                   <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors text-sm" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Link Afiliado de Venda</label>
                   <input type="url" name="affiliate_link" value={formData.affiliate_link} onChange={handleChange} placeholder="https://amazon.com.br/..." className="w-full bg-secondary/5 border border-secondary/20 rounded-lg p-3 text-white outline-none focus:border-secondary transition-colors text-sm" />
                </div>
             </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/5 rounded-b-2xl shrink-0 flex items-center justify-end gap-4">
           <Button variant="outline" onClick={onClose} disabled={loading}>
             Cancelar
           </Button>
           <Button type="submit" form="phone-form" variant="primary" className="min-w-[120px]" disabled={loading}>
             {loading ? <Loader2 className="animate-spin" size={20} /> : "Salvar Aparelho"}
           </Button>
        </div>
      </div>
    </div>
  );
}
