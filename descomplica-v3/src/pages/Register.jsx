import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, ShieldCheck, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';

/**
 * Register Page
 * Professional user registration for the Descomplica ecosystem.
 */
export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, { role: 'editor' });
      setSuccess(true);
      // Wait a bit then redirect to login
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto min-h-screen flex items-center justify-center">
       <div className="w-full animate-in slide-in-from-top-12 duration-700">
         <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4 border border-primary/20">
               <UserPlus className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl font-black mb-2 text-white tracking-tighter">Criar Conta</h1>
            <p className="text-gray-400 text-sm font-medium">Junte-se ao ecossistema Descomplica Celular</p>
         </div>
         
         {success ? (
            <div className="glass-panel p-10 rounded-3xl text-center border border-success/20 bg-success/5 animate-in zoom-in duration-500">
               <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-4">Verifique seu E-mail</h2>
               <p className="text-gray-400 mb-8 leading-relaxed">
                  Enviamos um link de confirmação para <span className="text-white font-bold">{email}</span>. 
                  Por favor, valide sua conta para acessar o sistema.
               </p>
               <Link to="/login">
                  <Button variant="outline" className="w-full">Ir para Login</Button>
               </Link>
            </div>
         ) : (
            <div className="glass-panel p-8 rounded-3xl bg-surface-container border border-white/5 relative overflow-hidden shadow-2xl">
               {loading && (
                 <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center z-10">
                   <Loader2 className="animate-spin text-primary" size={40} />
                 </div>
               )}
               
               <form onSubmit={handleRegister} className="space-y-5">
                 {error && (
                   <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center animate-in shake duration-300">
                     {error}
                   </div>
                 )}
                 
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail Profissional</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="exemplo@empresa.com" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary transition-all shadow-inner" 
                      />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha</label>
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
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirmar</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                         <input 
                           type="password" 
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           required
                           placeholder="••••••" 
                           className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary transition-all shadow-inner" 
                         />
                      </div>
                    </div>
                 </div>
                 
                 <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-black font-black rounded-xl p-5 hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      CRIAR CONTA PROFISSIONAL
                    </button>
                 </div>
               </form>

               <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-gray-500">Já possui uma conta?</span>
                  <Link to="/login" className="text-xs font-black text-primary hover:text-white transition-colors uppercase tracking-widest">
                    Acessar Portal →
                  </Link>
               </div>
            </div>
         )}
         
         <div className="mt-12 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Sitema Protegido por Supabase & SSL 256-bit
         </div>
       </div>
    </div>
  );
}
