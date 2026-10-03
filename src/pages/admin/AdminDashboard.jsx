import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Gift,
  Star,
  Tag,
  ArrowRight,
  TrendingUp,
  Leaf,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { useStore } from "../../context/StoreContext";
import { getEmojiGradient } from "../../data/mockData";

export default function AdminDashboard() {
  const { items, customers, offers, suggestionGroups, activeSuggestionGroups, publicCategories } = useStore();

  const activeOffers = offers.filter((o) => o.isActive).length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  const stats = [
    {
      title: "Total Items (பொருட்கள்)",
      value: items.length,
      subtitle: `${items.filter((i) => i.stock <= 5).length} குறைவான இருப்பு`,
      icon: Package,
      gradient: "bg-gradient-to-br from-brand-orange to-yellow-400",
      trend: 12,
    },
    {
      title: "Customers (வாடிக்கையாளர்கள்)",
      value: customers.length,
      subtitle: `${customers.filter((c) => c.status === "active").length} செயலில் உள்ளோர்`,
      icon: Users,
      gradient: "bg-gradient-to-br from-brand-sky to-blue-600",
      trend: 8,
    },
    {
      title: "Active Offers (சலுகைகள்)",
      value: activeOffers,
      subtitle: `${offers.length} மொத்த சலுகைகள்`,
      icon: Gift,
      gradient: "bg-gradient-to-br from-brand-pink to-rose-600",
      trend: 25,
    },
    {
      title: "Suggestion Groups (குழுக்கள்)",
      value: suggestionGroups.length,
      subtitle: `${activeSuggestionGroups.length} முகப்பில் நேரலை`,
      icon: Star,
      gradient: "bg-gradient-to-br from-brand-purple to-pink-600",
    },
    {
      title: "Categories (பிரிவுகள்)",
      value: publicCategories.length,
      subtitle: "பொதுப் பிரிவுகள்",
      icon: Tag,
      gradient: "bg-gradient-to-br from-brand-green to-teal-600",
    },
    {
      title: "Total Revenue (வருவாய்)",
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
      subtitle: "வாடிக்கையாளர் வாங்குதல்கள்",
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      trend: 18,
    },
  ];

  // Recent items
  const recentItems = [...items].slice(-5).reverse();

  // Top customers
  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Leaf size={24} className="text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-gray-900">கட்டுப்பாட்டு அறை (Dashboard)</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          மாயகிருஷ்ணன் பாரம்பரிய கடை மேலாண்மை (MAYA_KRISHNAN Administration).
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">சமீபத்திய பொருட்கள் (Recent Items)</h3>
            <Link
              to="/admin/items"
              className="text-sm text-brand-orange hover:text-brand-pink font-semibold flex items-center gap-1 transition-colors"
            >
              அனைத்தும் பார்க்க <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentItems.map((item) => {
              const gradientClass = getEmojiGradient(item.emoji);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <span className="text-xl select-none">{item.emoji || "🌿"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.tamilName}</p>
                    <p className="text-xs text-gray-500">{item.englishName} · ₹{item.price.toLocaleString()} {item.unit ? `(${item.unit})` : ""}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.stock > 10
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.stock > 10 ? "இருப்பு உள்ளது" : "குறைவு"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">முக்கிய வாடிக்கையாளர்கள் (Top Customers)</h3>
            <Link
              to="/admin/customers"
              className="text-sm text-brand-sky hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
            >
              அனைத்தும் பார்க்க <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {topCustomers.map((c, idx) => (
              <Link
                key={c.id}
                to={`/admin/customers/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-bold text-gray-400 w-5">#{idx + 1}</span>
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.totalOrders} ஆர்டர்கள் ({c.address.split(",")[1]?.trim() || "TN"})</p>
                </div>
                <span className="font-extrabold text-sm text-gray-900">
                  ₹{c.totalSpent.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">விரைவுச் செயல்கள் (Quick Actions)</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "புதிய பொருள் சேர் (Add Item)", to: "/admin/items/new", cls: "btn-primary" },
            { label: "பிரிவுகள் மேலாண்மை (Categories)", to: "/admin/categories", cls: "btn-sky" },
            { label: "பரிந்துரை குழுக்கள் (Suggestion Groups)", to: "/admin/suggestions", cls: "bg-gradient-to-r from-brand-purple to-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-0" },
            { label: "வாடிக்கையாளர் சலுகைகள் (Offers)", to: "/admin/offers", cls: "btn-green" },
          ].map((a) => (
            <Link key={a.label} to={a.to} className={a.cls}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
