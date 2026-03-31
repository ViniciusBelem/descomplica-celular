import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

/**
 * Universal Layout (Refined)
 * Shell for the entire application, serving pages via <Outlet />
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/20 relative overflow-x-hidden">
      {/* Decorative Blur Orbs */}
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none select-none"></div>
      <div className="fixed top-1/2 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none select-none"></div>
      
      <TopNav />
      <Sidebar />
      <main className="lg:pl-64 pt-16 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
