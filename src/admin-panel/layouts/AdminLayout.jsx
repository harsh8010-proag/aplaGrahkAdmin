import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar onLogoClick={toggleSidebar} />
      <div className="flex flex-1 relative overflow-hidden">

        {/* Desktop/Tablet Sidebar - always visible on md+ */}
        <div className="hidden md:flex w-[100px] flex-shrink-0 flex-col pl-3 pb-3">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div className={`
          fixed top-0 left-0 h-full w-[100px] z-50 p-3 transition-transform duration-300 ease-in-out md:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onNavigate={closeSidebar} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
