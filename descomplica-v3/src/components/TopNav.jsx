import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Moon, Sun, User } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export default function TopNav() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-primary/10 h-16">
      <div className="flex justify-between items-center px-4 sm:px-8 h-full max-w-full mx-auto">
        <div className="flex items-center gap-8 lg:ml-64">
          <Link to="/" className="text-xl font-black tracking-tighter text-primary lg:hidden">
            Descomplica
          </Link>
          <nav className="hidden md:flex gap-6 font-sans text-xs font-black uppercase tracking-widest">
            <a href="#hero" className="text-primary border-b-2 border-primary pb-1 transition-all">{t('nav.discover')}</a>
            <a href="#compare" className="text-text hover:text-primary transition-colors">{t('nav.compare')}</a>
            <a href="#specs" className="text-text hover:text-primary transition-colors">{t('nav.specs')}</a>
            <a href="#advisors" className="text-text hover:text-primary transition-colors">{t('nav.advisors')}</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <select 
            value={i18n.language.split('-')[0]} 
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-transparent text-text-muted hover:text-primary transition-colors border-none outline-none font-sans text-xs tracking-widest cursor-pointer px-2 py-1 uppercase appearance-none font-black"
          >
            <option value="pt" className="bg-surface text-text">PT</option>
            <option value="en" className="bg-surface text-text">EN</option>
          </select>
          <button className="text-text-muted hover:text-primary md:hidden transition-colors"><Menu size={20} /></button>
          <button className="text-text-muted hover:text-primary transition-colors"><Bell size={20} /></button>
          <button 
            onClick={toggleTheme}
            className="text-text-muted hover:text-primary transition-colors hidden sm:block"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="w-10 h-10 rounded-full bg-surface-container border border-primary/10 flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all shadow-sm">
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
