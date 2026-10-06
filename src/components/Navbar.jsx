import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useLang } from "../context/LanguageContext";
import { shopInfo } from "../data/shopInfo";
import Logo from "./Logo";
import ShopInfoBar from "./ShopInfoBar";
import LanguageSwitch from "./LanguageSwitch";

export default function Navbar() {
  const { cartCount, currentUser, logout, setSearchQuery, searchQuery } = useStore();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchExpand, setSearchExpand] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setSearchExpand(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Handle Escape key to close drawer/search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setSearchExpand(false);
        setUserDropdown(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearchExpand(false);
    navigate("/shop");
  }

  const navLinks = [
    { to: "/", key: "navHome" },
    { to: "/shop", key: "navShop" },
    { to: "/about", key: "navAbout" },
    { to: "/contact", key: "navContact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav className="bg-[#1d3d29] border-b border-gold/30 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[56px] lg:h-16">
            
            {/* Left: Round Logo 36px on mobile + Shop Name (Single language) */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <Logo className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform duration-200" />
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-cream-100 font-catamaran leading-none truncate max-w-[170px] sm:max-w-none">
                  {lang === "ta" ? shopInfo.nameTamil : shopInfo.nameEnglish}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-gold-300 font-catamaran leading-tight mt-0.5 tracking-wider truncate max-w-[170px] sm:max-w-none">
                  {lang === "ta" ? shopInfo.businessTamil : shopInfo.businessEnglish}
                </span>
              </div>
            </Link>

            {/* Laptop Navigation Links (1024px+) */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-bold font-catamaran text-cream-100">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-gold transition-colors">
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* Laptop Search bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-4"
            >
              <div className="relative w-full">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400"
                />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-none border border-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#faf6ee] text-bark-900 placeholder:text-bark-400 font-medium"
                />
              </div>
            </form>

            {/* Right side icons (Mobile & Desktop) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Language Switch Button */}
              <LanguageSwitch />

              {/* Mobile Search Toggle Icon */}
              <button
                type="button"
                onClick={() => setSearchExpand(!searchExpand)}
                aria-label="Search"
                className="lg:hidden p-2 text-cream-100 hover:text-gold min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                <Search size={20} />
              </button>

              {/* Admin Panel Link (Desktop) */}
              {currentUser?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gold border border-gold hover:bg-gold hover:text-bark-900 px-3 py-1.5 rounded-none transition-colors min-h-[44px]"
                >
                  <LayoutDashboard size={15} />
                  {t("navAdmin")}
                </Link>
              )}

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative p-2 text-cream-100 hover:text-gold transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                title={t("navCart")}
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold text-bark-900 text-xs font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Icon Dropdown (Desktop) */}
              <div className="relative hidden sm:block">
                {currentUser ? (
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 bg-[#2d5a3d] hover:bg-forest-600 px-3 py-1.5 rounded-none border border-gold/30 text-sm font-medium text-cream-100 transition-colors min-h-[44px] cursor-pointer"
                  >
                    <User size={16} className="text-gold" />
                    <span className="max-w-[90px] truncate">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-cream-300" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 bg-gold text-bark-900 hover:bg-gold-600 px-4 py-1.5 rounded-none text-sm font-extrabold shadow-sm transition-all min-h-[44px]"
                  >
                    <User size={16} />
                    {t("navLogin")}
                  </Link>
                )}

                {userDropdown && currentUser && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#faf6ee] rounded-none shadow-green-hover border border-bark-200 py-2 z-50 animate-fade-in text-bark-900">
                    <div className="px-4 py-2 border-b border-bark-200">
                      <p className="font-bold text-sm text-bark-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-bark-500 capitalize">{currentUser.role}</p>
                    </div>
                    {currentUser.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-100 transition-colors font-bold"
                      >
                        <LayoutDashboard size={15} /> {t("adminDashboard")}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors font-bold cursor-pointer"
                    >
                      <LogOut size={15} /> {t("navLogout")}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Drawer Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open Navigation Menu"
                className="lg:hidden p-2 text-cream-100 hover:text-gold transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Full-width Search Bar Expansion Below Navbar (Mobile) */}
          {searchExpand && (
            <div className="lg:hidden py-3 border-t border-gold/20 px-1 bg-[#142e1f]">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400"
                />
                <input
                  type="text"
                  autoFocus
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-none border border-gold/40 text-base bg-[#faf6ee] text-bark-900 placeholder:text-bark-400 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-bark-500 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Slide-in Drawer from Right */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-[290px] sm:w-[320px] max-w-full h-full bg-[#faf6ee] text-bark-900 shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="bg-[#1d3d29] text-cream-100 p-4 flex items-center justify-between border-b border-gold/30">
              <div className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <span className="font-extrabold font-catamaran text-lg text-gold">
                  {lang === "ta" ? shopInfo.nameTamil : shopInfo.nameEnglish}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-cream-100 hover:text-gold min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Language Switch in Drawer */}
            <div className="p-3 bg-[#142e1f] border-b border-gold/20 flex items-center justify-between">
              <span className="text-xs font-bold text-gold-300">
                {lang === "ta" ? "மொழி மாற்றுக" : "Language"}
              </span>
              <LanguageSwitch />
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto divide-y divide-bark-200/60">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-5 h-[52px] hover:bg-forest-100/60 transition-colors"
                >
                  <span className="font-extrabold font-catamaran text-bark-900 text-lg">
                    {t(link.key)}
                  </span>
                </Link>
              ))}

              {currentUser?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-5 h-[52px] bg-gold-100/60 hover:bg-gold-200/60 transition-colors font-extrabold"
                >
                  <span className="font-catamaran text-bark-900 text-base">
                    {t("navAdmin")}
                  </span>
                </Link>
              )}

              {currentUser ? (
                <button
                  onClick={() => {
                    logout();
                    setDrawerOpen(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-between px-5 h-[52px] text-danger hover:bg-red-50 transition-colors cursor-pointer text-left font-extrabold"
                >
                  <span>{t("navLogout")} ({currentUser.name.split(" ")[0]})</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-5 h-[52px] bg-gold text-bark-900 font-extrabold text-lg"
                >
                  <span>{t("navLogin")}</span>
                </Link>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#142e1f] text-cream-100 border-t border-gold/20 text-center space-y-1">
              <p className="font-catamaran text-xs font-bold text-gold-300">
                {lang === "ta" ? shopInfo.businessTamil : shopInfo.businessEnglish}
              </p>
              <a
                href={shopInfo.phoneLink}
                className="text-xs font-mono text-cream-200 hover:text-gold block"
              >
                📞 {shopInfo.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Signboard Strips */}
      <ShopInfoBar />
    </header>
  );
}
