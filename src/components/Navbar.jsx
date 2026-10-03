import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  ChevronDown,
  Leaf,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { cartCount, currentUser, logout, setSearchQuery, searchQuery } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    navigate("/shop");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Leaf size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent leading-none">
                MAYA_KRISHNAN
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 leading-tight mt-0.5 tracking-wider">
                மாயகிருஷ்ணன்
              </span>
            </div>
          </Link>

          {/* Search bar — hidden on small screens */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search herbs, spices, medicines (e.g. மஞ்சள், சீரகம்)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 transition-all"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Admin link — visible ONLY when logged in as admin */}
            {currentUser?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-sky hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={16} />
                Admin Panel
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors">
              <ShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-orange to-brand-pink text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-soft">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-orange-50 px-3 py-2 rounded-xl transition-colors text-sm font-medium border border-gray-100"
                >
                  <User size={16} className="text-brand-orange" />
                  <span className="hidden sm:block max-w-[90px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-brand-orange to-brand-pink text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <User size={16} />
                  Login
                </Link>
              )}

              {userDropdown && currentUser && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="font-semibold text-sm text-gray-800 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                  </div>
                  {currentUser.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-sky hover:bg-sky-50 transition-colors font-medium"
                    >
                      <LayoutDashboard size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserDropdown(false); navigate("/login"); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-slide-up space-y-2">
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search herbs, spices, medicines…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
              />
            </form>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-xl hover:bg-orange-50 text-sm font-medium text-gray-700"
            >
              Shop Catalogue
            </Link>
            {currentUser?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-sky-50 text-sm font-medium text-brand-sky"
              >
                Admin Panel
              </Link>
            )}
            {!currentUser && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl bg-orange-50 text-brand-orange text-sm font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
