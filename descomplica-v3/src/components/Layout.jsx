import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabase';
import { useThemeStore } from '../store/useThemeStore';

/**
 * Universal Layout (Refined)
 * Shell for the entire application, serving pages via <Outlet />
 */
export default function Layout() {
  const { applyTheme, theme, palette } = useThemeStore();

  useEffect(() => {
    applyTheme();
  }, [theme, palette, applyTheme]);

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/20 relative overflow-x-hidden transition-colors duration-300">
      {!supabase && (
        <div className="fixed top-0 left-0 w-full bg-warning/20 border-b border-warning/30 text-warning text-xs md:text-sm font-bold text-center py-2 z-[60] flex items-center justify-center gap-2">
          <AlertTriangle size={16} /> 
          Modo Demo Ativo: Supabase não conectado. Os resultados exibidos são dados simulados (Mock).
        </div>
      )}
      
      {/* Decorative Blur Orbs */}
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none select-none"></div>
      <div className="fixed top-1/2 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none select-none"></div>
      
      <div className={!supabase ? "pt-8" : ""}>
        <TopNav />
        <Sidebar />
        <main className="lg:pl-64 pt-16 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
