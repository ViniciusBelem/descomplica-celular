import { useState, useEffect } from 'react';
import { phoneService } from '../services/phoneService';
import { Search, Filter, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Phones() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');

  useEffect(() => {
    async function fetchData() {
      const data = await phoneService.getAllPhones();
      setPhones(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPhones = phones.filter(phone => {
    const matchesSearch = phone.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || phone.brand.toLowerCase() === filterBrand.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const uniqueBrands = ['all', ...new Set(phones.map(p => p.brand))];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Catálogo de Dispositivos</h1>
        <p className="text-gray-400 max-w-2xl">
          Explore nossa base de dados completa. Todos os dispositivos são analisados pelo nosso algoritmo para garantir a melhor recomendação.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar modelo ou marca..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-primary transition-colors shadow-lg"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container border border-white/5 rounded-xl px-4 py-2 shadow-lg">
          <Filter className="text-gray-500" size={18} />
          <select 
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-transparent text-gray-300 outline-none cursor-pointer text-sm font-medium pr-4"
          >
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand} className="bg-surface">
                {brand === 'all' ? 'Todas as Marcas' : brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 font-medium">Sincronizando com o banco de dados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhones.map(phone => (
            <Link 
              key={phone.id} 
              to={`/phones/${phone.id}`}
              className="group bg-surface-container border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 hover:bg-white/5 transition-all duration-300 flex flex-col shadow-xl"
            >
              <div className="aspect-square bg-black/40 relative overflow-hidden flex items-center justify-center p-8">
                {phone.image_url ? (
                  <img 
                    src={phone.image_url} 
                    alt={phone.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                    <Search size={32} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {phone.brand}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {phone.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {phone.description || `Um smartphone ${phone.brand} de alto desempenho e qualidade.`}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xl font-black text-white">
                    R$ {phone.price?.toLocaleString('pt-BR')}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-black transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {filteredPhones.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <p className="text-gray-500 text-lg">Nenhum aparelho encontrado com esses filtros.</p>
              <button 
                onClick={() => {setSearchTerm(''); setFilterBrand('all');}}
                className="text-primary font-bold mt-4 hover:underline"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
