import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}