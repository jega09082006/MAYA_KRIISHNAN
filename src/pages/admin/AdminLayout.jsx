import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { LogOut, Menu } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { shopInfo } from "../../data/shopInfo";
import LanguageSwitch from "../../components/LanguageSwitch";

export default function AdminLayout() {
  const { currentUser, logout } = useStore();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const shopName = lang === "ta" ? shopInfo.nameTamil : shopInfo.nameEnglish;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-lato max-w-full overflow-x-hidden">
      <AdminSidebar
        mobileOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Top bar */}
        <header className="bg-[#1d3d29] text-cream-100 border-b border-gold/20 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Admin Menu"
              className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-100 hover:text-gold transition-colors cursor-pointer border border-gold/30 rounded-none bg-forest-600 shrink-0"
            >
              <Menu size={20} />
            </button>

            {/* Mobile: small logo + shop name */}
            <div className="flex lg:hidden items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-forest-500 p-0.5 border border-gold/40 flex items-center justify-center shrink-0">
                <img src="/photos/logo.png" alt={`${shopName} Logo`} className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-extrabold text-cream-100 text-xs sm:text-sm font-catamaran min-w-0 truncate">
                {shopName} Admin
              </span>
            </div>
          </div>

          {/* Right: Language Switch + User chip + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch — visible on every admin page */}
            <LanguageSwitch />

            {/* Admin user chip */}
            <div
              title={currentUser.name}
              className="flex items-center gap-2 bg-forest-600 px-2 sm:px-3 py-1.5 rounded-none border border-gold/30 min-h-[44px]"
            >
              <div className="w-6 h-6 rounded-full bg-gold text-bark-900 flex items-center justify-center text-xs font-extrabold shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-cream-100 truncate max-w-[160px]">
                {currentUser.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="w-[44px] h-[44px] sm:w-auto sm:h-auto px-0 sm:px-3 py-2 text-red-300 hover:bg-danger/20 rounded-none transition-colors flex items-center justify-center gap-1.5 text-xs font-bold border border-red-400/30 cursor-pointer"
            >
              <LogOut size={16} />
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
