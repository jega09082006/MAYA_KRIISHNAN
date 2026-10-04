import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Star,
  Users,
  Gift,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
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

export default function AdminSidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout } = useStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    onClose();
    navigate("/");
  }

  const sidebarContent = (
    <div className="flex-1 flex flex-col h-full bg-[#1d3d29] text-cream-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 min-w-[36px] rounded-full bg-forest-500 p-0.5 border border-gold/40 flex items-center justify-center shadow-md overflow-hidden shrink-0">
            <img src="/photos/logo.png" alt="MAYA_KRISHNAN Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="overflow-hidden">
              <p className="font-extrabold text-sm leading-tight text-cream-100 font-tamil truncate">
                மாயகிருஷ்ணன்
              </p>
              <p className="text-[10px] font-bold text-gold-300 font-lato">MAYA_KRISHNAN Admin</p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-300 hover:text-gold cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-2 mt-2 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-none text-sm font-bold font-lato transition-all duration-200 min-h-[48px] ${
                isActive
                  ? "bg-gold text-bark-900 shadow-sm border-l-4 border-cream-100"
                  : "text-cream-200 hover:bg-forest-600 hover:text-gold"
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-gold/20 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-none text-sm font-bold text-cream-300 hover:bg-danger/20 hover:text-red-300 transition-all duration-200 cursor-pointer font-lato min-h-[48px]"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(!collapsed || mobileOpen) && <span>கடைக்குத் திரும்பு (Store)</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-full items-center justify-center p-2 min-h-[44px] rounded-none text-cream-400 hover:text-gold hover:bg-forest-600 transition-all duration-200 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Off-Canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer */}
          <div className="relative w-4/5 max-w-xs bg-[#1d3d29] h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-[#1d3d29] text-cream-100 min-h-screen border-r border-gold/20 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
