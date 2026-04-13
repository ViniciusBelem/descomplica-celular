import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Moon, Sun, User } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

/**
 * 💎 Dynamic Glass TopNav
 * Features a professional scroll-reactive transition for high-end aesthetics.
 */
export default function TopNav() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll to trigger glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 w-full z-50 transition-all duration-500 h-16
        ${isScrolled 
          ? 'bg-surface/70 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-black/5' 
          : 'bg-transparent border-b border-transparent'}
      `}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 h-full max-w-full mx-auto">
        <div className="flex items-center gap-8 lg:ml-64">
          <Link to="/" className="text-xl font-black tracking-tighter text-primary lg:hidden">
            Descomplica
          </Link>
          <nav className="hidden md:flex gap-8 font-sans text-[10px] font-black uppercase tracking-[0.2em]">
            <Link to="/" className="text-primary border-b-2 border-primary pb-1 transition-all">{t('nav.discover')}</Link>
            <Link to="/compare" className="text-text-muted hover:text-primary transition-colors">{t('nav.compare')}</Link>
            <Link to="/catalog" className="text-text-muted hover:text-primary transition-colors">{t('nav.specs')}</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Language Selector Custom UI */}
          <div className="relative group">
            <select 
              value={i18n.language.split('-')[0]} 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-surface-container/50 hover:bg-surface-container border border-primary/5 rounded-lg text-text-muted hover:text-primary transition-all font-sans text-[10px] tracking-widest cursor-pointer px-3 py-1.5 uppercase appearance-none font-black outline-none"
            >
              <option value="pt" className="bg-surface text-text font-black">PT</option>
              <option value="en" className="bg-surface text-text font-black">EN</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-primary/10 pl-6">
            <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
              <Bell size={18} />
            </button>
            <button 
              onClick={toggleTheme}
              className="text-text-muted hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5 hidden sm:block"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all shadow-inner group">
              <User size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
          
          <button className="text-text-muted hover:text-primary md:hidden transition-colors p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
