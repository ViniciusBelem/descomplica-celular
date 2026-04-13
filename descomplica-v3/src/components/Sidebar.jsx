import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Settings, LayoutGrid, Library, ArrowLeftRight } from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 hidden lg:flex flex-col bg-surface border-r border-primary/10 z-40 transition-transform duration-500">
      <div className="p-8 pb-12">
        <h2 className="text-xl font-black text-primary tracking-tighter">Descomplica</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Smart Advisor</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <SidebarLink 
          to="/" 
          icon={Home} 
          label={t('sidebar.home', 'Início')} 
          active={isActive('/')}
        />
        <SidebarLink 
          to="/catalog" 
          icon={LayoutGrid} 
          label={t('sidebar.catalog', 'Catálogo')} 
          active={isActive('/catalog')}
        />
        <SidebarLink 
          to="/compare" 
          icon={ArrowLeftRight} 
          label={t('sidebar.compare', 'Comparar')} 
          active={isActive('/compare')}
        />
        <SidebarLink 
          to="/library" 
          icon={Library} 
          label={t('sidebar.library', 'Biblioteca')} 
          active={isActive('/library')}
        />
      </nav>

      <div className="p-4 border-t border-primary/5">
        <SidebarLink 
          to="/admin/settings" 
          icon={Settings} 
          label={t('admin.settings', 'Configurações')} 
          active={isActive('/admin/settings')}
        />
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon: Icon, label, active }) {
  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-4 px-4 py-3 transition-all rounded-xl group
        ${active 
          ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.1)]' 
          : 'text-text-muted hover:bg-primary/5 hover:text-primary'}
      `}
    >
      <Icon size={20} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className={`font-sans text-[10px] font-black uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {label}
      </span>
    </Link>
  );
}
