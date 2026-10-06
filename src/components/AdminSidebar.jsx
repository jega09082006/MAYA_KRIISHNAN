import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Tag, Star, Users, Gift,
  LogOut, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useLang } from "../context/LanguageContext";
import { shopInfo } from "../data/shopInfo";

// Each nav item has both language labels; the sidebar picks one based on lang
const NAV_ITEMS = [
  { to: "/admin/dashboard",  icon: LayoutDashboard, labelTa: "கட்டுப்பாட்டு அறை", labelEn: "Dashboard" },
  { to: "/admin/items",      icon: Package,          labelTa: "பொருட்கள்",          labelEn: "Items" },
  { to: "/admin/categories", icon: Tag,              labelTa: "பிரிவுகள்",           labelEn: "Categories" },
  { to: "/admin/suggestions",icon: Star,             labelTa: "பரிந்துரைகள்",        labelEn: "Suggestions" },
  { to: "/admin/customers",  icon: Users,            labelTa: "வாடிக்கையாளர்",       labelEn: "Customers" },
  { to: "/admin/offers",     icon: Gift,             labelTa: "சலுகைகள்",            labelEn: "Offers" },
];

export default function AdminSidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout } = useStore();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const shopName = lang === "ta" ? shopInfo.nameTamil : shopInfo.nameEnglish;

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape" && mobileOpen) onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen, onClose]);

  function handleLogout() { logout(); onClose(); navigate("/"); }

  const showLabel = !collapsed || mobileOpen;

  const sidebarContent = (
    <div className="flex-1 flex flex-col h-full bg-[#1d3d29] text-cream-100 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gold/20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 min-w-[36px] rounded-full bg-forest-500 p-0.5 border border-gold/40 flex items-center justify-center shadow-md overflow-hidden shrink-0">
            <img src="/photos/logo.png" alt={`${shopName} Logo`} className="w-full h-full object-contain rounded-full" />
          </div>
          {showLabel && (
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight text-cream-100 font-catamaran truncate">{shopName}</p>
              <p className="text-[10px] font-bold text-gold-300">Admin</p>
            </div>
          )}
        </div>
        {mobileOpen && (
          <button onClick={onClose} aria-label="Close menu" className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cream-300 hover:text-gold cursor-pointer">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1.5 mt-2 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, labelTa, labelEn }) => {
          const label = lang === "ta" ? labelTa : labelEn;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-none text-sm font-bold transition-all duration-200 min-h-[52px] ${
                  isActive
                    ? "bg-gold text-bark-900 shadow-sm border-l-4 border-cream-100"
                    : "text-cream-200 hover:bg-forest-600 hover:text-gold"
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {showLabel && (
                <span className="font-catamaran text-[15px] font-semibold leading-tight truncate">
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-gold/20 space-y-1.5 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-bold text-cream-300 hover:bg-danger/20 hover:text-red-300 transition-all duration-200 cursor-pointer min-h-[52px]"
        >
          <LogOut size={20} className="shrink-0" />
          {showLabel && (
            <span className="font-catamaran text-[14px] font-semibold leading-tight truncate">
              {lang === "ta" ? "கடைக்குத் திரும்பு" : "Back to Store"}
            </span>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center p-2 min-h-[44px] rounded-none text-cream-400 hover:text-gold hover:bg-forest-600 transition-all duration-200 cursor-pointer"
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
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
          <div className="relative w-[min(86vw,300px)] bg-[#1d3d29] h-full shadow-2xl z-10 flex flex-col max-w-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-[#1d3d29] text-cream-100 min-h-screen border-r border-gold/20 transition-all duration-300 ${
          collapsed ? "w-16" : "w-[280px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
