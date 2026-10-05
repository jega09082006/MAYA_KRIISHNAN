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
import { shopInfo } from "../../data/shopInfo";

export default function AdminDashboard() {
  const { items, customers, offers, suggestionGroups, publicCategories } = useStore();

  const LOW_STOCK_LIMIT = 10;
  const lowStockCount = items.filter((i) => i.stock <= LOW_STOCK_LIMIT).length;
  const activeCustomersCount = customers.filter((c) => c.status === "active").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const activeOffersCount = offers.filter(
    (o) =>
      o.isActive &&
      (!o.startDate || o.startDate <= todayStr) &&
      (!o.endDate || o.endDate >= todayStr)
  ).length;

  const activeGroupsCount = suggestionGroups.filter((g) => g.isActive).length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const stats = [
    {
      titleEnglish: "TOTAL ITEMS",
      titleTamil: "பொருட்கள்",
      value: items.length,
      subtitleTamil: `${lowStockCount} குறைவான இருப்பு`,
      subtitleEnglish: `${lowStockCount} low stock`,
      icon: Package,
    },
    {
      titleEnglish: "CUSTOMERS",
      titleTamil: "வாடிக்கையாளர்கள்",
      value: customers.length,
      subtitleTamil: `${activeCustomersCount} செயலில் உள்ளோர்`,
      subtitleEnglish: `${activeCustomersCount} active`,
      icon: Users,
    },
    {
      titleEnglish: "ACTIVE OFFERS",
      titleTamil: "சலுகைகள்",
      value: activeOffersCount,
      subtitleTamil: `${offers.length} சலுகைகளில்`,
      subtitleEnglish: `of ${offers.length} offers`,
      icon: Gift,
    },
    {
      titleEnglish: "SUGGESTION GROUPS",
      titleTamil: "குழுக்கள்",
      value: suggestionGroups.length,
      subtitleTamil: `${activeGroupsCount} முகப்பில் நேரலை`,
      subtitleEnglish: `${activeGroupsCount} live on home page`,
      icon: Star,
    },
    {
      titleEnglish: "CATEGORIES",
      titleTamil: "பிரிவுகள்",
      value: publicCategories.length,
      subtitleTamil: "பொதுப் பிரிவுகள்",
      subtitleEnglish: "PUBLIC categories",
      icon: Tag,
    },
    {
      titleEnglish: "TOTAL REVENUE",
      titleTamil: "வருவாய்",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      subtitleTamil: "வாடிக்கையாளர் ஆர்டர்கள்",
      subtitleEnglish: "from customer orders",
      icon: TrendingUp,
    },
  ];

  const recentItems = [...items].slice(-5).reverse();

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 text-gray-800 font-lato">
      {/* Header / Page Title Block */}
      <div className="space-y-1">
        <div className="flex items-baseline flex-wrap gap-2">
          <GoldLotusOrnament size={24} className="self-center shrink-0" />
          <h1 className="text-[24px] sm:text-[30px] font-bold font-playfair text-gray-900 leading-tight">
            Admin Dashboard
          </h1>
          <span className="font-catamaran font-bold text-[16px] text-forest-700 leading-tight">
            ({shopInfo.nameTamil} கட்டுப்பாட்டு அறை)
          </span>
        </div>
        <p className="text-gray-500 text-[14px] mt-1 font-lato leading-normal [overflow-wrap:anywhere]">
          {shopInfo.nameTamil} கடை மேலாண்மை ({shopInfo.nameEnglish} Administration).
        </p>
      </div>

      {/* Stat Cards Grid: 2 columns from 340px, 1 column below 340px, 3 columns from 1024px */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-3 gap-[12px] lg:gap-[20px]">
        {stats.map((s) => (
          <StatCard key={s.titleEnglish} {...s} />
        ))}
      </div>

      {/* Dashboard Panels (Sit side by side only from 1280px / xl) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4 border-b border-gray-200 pb-3">
            <div className="min-w-0">
              <h3 className="font-extrabold text-gray-900 font-catamaran text-[18px] leading-snug">
                சமீபத்திய பொருட்கள்
              </h3>
              <p className="text-xs text-gray-500 font-lato leading-snug">
                Recent Items
              </p>
            </div>
            <Link
              to="/admin/items"
              className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 transition-colors min-h-[44px] px-1 whitespace-nowrap shrink-0"
            >
              <span>அனைத்தும் பார்க்க</span> / <span>View all</span> <ArrowRight size={14} />
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
                  <div className="w-12 h-12 rounded-none bg-[#faf6ee] border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
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
                    <p className="font-bold text-gray-900 text-sm font-catamaran leading-tight min-w-0 [overflow-wrap:anywhere]">
                      {item.tamilName}
                    </p>
                    <p className="text-xs text-gray-500 font-lato leading-snug min-w-0 [overflow-wrap:anywhere]">
                      {item.englishName} · ₹{item.price.toLocaleString("en-IN")} {item.unit ? `(${item.unit})` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-auto ${
                      item.stock > LOW_STOCK_LIMIT
                        ? "bg-forest-100 text-forest-800"
                        : "bg-red-100 text-danger"
                    }`}
                  >
                    {item.stock > LOW_STOCK_LIMIT ? "இருப்பு" : "குறைவு"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4 border-b border-gray-200 pb-3">
            <div className="min-w-0">
              <h3 className="font-extrabold text-gray-900 font-catamaran text-[18px] leading-snug">
                முக்கிய வாடிக்கையாளர்கள்
              </h3>
              <p className="text-xs text-gray-500 font-lato leading-snug">
                Top Customers
              </p>
            </div>
            <Link
              to="/admin/customers"
              className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 transition-colors min-h-[44px] px-1 whitespace-nowrap shrink-0"
            >
              <span>அனைத்தும் பார்க்க</span> / <span>View all</span> <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {topCustomers.map((c, idx) => (
              <Link
                key={c.id}
                to={`/admin/customers/${c.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-none hover:bg-gray-100 transition-colors"
              >
                <span className="text-xs font-bold text-gray-400 w-5 font-lato shrink-0">#{idx + 1}</span>
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=2d5a3d&color=fff&size=40`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm font-lato min-w-0 [overflow-wrap:anywhere]">
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-500 font-lato">{c.totalOrders} ஆர்டர்கள்</p>
                </div>
                <span className="font-extrabold text-sm text-forest-700 font-catamaran shrink-0 ml-auto">
                  ₹{c.totalSpent.toLocaleString("en-IN")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
        <div className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="font-extrabold text-gray-900 font-catamaran text-[18px]">
            விரைவுச் செயல்கள்
          </h3>
          <p className="text-xs text-gray-500 font-lato">Quick Actions</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { labelTamil: "புதிய பொருள் சேர்", labelEnglish: "Add Item", to: "/admin/items/new", cls: "bg-gold text-bark-900 font-extrabold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none shadow-green hover:bg-gold-600 transition-all text-center" },
            { labelTamil: "பொருட்கள் பட்டியல்", labelEnglish: "Items List", to: "/admin/items", cls: "bg-forest text-cream-100 font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none shadow-green hover:bg-forest-700 transition-all text-center" },
            { labelTamil: "பிரிவுகள் மேலாண்மை", labelEnglish: "Categories", to: "/admin/categories", cls: "bg-white text-forest border border-forest font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none hover:bg-forest hover:text-cream-100 transition-all text-center" },
            { labelTamil: "பரிந்துரை குழுக்கள்", labelEnglish: "Suggestions", to: "/admin/suggestions", cls: "bg-white text-bark-900 border border-bark-200 font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none hover:bg-gray-100 transition-all text-center" },
            { labelTamil: "வாடிக்கையாளர் சலுகைகள்", labelEnglish: "Offers", to: "/admin/offers", cls: "bg-white text-bark-900 border border-bark-200 font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none hover:bg-gray-100 transition-all text-center" },
          ].map((a) => (
            <Link key={a.to} to={a.to} className={a.cls}>
              <span className="text-xs sm:text-sm font-semibold font-catamaran leading-tight">{a.labelTamil}</span>
              <span className="text-[11px] font-lato opacity-80 leading-tight">{a.labelEnglish}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
