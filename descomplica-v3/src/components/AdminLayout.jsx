import { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Smartphone, LogOut, Loader2 } from 'lucide-react';

/**
 * Admin Secure Layout
 * Protects the nested routes and provides the specific Dashboard Sidebar.
 */
export default function AdminLayout() {
  const { user, isLoading, initialize, signOut } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
    <div className="min-h-screen bg-background text-gray-200 font-sans flex overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-surface/30 backdrop-blur flex flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <Link to="/" className="text-xl font-black text-primary tracking-tighter">Descomplica</Link>
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Smartphone size={20} />
            <span>Catálogo</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-black/20 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
               <span className="text-xs text-primary font-bold">{user.email?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-xs truncate text-gray-400">{user.email}</span>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-error/80 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 bg-black/20 p-8">
         <Outlet />
      </main>
    </div>
  );
}
