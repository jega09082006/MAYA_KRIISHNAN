import React, { useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { Bell, LogOut, Menu } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function AdminLayout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Redirect to login if user is not logged in as admin
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-lato max-w-full overflow-x-hidden">
      <AdminSidebar
        mobileOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Top bar (Deep Forest Header) */}
        <header className="bg-[#1d3d29] text-cream-100 border-b border-gold/20 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Admin Menu"
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-100 hover:text-gold transition-colors cursor-pointer border border-gold/30 rounded-none bg-forest-600"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-forest-500 p-0.5 border border-gold/40 flex items-center justify-center shrink-0">
                <img src="/photos/logo.png" alt="MAYA_KRISHNAN Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-extrabold text-cream-100 text-xs sm:text-sm font-tamil truncate">
                மாயகிருஷ்ணன் Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-300 hover:text-gold transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-forest-600 px-3 py-1.5 rounded-none border border-gold/30">
              <div className="w-6 h-6 rounded-full bg-gold text-bark-900 flex items-center justify-center text-xs font-extrabold">
                A
              </div>
              <span className="text-xs font-bold text-cream-100 truncate max-w-[100px]">
                {currentUser.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="px-2.5 sm:px-3 py-2 min-h-[44px] text-red-300 hover:bg-danger/20 rounded-none transition-colors flex items-center gap-1.5 text-xs font-bold border border-red-400/30 cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden bg-gray-50 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
