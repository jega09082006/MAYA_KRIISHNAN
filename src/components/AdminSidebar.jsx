import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Star,
  Users,
  Gift,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "கட்டுப்பாட்டு அறை (Dashboard)" },
  { to: "/admin/items", icon: Package, label: "பொருட்கள் (Items)" },
  { to: "/admin/categories", icon: Tag, label: "பிரிவுகள் (Categories)" },
  { to: "/admin/suggestions", icon: Star, label: "பரிந்துரைகள் (Suggestions)" },
  { to: "/admin/customers", icon: Users, label: "வாடிக்கையாளர் (Customers)" },
  { to: "/admin/offers", icon: Gift, label: "சலுகைகள் (Offers)" },
];

export default function AdminSidebar() {
  const { logout } = useStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } flex-shrink-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white min-h-screen flex flex-col transition-all duration-300 border-r border-white/5`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center shadow-md">
          <Leaf size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-extrabold text-sm leading-tight bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent truncate">
              MAYA_KRISHNAN
            </p>
            <p className="text-[10px] font-semibold text-emerald-400">மாயகிருஷ்ணன் Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1.5 mt-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>கடைக்குத் திரும்பு (Store)</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
