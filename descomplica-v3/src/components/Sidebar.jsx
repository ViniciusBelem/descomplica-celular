import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Settings } from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 hidden lg:flex flex-col bg-surface border-r border-primary/10 z-40 transition-transform duration-500">
      <div className="p-8 pb-12">
        <h2 className="text-xl font-black text-primary tracking-tighter">Descomplica</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Smart Advisor</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <SidebarLink to="/" icon={Home} label={t('sidebar.home', 'Home')} />
        <SidebarLink to="/admin/settings" icon={Settings} label={t('admin.settings', 'Settings')} />
      </nav>
    </aside>
  );
}

// eslint-disable-next-line no-unused-vars
function SidebarLink({ to, icon: Icon, label }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-4 px-4 py-3 text-text-muted hover:bg-primary/5 hover:text-primary transition-all rounded-xl group"
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="font-sans text-xs font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}
