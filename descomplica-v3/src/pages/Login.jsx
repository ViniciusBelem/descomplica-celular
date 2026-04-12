import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

/**
 * Login Page
 * Gateway to the Admin Panel
 */
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Determine where the user was trying to go, or default to admin
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto min-h-screen flex items-center justify-center">
       <div className="w-full animate-in slide-in-from-bottom-12 duration-700">
         <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4 border border-primary/20">
               <ShieldCheck className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl font-black mb-2 text-white tracking-tighter">Portal de Acesso</h1>
            <p className="text-gray-400 text-sm font-medium">Bem-vindo à área administrativa do Descomplica</p>
         </div>
         
         <div className="glass-panel p-8 rounded-3xl bg-surface-container border border-white/5 relative overflow-hidden shadow-2xl">
            {loading && (
              <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center animate-in shake duration-300">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     placeholder="adm@descomplica.com" 
                     className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary transition-all shadow-inner" 
                   />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     placeholder="••••••" 
                     className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary transition-all shadow-inner" 
                   />
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-black font-black rounded-xl p-5 hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  AUTENTICAR NO SISTEMA
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
               <span className="text-xs text-gray-500">Novo na plataforma?</span>
               <Link to="/register" className="text-xs font-black text-primary hover:text-white transition-colors uppercase tracking-widest">
                 Criar Conta Profissional →
               </Link>
            </div>
         </div>
         
         <div className="mt-12 text-center">
           <Link to="/" className="text-[10px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-[0.3em]">
             ← Retornar à Tela Inicial
           </Link>
         </div>
       </div>
    </div>
  );
}
