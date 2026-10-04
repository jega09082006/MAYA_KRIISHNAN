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
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { useStore } from "../../context/StoreContext";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, EG_ICON } from "../../utils/images";

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
      trend: 12,
    },
    {
      title: "Customers (வாடிக்கையாளர்கள்)",
      value: customers.length,
      subtitle: `${customers.filter((c) => c.status === "active").length} செயலில் உள்ளோர்`,
      icon: Users,
      trend: 8,
    },
    {
      title: "Active Offers (சலுகைகள்)",
      value: activeOffers,
      subtitle: `${offers.length} மொத்த சலுகைகள்`,
      icon: Gift,
      trend: 25,
    },
    {
      title: "Suggestion Groups (குழுக்கள்)",
      value: suggestionGroups.length,
      subtitle: `${activeSuggestionGroups.length} முகப்பில் நேரலை`,
      icon: Star,
    },
    {
      title: "Categories (பிரிவுகள்)",
      value: publicCategories.length,
      subtitle: "பொதுப் பிரிவுகள்",
      icon: Tag,
    },
    {
      title: "Total Revenue (வருவாய்)",
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
      subtitle: "வாடிக்கையாளர் வாங்குதல்கள்",
      icon: TrendingUp,
      trend: 18,
    },
  ];

  const recentItems = [...items].slice(-5).reverse();

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="space-y-8 text-gray-800 font-lato">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <GoldLotusOrnament size={24} />
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900">
            Admin Dashboard <span className="font-tamil font-extrabold text-xl text-forest-700 ml-2">(கட்டுப்பாட்டு அறை)</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-1 font-lato">
          மாயகிருஷ்ணன் கடை மேலாண்மை (MAYA_KRISHNAN Administration).
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
            <h3 className="font-bold text-gray-900 font-tamil text-sm sm:text-base">சமீபத்திய பொருட்கள் (Recent Items)</h3>
            <Link
              to="/admin/items"
              className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 transition-colors min-h-[44px] px-1"
            >
              அனைத்தும் பார்க்க <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentItems.map((item) => {
              const hasCustomImage = Boolean(item.image || item.imageUrl);
              const imgSrc = getItemImage(item);

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-none hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-none bg-[#faf6ee] border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-0.5">
                    <img
                      src={imgSrc}
                      alt={item.tamilName}
                      onError={(e) => {
                        e.currentTarget.src = EG_ICON;
                      }}
                      className={`w-full h-full ${
                        hasCustomImage ? "object-cover" : "object-contain"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm font-tamil truncate">{item.tamilName}</p>
                    <p className="text-xs text-gray-500 font-lato">{item.englishName} · ₹{item.price.toLocaleString()} {item.unit ? `(${item.unit})` : ""}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.stock > 10
                        ? "bg-forest-100 text-forest-800"
                        : "bg-red-100 text-danger"
                    }`}
                  >
                    {item.stock > 10 ? "இருப்பு" : "குறைவு"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
            <h3 className="font-bold text-gray-900 font-tamil text-sm sm:text-base">முக்கிய வாடிக்கையாளர்கள் (Top Customers)</h3>
            <Link
              to="/admin/customers"
              className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 transition-colors min-h-[44px] px-1"
            >
              அனைத்தும் பார்க்க <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {topCustomers.map((c, idx) => (
              <Link
                key={c.id}
                to={`/admin/customers/${c.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-none hover:bg-gray-100 transition-colors"
              >
                <span className="text-xs font-bold text-gray-400 w-5 font-lato">#{idx + 1}</span>
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate font-lato">{c.name}</p>
                  <p className="text-xs text-gray-500 font-lato">{c.totalOrders} ஆர்டர்கள்</p>
                </div>
                <span className="font-extrabold text-sm text-forest-700 font-catamaran shrink-0">
                  ₹{c.totalSpent.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
        <h3 className="font-bold text-gray-900 mb-4 font-tamil text-base border-b border-gray-200 pb-3">
          விரைவுச் செயல்கள் (Quick Actions)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "புதிய பொருள் சேர் (Add Item)", to: "/admin/items/new", cls: "bg-gold text-bark-900 font-extrabold px-4 py-3 min-h-[44px] flex items-center justify-center rounded-none shadow-green hover:bg-gold-600 transition-all text-xs sm:text-sm text-center" },
            { label: "பொருட்கள் பட்டியல் (Items List)", to: "/admin/items", cls: "bg-forest text-cream-100 font-bold px-4 py-3 min-h-[44px] flex items-center justify-center rounded-none shadow-green hover:bg-forest-700 transition-all text-xs sm:text-sm text-center" },
            { label: "பிரிவுகள் மேலாண்மை (Categories)", to: "/admin/categories", cls: "bg-white text-forest border border-forest font-bold px-4 py-3 min-h-[44px] flex items-center justify-center rounded-none hover:bg-forest hover:text-cream-100 transition-all text-xs sm:text-sm text-center" },
            { label: "பரிந்துரை குழுக்கள் (Suggestions)", to: "/admin/suggestions", cls: "bg-white text-bark-900 border border-bark-200 font-bold px-4 py-3 min-h-[44px] flex items-center justify-center rounded-none hover:bg-gray-100 transition-all text-xs sm:text-sm text-center" },
            { label: "வாடிக்கையாளர் சலுகைகள் (Offers)", to: "/admin/offers", cls: "bg-white text-bark-900 border border-bark-200 font-bold px-4 py-3 min-h-[44px] flex items-center justify-center rounded-none hover:bg-gray-100 transition-all text-xs sm:text-sm text-center" },
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
