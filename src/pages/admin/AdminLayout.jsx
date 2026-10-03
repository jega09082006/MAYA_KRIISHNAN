import React from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { Bell, Sparkles, LogOut } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function AdminLayout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  // Redirect to login if user is not logged in as admin
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-orange" />
            <span className="font-bold text-gray-700 text-sm">
              MAYA_KRISHNAN Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-pink-50 px-3 py-1.5 rounded-xl border border-orange-100">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {currentUser.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
