import React from "react";
import { Link } from "react-router-dom";
import {
  Package, Users, Gift, Star, Tag, ArrowRight, TrendingUp,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, EG_ICON } from "../../utils/images";
import { shopInfo } from "../../data/shopInfo";

export default function AdminDashboard() {
  const { items, customers, offers, suggestionGroups, publicCategories } = useStore();
  const { lang, t } = useLang();

  const LOW_STOCK_LIMIT   = 10;
  const lowStockCount     = items.filter((i) => i.stock <= LOW_STOCK_LIMIT).length;
  const activeCustomers   = customers.filter((c) => c.status === "active").length;
  const todayStr          = new Date().toISOString().split("T")[0];
  const activeOffersCount = offers.filter(
    (o) => o.isActive && (!o.startDate || o.startDate <= todayStr) && (!o.endDate || o.endDate >= todayStr)
  ).length;
  const activeGroupsCount = suggestionGroups.filter((g) => g.isActive).length;
  const totalRevenue      = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const shopName = lang === "ta" ? shopInfo.nameTamil : shopInfo.nameEnglish;

  const stats = [
    {
      titleTamil:    "பொருட்கள்",
      titleEnglish:  "Total Items",
      value:         items.length,
      subtitleTamil:   `${lowStockCount} குறைவான இருப்பு`,
      subtitleEnglish: `${lowStockCount} low stock`,
      icon: Package,
    },
    {
      titleTamil:    "வாடிக்கையாளர்கள்",
      titleEnglish:  "Customers",
      value:         customers.length,
      subtitleTamil:   `${activeCustomers} செயலில் உள்ளோர்`,
      subtitleEnglish: `${activeCustomers} active`,
      icon: Users,
    },
    {
      titleTamil:    "சலுகைகள்",
      titleEnglish:  "Active Offers",
      value:         activeOffersCount,
      subtitleTamil:   `${offers.length} சலுகைகளில்`,
      subtitleEnglish: `of ${offers.length} offers`,
      icon: Gift,
    },
    {
      titleTamil:    "பரிந்துரை குழுக்கள்",
      titleEnglish:  "Suggestion Groups",
      value:         suggestionGroups.length,
      subtitleTamil:   `${activeGroupsCount} முகப்பில் நேரலை`,
      subtitleEnglish: `${activeGroupsCount} live on home page`,
      icon: Star,
    },
    {
      titleTamil:    "பிரிவுகள்",
      titleEnglish:  "Categories",
      value:         publicCategories.length,
      subtitleTamil:   "பொதுப் பிரிவுகள்",
      subtitleEnglish: "Public categories",
      icon: Tag,
    },
    {
      titleTamil:    "வருவாய்",
      titleEnglish:  "Total Revenue",
      value:         `₹${totalRevenue.toLocaleString("en-IN")}`,
      subtitleTamil:   "வாடிக்கையாளர் ஆர்டர்கள்",
      subtitleEnglish: "from customer orders",
      icon: TrendingUp,
    },
  ];

  const recentItems   = [...items].slice(-5).reverse();
  const topCustomers  = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const viewAll     = lang === "ta" ? "அனைத்தும் பார்க்க" : "View all";
  const recentLabel = lang === "ta" ? "சமீபத்திய பொருட்கள்" : "Recent Items";
  const topCustLbl  = lang === "ta" ? "முக்கிய வாடிக்கையாளர்கள்" : "Top Customers";
  const quickAct    = lang === "ta" ? "விரைவுச் செயல்கள்" : "Quick Actions";
  const inStockLbl  = lang === "ta" ? "இருப்பு" : "In Stock";
  const lowStockLbl = lang === "ta" ? "குறைவு" : "Low";
  const orderLabel  = lang === "ta" ? "ஆர்டர்கள்" : "orders";

  const quickActions = [
    { labelTa: "புதிய பொருள் சேர்", labelEn: "Add Item",   to: "/admin/items/new",    cls: "bg-gold text-bark-900 font-extrabold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none shadow-green hover:bg-gold-600 transition-all text-center" },
    { labelTa: "பொருட்கள் பட்டியல்", labelEn: "Items List", to: "/admin/items",         cls: "bg-forest text-cream-100 font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none shadow-green hover:bg-forest-700 transition-all text-center" },
    { labelTa: "பிரிவுகள் மேலாண்மை", labelEn: "Categories", to: "/admin/categories",    cls: "bg-white text-forest border border-forest font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none hover:bg-forest hover:text-cream-100 transition-all text-center" },
    { labelTa: "பரிந்துரை குழுக்கள்", labelEn: "Suggestions", to: "/admin/suggestions",  cls: "bg-white text-bark-900 border border-bark-200 font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none hover:bg-gray-100 transition-all text-center" },
    { labelTa: "வாடிக்கையாளர் சலுகைகள்", labelEn: "Offers", to: "/admin/offers",       cls: "bg-white text-bark-900 border border-bark-200 font-bold px-4 py-3 min-h-[52px] flex flex-col items-center justify-center rounded-none hover:bg-gray-100 transition-all text-center" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-gray-800 font-lato">

      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-baseline flex-wrap gap-2">
          <GoldLotusOrnament size={24} className="self-center shrink-0" />
          <h1 className="text-[24px] sm:text-[30px] font-bold font-catamaran text-gray-900 leading-tight">
            {lang === "ta" ? "கட்டுப்பாட்டு அறை" : "Admin Dashboard"}
          </h1>
        </div>
        <p className="text-gray-500 text-[14px] mt-1 leading-normal">
          {shopName} {lang === "ta" ? "கடை மேலாண்மை" : "Store Administration"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-3 gap-[12px] lg:gap-[20px]">
        {stats.map((s) => (
          <StatCard key={s.titleEnglish} {...s} />
        ))}
      </div>

      {/* Recent Items + Top Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Items */}
        <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4 border-b border-gray-200 pb-3">
            <h3 className="font-extrabold text-gray-900 font-catamaran text-[18px] leading-snug">{recentLabel}</h3>
            <Link to="/admin/items" className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 transition-colors min-h-[44px] px-1 whitespace-nowrap shrink-0">
              {viewAll} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentItems.map((item) => {
              const name     = lang === "ta" ? item.tamilName : item.englishName;
              const imgSrc   = getItemImage(item);
              const hasImage = Boolean(item.image || item.imageUrl);
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-none hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 rounded-none bg-[#faf6ee] border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
                    <img src={imgSrc} alt={name} onError={(e) => { e.currentTarget.src = EG_ICON; }} className={`w-full h-full ${hasImage ? "object-cover" : "object-contain"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm font-catamaran leading-tight min-w-0 [overflow-wrap:anywhere]">{name}</p>
                    <p className="text-xs text-gray-500 leading-snug">₹{item.price.toLocaleString("en-IN")} {item.unit ? `(${item.unit})` : ""}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-auto ${item.stock > LOW_STOCK_LIMIT ? "bg-forest-100 text-forest-800" : "bg-red-100 text-danger"}`}>
                    {item.stock > LOW_STOCK_LIMIT ? inStockLbl : lowStockLbl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4 border-b border-gray-200 pb-3">
            <h3 className="font-extrabold text-gray-900 font-catamaran text-[18px] leading-snug">{topCustLbl}</h3>
            <Link to="/admin/customers" className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 transition-colors min-h-[44px] px-1 whitespace-nowrap shrink-0">
              {viewAll} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {topCustomers.map((c, idx) => (
              <Link key={c.id} to={`/admin/customers/${c.id}`} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-none hover:bg-gray-100 transition-colors">
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">#{idx + 1}</span>
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=2d5a3d&color=fff&size=40`; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm min-w-0 [overflow-wrap:anywhere]">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.totalOrders} {orderLabel}</p>
                </div>
                <span className="font-extrabold text-sm text-forest-700 font-catamaran shrink-0 ml-auto">₹{c.totalSpent.toLocaleString("en-IN")}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 shadow-green">
        <div className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="font-extrabold text-gray-900 font-catamaran text-[18px]">{quickAct}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className={a.cls}>
              <span className="text-xs sm:text-sm font-semibold font-catamaran leading-tight">
                {lang === "ta" ? a.labelTa : a.labelEn}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
