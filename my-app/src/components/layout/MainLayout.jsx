import React, { useState } from 'react';
import Asidebar from './Asidebar';
import { FaBars } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggle = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex">
      <Asidebar isOpen={sidebarOpen} onLogout={handleLogout} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Toggle button */}
        <div className="p-4 bg-white shadow-md sticky top-0 z-40 flex items-center">
          <button onClick={handleToggle} className="text-gray-700 text-xl focus:outline-none">
            <FaBars />
          </button>
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
        </div>

        <main className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;