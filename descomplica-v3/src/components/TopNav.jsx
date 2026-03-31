import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Moon, User } from 'lucide-react';

export default function TopNav() {
  const { t, i18n } = useTranslation();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/5 h-16">
      <div className="flex justify-between items-center px-4 sm:px-8 h-full max-w-full mx-auto">
        <div className="flex items-center gap-8 lg:ml-64">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary lg:hidden">
            Descomplica
          </Link>
          <nav className="hidden md:flex gap-6 font-sans text-sm font-medium">
            <a href="#hero" className="text-primary border-b-2 border-primary pb-1">{t('nav.discover')}</a>
            <a href="#compare" className="text-gray-400 hover:text-white transition-colors">{t('nav.compare')}</a>
            <a href="#specs" className="text-gray-400 hover:text-white transition-colors">{t('nav.specs')}</a>
            <a href="#advisors" className="text-gray-400 hover:text-white transition-colors">{t('nav.advisors')}</a>
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
          <button className="text-gray-400 hover:text-primary md:hidden"><Menu size={24} /></button>
          <button className="text-gray-400 hover:text-primary"><Bell size={24} /></button>
          <button className="text-gray-400 hover:text-primary hidden sm:block"><Moon size={24} /></button>
          <Link to="/login" className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-gray-400 hover:border-primary transition-colors">
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
