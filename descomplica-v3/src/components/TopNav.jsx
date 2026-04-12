import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Moon, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function TopNav() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/5 h-16">
      <div className="flex justify-between items-center px-4 sm:px-8 h-full max-w-full mx-auto">
        <div className="flex items-center gap-8 lg:ml-64">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary lg:hidden">
            Descomplica
          </Link>
          <nav className="hidden md:flex gap-6 font-sans text-sm font-medium">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">{t('nav.discover', 'Home')}</Link>
            <Link to="/phones" className="text-gray-400 hover:text-white transition-colors">{t('nav.specs', 'Catálogo')}</Link>
            <Link to="/library" className="text-gray-400 hover:text-white transition-colors">Biblioteca</Link>
            <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">Insights</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <select 
            value={i18n.language.split('-')[0]} 
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-transparent text-gray-400 hover:text-primary transition-colors border-none outline-none font-sans text-sm tracking-widest cursor-pointer px-2 py-1 uppercase appearance-none font-semibold"
          >
            <option value="pt" className="bg-surface text-gray-200">PT</option>
            <option value="en" className="bg-surface text-gray-200">EN</option>
          </select>
          
          <Link 
            to={user ? "/admin" : "/login"} 
            className="group relative flex items-center justify-center ml-2"
          >
            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-all overflow-hidden shadow-lg">
              {user ? (
                <span className="text-xs font-black text-primary uppercase">
                  {user.email?.charAt(0)}
                </span>
              ) : (
                <User size={20} />
              )}
            </div>
            {user && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-surface shadow-sm">
                <LayoutDashboard size={8} className="text-black font-black" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
