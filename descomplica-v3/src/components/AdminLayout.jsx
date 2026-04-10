import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { LayoutDashboard, LogOut, Loader2, Menu, X, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Admin Secure Layout
 * Protects the nested routes and provides the specific Dashboard Sidebar.
 * Now fully responsive for mobile devices and supports Theme Switching.
 */
export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, isLoading, initialize, signOut } = useAuthStore();
  const { applyTheme, theme, palette } = useThemeStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    applyTheme();
  }, [theme, palette, applyTheme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Se não estiver logado, joga para a tela de Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-text font-sans flex overflow-hidden transition-colors duration-300">
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface/80 backdrop-blur border-b border-primary/10 z-40 flex items-center justify-between p-4">
        <Link to="/" className="text-lg font-black text-primary tracking-tighter">Descomplica</Link>
        <button 
          className="text-text hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 border-r border-primary/10 bg-surface/90 md:bg-surface/30 backdrop-blur flex flex-col shrink-0 z-50
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <Link to="/" className="text-xl font-black text-primary tracking-tighter">Descomplica</Link>
            <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mt-1">{t('admin.panel', 'Admin Panel')}</p>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="md:hidden text-text-muted hover:text-text"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl font-bold transition-all mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>{t('admin.backHome', 'Voltar ao Site')}</span>
          </Link>

          <Link 
            to="/admin" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-primary hover:bg-primary/5'}`}
          >
            <LayoutDashboard size={20} />
            <span>{t('admin.dashboard', 'Dashboard')}</span>
          </Link>

          <Link 
            to="/admin/settings" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === '/admin/settings' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-primary hover:bg-primary/5'}`}
          >
            <SettingsIcon size={20} />
            <span>{t('admin.settings', 'Configurações')}</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-primary/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-surface-container overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
               <span className="text-xs text-primary font-black">{user.email?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-xs truncate text-text-muted font-medium">{user.email}</span>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-error/80 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <LogOut size={16} /> {t('admin.logout', 'Sair')}
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 p-4 md:p-8 pt-20 md:pt-8 w-full">
         <Outlet />
      </main>
    </div>
  );
}
