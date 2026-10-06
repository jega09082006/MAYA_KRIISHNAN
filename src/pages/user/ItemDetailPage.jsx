import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Package } from "lucide-react";
import OfferBadge from "../../components/OfferBadge";
import ItemCard from "../../components/ItemCard";
import QuantityAddToCart from "../../components/QuantityAddToCart";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { getItemImage, EG_ICON } from "../../utils/images";
import { getWhatsAppLink } from "../../data/shopInfo";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    items,
    cart,
    getItemPrice,
    getOriginalPrice,
    getOfferPercentage,
  } = useStore();
  const { lang, t } = useLang();

  // Reserve space at the bottom for the cart stepper on mobile.
  // The bar height matches the QuantityAddToCart compact height (148px) + padding.
  useEffect(() => {
    document.documentElement.style.setProperty("--bottom-bar-height", "72px");
    return () => {
      document.documentElement.style.setProperty("--bottom-bar-height", "0px");
    };
  }, []);

  const item = items.find((i) => i.id === id);

  // ── Not found ──────────────────────────────────────────────────────────
  if (!item) {
    return (
      <PageTransition className="flex flex-col bg-storefront text-bark-900">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 px-4">
          <img src={EG_ICON} alt="Not Found" className="w-24 h-24 opacity-60" />
          <h2 className="text-xl sm:text-2xl font-bold font-catamaran text-bark-800 text-center">
            {t("productNotFound")}
          </h2>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="bg-gold text-bark-900 font-bold px-6 py-2.5 rounded-none hover:bg-gold-600 transition-all cursor-pointer min-h-[44px]"
          >
            {t("backToShop")}
          </button>
        </div>
      </PageTransition>
    );
  }

  // ── Derived ─────────────────────────────────────────────────────────────
  const discountedPrice = getItemPrice(item);
  const originalPrice   = getOriginalPrice(item);
  const offerPct        = getOfferPercentage(item);

  // Cart-synced qty for the mobile sticky bar total
  const cartEntry = cart.find((c) => c.id === item.id);
  const cartQty   = cartEntry?.qty ?? 0;
  const lineTotalForBar = discountedPrice * Math.max(cartQty, 1);

  const displayName = lang === "ta"
    ? (item.tamilName  || item.nameTamil   || item.englishName)
    : (item.englishName || item.nameEnglish || item.tamilName);

  const description = lang === "ta"
    ? (item.descriptionTa || item.description || "")
    : (item.descriptionEn || item.description || "");

  // Related items (same category, up to 4)
  const related = items
    .filter((i) => {
      const iCats  = i.categoryIds  || i.publicCategories  || [];
      const myCats = item.categoryIds || item.publicCategories || [];
      return i.id !== item.id && iCats.some((c) => myCats.includes(c));
    })
    .slice(0, 4);

  // WhatsApp inquiry (language-aware)
  const waMsg = lang === "ta"
    ? `வணக்கம், ${t("waInquiry")}: ${item.tamilName} (${item.englishName}), ₹${discountedPrice} / ${item.unit}`
    : `Hello, ${t("waInquiry")}: ${item.englishName} (${item.tamilName}), ₹${discountedPrice} / ${item.unit}`;

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 flex-1 w-full">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-forest-700 hover:text-bark-900 font-bold text-sm cursor-pointer min-h-[44px]"
        >
          <ArrowLeft size={16} />
          <span>{t("backToPrevious")}</span>
        </button>

        {/* Main card */}
        <div className="bg-[#faf6ee] p-4 sm:p-8 border border-gold/30 shadow-green grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">

          {/* Image */}
          <div className="relative bg-cream-100 border border-gold/30 p-4 flex items-center justify-center min-h-[260px] sm:min-h-[360px]">
            <img
              src={getItemImage(item)}
              alt={displayName}
              className="max-h-72 sm:max-h-96 object-contain w-full"
            />
            {offerPct > 0 && (
              <div className="absolute top-3 right-3">
                <OfferBadge percentage={offerPct} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 flex flex-col">

            {/* Name */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-catamaran text-bark-900 leading-tight">
                {displayName}
              </h1>
              <p className="text-sm font-bold text-bark-500 mt-1">{item.unit}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1 border-t border-gold/20">
              <span className="text-2xl sm:text-4xl font-extrabold text-forest-700 font-catamaran">
                ₹{discountedPrice.toLocaleString("en-IN")}
              </span>
              {originalPrice > discountedPrice && (
                <span className="text-base sm:text-lg text-bark-400 line-through font-catamaran font-semibold">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs font-bold text-bark-500">/ {item.unit}</span>
            </div>

            {/* Description */}
            {description && (
              <div className="space-y-1.5 pt-2">
                <h3 className="font-bold text-xs text-bark-400 uppercase tracking-wider">
                  {t("descriptionTitle")}
                </h3>
                <p className="text-sm sm:text-base text-bark-800 font-catamaran leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-forest-100 text-forest-800 text-xs font-bold px-2.5 py-1 rounded-full"
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 pt-1">
              <Package size={16} className={item.stock > 10 ? "text-forest-700" : "text-danger"} />
              <span className={`text-xs sm:text-sm font-bold ${item.stock > 10 ? "text-forest-700" : "text-danger"}`}>
                {item.stock > 10
                  ? `${t("stockCount")}: ${item.stock} ${t("inStockCount")}`
                  : `${t("stockCount")}: ${item.stock} ${t("lowStockCount")}`}
              </span>
            </div>

            {/*
             * ── ACTION AREA (desktop) ──────────────────────────────────
             * QuantityAddToCart in non-compact mode:
             *   cartQty=0: pre-add stepper + Add to Cart + Buy Now
             *   cartQty≥1: cart stepper + Buy Now + View Cart with line total
             *
             * Hidden on mobile (the sticky bottom bar handles it there).
             */}
            <div className="hidden sm:block pt-2">
              <QuantityAddToCart item={item} compact={false} />
            </div>

            {/* WhatsApp inquiry */}
            <div className="pt-3">
              <a
                href={getWhatsAppLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#25D366] text-[#1d3d29] hover:bg-[#25D366]/10 px-4 py-2.5 rounded-none font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px] w-full sm:w-auto justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  viewBox="0 0 24 24" fill="currentColor"
                  className="text-[#25D366] shrink-0" aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.591-1.048 3.834 3.792-1.026.999.598zm11.383-7.51c-.287-.144-1.701-.84-1.963-.935-.262-.096-.453-.144-.645.144-.192.288-.744.935-.912 1.127-.168.192-.336.216-.623.072-.287-.144-1.215-.448-2.315-1.428-.857-.764-1.435-1.707-1.603-1.995-.168-.288-.018-.444.126-.587.13-.129.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.645-1.585-.883-2.16-.232-.559-.467-.483-.645-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.985-1.008 2.401 0 1.417 1.032 2.784 1.176 2.977.144.192 2.033 3.103 4.925 4.35.688.297 1.225.475 1.644.609.691.22 1.32.189 1.817.115.555-.083 1.701-.696 1.94-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
                </svg>
                <span>{t("askWhatsApp")}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related items */}
        {related.length > 0 && (
          <section className="mt-12 pt-6 border-t border-gold/30 space-y-4">
            <div className="flex items-center gap-2.5">
              <GoldLotusOrnament size={20} />
              <h2 className="text-lg sm:text-2xl font-extrabold font-catamaran text-bark-900">
                {t("relatedProducts")}
              </h2>
            </div>
            <div className="flex sm:grid sm:grid-cols-4 sm:items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x [&>*]:snap-start">
              {related.map((r) => (
                <div key={r.id} className="flex-shrink-0 w-[160px] sm:w-auto sm:min-w-0">
                  <ItemCard item={r} showCategories />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/*
       * ── MOBILE STICKY BOTTOM BAR ────────────────────────────────────
       * Shows the cart-synced QuantityAddToCart in compact mode.
       * The line-total above it shows qty × price (or just unit price if none in cart).
       */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf6ee] border-t-2 border-gold shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-1">
          <div>
            <p className="text-[10px] text-bark-400 font-bold uppercase tracking-wider">
              {t("mobileTotal")}
            </p>
            <p className="text-lg font-extrabold text-forest-700 font-catamaran leading-none">
              ₹{lineTotalForBar.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex-1 min-w-0">
            <QuantityAddToCart item={item} compact />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
