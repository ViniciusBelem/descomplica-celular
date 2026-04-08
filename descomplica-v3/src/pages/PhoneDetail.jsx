import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { phoneService } from '../services/phoneService';
import { ArrowLeft, Star, Battery, Cpu, Camera, ShoppingCart, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function PhoneDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await phoneService.getPhoneById(id);
      if (data) {
        setPhone(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Aparelho não encontrado</h2>
        <Button onClick={() => navigate('/phones')}>Voltar ao Catálogo</Button>
      </div>
    );
  }

  const handleBuyClick = () => {
    if (phone.affiliate_link) {
      window.open(phone.affiliate_link, '_blank', 'noopener,noreferrer');
    } else {
      alert("Link de oferta não disponível no momento.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <Link to="/phones" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Voltar ao Catálogo</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Card */}
        <div className="bg-surface-container border border-white/5 rounded-3xl p-8 md:p-12 sticky top-24 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 italic select-none">
            {phone.brand}
          </div>
          
          <div className="relative z-10 aspect-[4/5] flex items-center justify-center">
            {phone.image_url ? (
              <img 
                src={phone.image_url} 
                alt={phone.name} 
                className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <Star size={120} className="text-white/5" />
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                {phone.brand}
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20 flex items-center gap-1">
                <ShieldCheck size={10} /> Original
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-tight">
              {phone.name}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {phone.description || `O ${phone.name} foi projetado para oferecer a melhor experiência tecnológica em sua categoria.`}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
               <Cpu className="text-primary mb-2" size={20} />
               <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Performance</span>
               <span className="text-lg font-black text-white">{phone.scores?.performance || 80}%</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
               <Battery className="text-secondary mb-2" size={20} />
               <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Bateria</span>
               <span className="text-lg font-black text-white">{phone.scores?.battery || 85}%</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
               <Camera className="text-accent mb-2" size={20} />
               <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Câmeras</span>
               <span className="text-lg font-black text-white">{phone.scores?.camera || 75}%</span>
            </div>
          </div>

          <div className="p-8 bg-surface-container border border-white/5 rounded-3xl relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
             
             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Melhor Preço</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter">
                      R$ {phone.price?.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-success font-bold">À vista</span>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="gap-3 shadow-2xl shadow-primary/40"
                  onClick={handleBuyClick}
                >
                  <ShoppingCart size={20} /> Comprar Agora
                </Button>
             </div>
          </div>

          <div className="pt-8 border-t border-white/5">
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Por que escolher este modelo?</h3>
             <ul className="space-y-4">
                {(phone.priority_tags || ['Alta Performance', 'Custo Benefício', 'Qualidade Premium']).map((tag, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{tag}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
