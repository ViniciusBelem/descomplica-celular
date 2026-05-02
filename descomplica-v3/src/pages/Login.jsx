import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Login Page
 * Gateway to the Admin Panel
 */
export function Login() {
  const { t } = useTranslation();
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
            <h1 className="text-3xl font-black mb-2 text-primary">{t('login.title', 'Acesso Restrito')}</h1>
            <p className="text-text-muted text-sm font-bold uppercase tracking-widest">{t('login.subtitle', 'Credenciais de Administrador')}</p>
         </div>
         
         <div className="glass-panel p-8 rounded-3xl bg-surface border border-primary/10 relative overflow-hidden shadow-2xl">
            {loading && (
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center font-bold">
                  {error}
                </div>
              )}
              
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder={t('login.email', 'E-mail')} 
                  className="w-full bg-surface-container border border-primary/10 rounded-lg p-4 text-text outline-none focus:border-primary transition-all font-bold" 
                />
              </div>
              
              <div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder={t('login.password', 'Senha')} 
                  className="w-full bg-surface-container border border-primary/10 rounded-lg p-4 text-text outline-none focus:border-primary transition-all font-bold" 
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black rounded-lg p-4 mt-6 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 tracking-widest uppercase"
              >
                {t('login.btn', 'AUTENTICAR')}
              </button>
            </form>
         </div>
         
         <div className="mt-8 text-center hidden md:block">
           <Link to="/" className="text-sm text-text-muted font-bold hover:text-primary transition-colors">← {t('admin.backHome', 'Voltar ao Site')}</Link>
         </div>
       </div>
    </div>
  );
}
