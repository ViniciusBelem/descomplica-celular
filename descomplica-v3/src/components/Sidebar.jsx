import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Compass, Bookmark, BarChart2, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 hidden lg:flex flex-col bg-[#1c1b1d] border-r border-white/5 z-40 transition-transform duration-500">
      <div className="p-8 pb-12">
        <h2 className="text-lg font-black text-primary">Descomplica</h2>
        <p className="text-[10px] font-bold uppercase tracking-tighter text-primary">Smart Advisor</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <SidebarLink to="/" icon={Home} label={t('sidebar.home', 'Home')} />
        <SidebarLink to="/phones" icon={Compass} label={t('sidebar.explore', 'Catálogo')} />
        <SidebarLink to="/library" icon={Bookmark} label={t('sidebar.library', 'Library')} />
        <SidebarLink to="/analytics" icon={BarChart2} label={t('sidebar.analytics', 'Analytics')} />
        <SidebarLink to="/settings" icon={Settings} label={t('sidebar.settings', 'Settings')} />
        
        {user && (
          <SidebarLink to="/admin" icon={ShieldCheck} label="Admin" />
        )}
      </nav>

      {user && (
        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={signOut}
            className="flex items-center gap-4 w-full px-4 py-3 text-error/70 hover:bg-error/10 hover:text-error transition-all rounded-md group"
          >
            <LogOut size={20} className="group-hover:text-error transition-colors" />
            <span className="font-sans text-sm font-semibold uppercase tracking-widest">Sair</span>
          </button>
        </div>
      )}
    </aside>
  );
}

// eslint-disable-next-line no-unused-vars
function SidebarLink({ to, icon: Icon, label }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-surface/50 hover:text-gray-200 transition-all rounded-md group"
    >
      <Icon size={20} className="group-hover:text-primary transition-colors" />
      <span className="font-sans text-sm font-semibold uppercase tracking-widest">{label}</span>
    </Link>
  );
}
