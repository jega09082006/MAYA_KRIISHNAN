import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Phone,
  MapPin,
  Flame,
  Leaf,
  HeartPulse,
  Sparkles,
  ChefHat,
  Wheat,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ItemCard from "../../components/ItemCard";
import PageTransition from "../../components/PageTransition";
import Logo from "../../components/Logo";
import FloatingCallButton from "../../components/FloatingCallButton";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { shopInfo } from "../../data/shopInfo";
import { FEATURED_ITEM_IDS, PRODUCT_SIGNIFICANCE } from "../../data/homeContent";

const ICON_MAP = {
  Flame,
  Leaf,
  HeartPulse,
  Sparkles,
  ChefHat,
  Wheat,
};

export default function HomePage() {
  const { items, activeSuggestionGroups } = useStore();

  // Resolve FEATURED_ITEM_IDS into available in-stock items
  const featuredProducts = useMemo(() => {
    if (!items || items.length === 0) return [];
    return FEATURED_ITEM_IDS.map((id) => items.find((i) => i.id === id))
      .filter(Boolean)
      .filter((item) => (item.stock ?? 0) > 0);
  }, [items]);

  const addressPillContent = (
    <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1d3d29] border border-emerald-600/40 text-cream-100 rounded-full text-xs sm:text-sm font-medium shadow-sm w-full sm:w-auto min-h-[44px]">
      <MapPin size={15} className="text-gold-300 shrink-0" />
      <span className="truncate max-w-[260px] sm:max-w-none">{shopInfo.addressTamil}</span>
    </div>
  );

  return (
    <PageTransition className="min-h-screen flex flex-col bg-storefront text-bark-900 pb-12 sm:pb-0">
      <Navbar />

      {/* 2. HERO (mobile optimized: stacked & centered, fits within ~1 screen height) */}
      <section className="bg-hero-mandala py-6 sm:py-12 text-cream-100 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 text-center md:text-left">
            
            {/* Logo (about 120px on mobile) */}
            <div className="shrink-0 relative p-1.5 rounded-full border-2 border-gold/50 bg-[#1d3d29] shadow-2xl">
              <Logo className="w-24 h-24 sm:w-36 sm:h-36 border border-gold/40" />
            </div>

            {/* Signboard Text & Action Pills */}
            <div className="flex flex-col items-center md:items-start max-w-2xl space-y-2.5 w-full">
              {shopInfo.blessingLine ? (
                <p className="font-playfair text-gold-300 text-xs tracking-widest uppercase self-center md:self-start">
                  {shopInfo.blessingLine}
                </p>
              ) : null}

              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-tamil text-gold-400 tracking-tight leading-tight"
                style={{
                  textShadow: "0 0 6px rgba(29,61,41,0.9), 2px 2px 0px #0a170f",
                }}
              >
                {shopInfo.nameTamil}
              </h1>

              <p className="text-lg sm:text-3xl font-extrabold font-tamil text-cream-100 tracking-wide">
                {shopInfo.businessTamil}
              </p>

              <p className="text-xs sm:text-sm font-bold font-lato text-gold-200 tracking-wider">
                {shopInfo.nameEnglish} – {shopInfo.businessEnglish}
              </p>

              {/* Green Pills (Phone & Address) - Stacked full width on mobile */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5 w-full">
                <a
                  href={shopInfo.phoneLink}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1d3d29] hover:bg-[#2d5a3d] transition-colors text-cream-100 rounded-full text-xs sm:text-sm font-bold shadow-sm border border-emerald-600/40 w-full sm:w-auto min-h-[44px] cursor-pointer"
                >
                  <Phone size={15} className="text-gold-300 shrink-0" />
                  <span>அழைக்க – {shopInfo.phoneDisplay}</span>
                </a>

                {shopInfo.mapsLink ? (
                  <a
                    href={shopInfo.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90 transition-opacity cursor-pointer w-full sm:w-auto"
                  >
                    {addressPillContent}
                  </a>
                ) : (
                  addressPillContent
                )}
              </div>

              {/* Action Buttons - Stacked full width on mobile */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full">
                <Link
                  to="/shop"
                  className="bg-gold text-bark-900 font-extrabold px-6 py-3 rounded-none hover:bg-gold-600 transition-all duration-200 shadow-green text-sm flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
                >
                  <ShoppingBag size={16} /> Shop Now (பொருட்களைப் பாருங்கள்)
                </Link>
                <a
                  href={shopInfo.phoneLink}
                  className="border border-cream-100 text-cream-100 font-bold px-6 py-3 rounded-none hover:bg-cream-100/10 transition-all duration-200 text-sm flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
                >
                  <Phone size={16} /> Call Now ({shopInfo.phoneDisplay})
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area: reduced 32px gap between sections on mobile */}
      <div className="py-8 sm:py-14 space-y-8 sm:space-y-16 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* 3. WHAT WE SELL AND WHAT IT IS USED FOR (1-column on mobile, full width cards) */}
        <section className="bg-hero-mandala/40 p-4 sm:p-10 border border-gold/30 rounded-none space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GoldLotusOrnament size={22} />
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold font-tamil text-bark-900 tracking-tight">
              எங்கள் பொருட்கள் – பயன்கள்
            </h2>
            <p className="text-[11px] sm:text-sm font-bold font-lato text-bark-500 uppercase tracking-widest">
              What We Sell and What It Is Used For
            </p>
          </div>

          {/* 6 Significance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {PRODUCT_SIGNIFICANCE.map((sig) => {
              const IconComponent = ICON_MAP[sig.icon] || Leaf;

              // Resolve example items
              const exampleItems = (sig.exampleItemIds || [])
                .map((itemId) => items.find((i) => i.id === itemId))
                .filter(Boolean);

              return (
                <div
                  key={sig.id}
                  className="bg-[#faf6ee] border border-bark-200 border-t-4 border-t-gold p-4 sm:p-6 rounded-none shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Icon Badge */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1d3d29] border border-gold/40 text-gold-400 flex items-center justify-center shadow-sm shrink-0 mb-3">
                      <IconComponent size={20} />
                    </div>

                    {/* Card Title Link to /shop search */}
                    <Link
                      to={`/shop?search=${encodeURIComponent(sig.titleEnglish)}`}
                      className="block group"
                    >
                      <h3 className="text-base sm:text-lg font-bold font-tamil text-bark-900 group-hover:text-forest-700 transition-colors">
                        {sig.titleTamil}
                      </h3>
                      <p className="text-xs font-semibold font-lato text-bark-500 uppercase tracking-wider mt-0.5">
                        {sig.titleEnglish}
                      </p>
                    </Link>

                    {/* Descriptions */}
                    <p className="text-xs sm:text-sm text-bark-700 mt-2 font-medium leading-relaxed">
                      {sig.textTamil}
                    </p>
                    <p className="text-xs text-bark-500 mt-1 font-lato leading-normal">
                      {sig.textEnglish}
                    </p>
                  </div>

                  {/* Example Products Pills */}
                  {exampleItems.length > 0 && (
                    <div className="pt-3 border-t border-bark-200/60">
                      <p className="text-[10px] font-bold text-bark-400 font-lato uppercase tracking-wider mb-2">
                        பயன்படும் பொருட்கள் (Example Items):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {exampleItems.slice(0, 3).map((exItem) => (
                          <Link
                            key={exItem.id}
                            to={`/item/${exItem.id}`}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1d3d29]/10 text-forest-700 border border-forest-700/20 hover:bg-[#1d3d29] hover:text-gold transition-colors font-tamil min-h-[36px] flex items-center"
                          >
                            {exItem.tamilName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SUGGESTION GROUP SECTIONS (Mobile: horizontal swipe row with scroll-snap) */}
        {activeSuggestionGroups && activeSuggestionGroups.length > 0 && (
          <div className="space-y-8 sm:space-y-12">
            {activeSuggestionGroups.map((group) => (
              <section key={group.id} className="w-full">
                <div className="flex items-center justify-between mb-3 border-b border-gold/30 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: group.color || "#d99c2b" }}
                    />
                    <h2 className="text-lg sm:text-2xl font-extrabold font-tamil text-bark-900 truncate">
                      {group.tamilName} <span className="text-xs sm:text-sm font-lato text-bark-500 font-normal">({group.name})</span>
                    </h2>
                  </div>
                  <Link
                    to="/shop"
                    className="flex items-center gap-1 text-xs sm:text-sm font-bold transition-colors hover:underline font-lato shrink-0"
                    style={{ color: group.color || "#d99c2b" }}
                  >
                    See all <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Mobile: Horizontal snap swipe row (155px wide cards peeking edge). Laptop (1024px+): Grid */}
                <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {group.items.map((item) => (
                    <div
                      key={`${group.id}-${item.id}`}
                      className="snap-start w-[155px] sm:w-[220px] lg:w-auto flex-shrink-0 h-full"
                    >
                      <ItemCard item={item} showCategories={false} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 5. MOST IMPORTANT PRODUCTS (Mobile: 2-column grid) */}
        {featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <GoldLotusOrnament size={20} />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold font-tamil text-bark-900 tracking-tight">
                முக்கிய பொருட்கள்
              </h2>
              <p className="text-[11px] sm:text-sm font-bold font-lato text-bark-500 uppercase tracking-widest">
                Most Important Products
              </p>
            </div>

            {/* Featured Items Grid: 2 columns on phones */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredProducts.map((item) => (
                <ItemCard key={`featured-${item.id}`} item={item} showCategories={false} />
              ))}
            </div>

            {/* View All Products Button */}
            <div className="text-center pt-2">
              <Link
                to="/shop"
                className="bg-gold text-bark-900 font-extrabold px-6 py-3 rounded-none hover:bg-gold-600 transition-all duration-200 shadow-green text-sm sm:text-base inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto min-h-[44px]"
              >
                <span>எல்லா பொருட்களையும் பார்க்க / View All Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

      </div>

      <Footer />

      {/* Floating Call Button on Mobile */}
      <FloatingCallButton />
    </PageTransition>
  );
}
