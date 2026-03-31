import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

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
    <div className="p-8 max-w-md mx-auto min-h-screen flex items-center justify-center">
       <div className="w-full animate-in slide-in-from-bottom-8 duration-500">
         <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2 text-primary">Acesso Restrito</h1>
            <p className="text-gray-400 text-sm">Credenciais de Administrador necessárias</p>
         </div>
         
         <div className="glass-panel p-8 rounded-3xl bg-surface-container border border-white/5 relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-surface-container/80 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center">
                  {error}
                </div>
              )}
              
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Administrador (E-mail)" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" 
                />
              </div>
              
              <div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Senha" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" 
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-black font-bold rounded-lg p-4 mt-6 hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
              >
                AUTENTICAR
              </button>
            </form>
         </div>
         
         <div className="mt-8 text-center hidden md:block">
           <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Voltar à Tela Inicial</Link>
         </div>
       </div>
    </div>
  );
}
