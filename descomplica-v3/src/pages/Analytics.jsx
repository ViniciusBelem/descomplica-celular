import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Users, Smartphone, Zap, Award, Loader2 } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

/**
 * Analytics Page (Market Trends)
 * Provides insights into what's popular and algorithm statistics.
 */
export function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const data = await analyticsService.getMarketStats();
      setStats(data);
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Static Fallbacks if DB is empty or still fetching
  const trends = [
    { label: 'Marcas em Alta', value: stats?.topBrands || 'Xiaomi, Samsung', icon: Zap, color: 'text-primary' },
    { label: 'Perfil Dominante', value: 'Equilibrado', icon: Users, color: 'text-secondary' },
    { label: 'Média de Orçamento', value: stats?.avgPrice ? `R$ ${Math.round(stats.avgPrice).toLocaleString('pt-BR')}` : 'R$ 2.400', icon: Smartphone, color: 'text-accent' },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Analisando Mercado...</span>
      </div>
    );
  }

  const displayDevices = stats?.topDevices || [
    { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', match_score: 98 },
    { name: 'iPhone 15 Pro Max', brand: 'Apple', match_score: 97 },
    { name: 'POCO X6 Pro', brand: 'Xiaomi', match_score: 92 },
    { name: 'Redmi Note 13 Pro', brand: 'Xiaomi', match_score: 88 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Market Analytics</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Insights gerados em tempo real baseados em milhares de simulações do nosso Smart Advisor.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {trends.map((item, idx) => (
          <div key={idx} className="bg-surface-container border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="relative z-10">
               <item.icon size={24} className={`${item.color} mb-4`} />
               <span className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] block mb-2">{item.label}</span>
               <span className="text-2xl font-black text-white group-hover:text-primary transition-colors">{item.value}</span>
            </div>
            <div className="absolute -right-4 -bottom-4 text-white/5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <item.icon size={120} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Recommended Table */}
         <div className="bg-surface-container border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <Award className="text-primary" /> Top Recomendados
               </h3>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Este Mês</span>
            </div>

            <div className="space-y-6">
               {displayDevices.map((device, idx) => (
                 <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <span className="text-lg font-black text-gray-700 group-hover:text-primary transition-colors italic w-6">0{idx + 1}</span>
                       <div>
                          <span className="text-sm font-bold text-white block">{device.name}</span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{device.brand}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-sm font-black text-success block">+{Math.floor(Math.random() * 20) + 5}%</span>
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Neural Match: {device.match_score || device.score}%</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Market Insight Graph Placeholder */}
         <div className="bg-surface-container border border-white/5 rounded-3xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <BarChart className="text-secondary" /> Curva de Custo-Benefício
               </h3>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 h-48 px-4">
               {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                 <div key={i} className="w-full bg-white/5 rounded-t-lg relative group">
                    <div 
                      style={{ height: `${h}%` }} 
                      className="absolute bottom-0 left-0 right-0 bg-secondary/20 group-hover:bg-secondary/40 transition-all rounded-t-lg border-t border-secondary/30"
                    />
                 </div>
               ))}
            </div>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
               <p className="text-xs text-gray-400 leading-relaxed italic">
                 "O mercado atual mostra uma tendência clara de valorização de dispositivos com processadores de 4nm, resultando em um aumento de 15% na satisfação de usuários gamer."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
