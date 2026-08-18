import { useEffect, useState, useRef, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function InnerLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#FF8303] animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full bg-[#041A40]/10 animate-ping"></div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <p className="text-sm font-bold text-[#041A40]">Preparing Page</p>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider animate-pulse">Loading modules...</span>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Close on Escape for accessibility
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="h-dvh flex flex-col bg-white overflow-hidden">
      <Navbar onLogoClick={toggleSidebar} />
      <div className="flex flex-1 relative overflow-hidden">

        {/* Desktop/Tablet Sidebar - always visible on md+ */}
        <div className="hidden md:flex w-[88px] lg:w-[100px] flex-shrink-0 flex-col pl-2 lg:pl-3 pb-3">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`
            fixed top-0 left-0 h-full w-[84px] sm:w-[100px] z-50 p-3 bg-white shadow-xl
            transition-transform duration-300 ease-in-out md:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          role="dialog"
          aria-modal="true"
        >
          <Sidebar onNavigate={closeSidebar} />
        </div>

        {/* Main Content Area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <Suspense fallback={<InnerLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}