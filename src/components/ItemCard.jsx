import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../context/StoreContext";
import { useLang } from "../context/LanguageContext";
import OfferBadge from "./OfferBadge";
import QuantityAddToCart from "./QuantityAddToCart";
import { getItemImage, EG_ICON } from "../utils/images";

/**
 * Uniform-height product card used in every grid/swipe row.
 *
 * Height contract (flex column, height: 100%):
 *   ┌─ image ────────────── 1:1 aspect-ratio ──────────────┐
 *   │  [optional category chips]                            │
 *   │  [name — exactly 2 lines reserved via minHeight]      │
 *   │  [price row — 1 line, fixed minHeight]                │
 *   │  [offer / old-price row — reserved even when empty]   │
 *   │  [stock badge row — reserved even when not low]       │
 *   │  ─ divider ─                                          │
 *   └─ QuantityAddToCart (compact) — margin-top:auto ───── ┘
 *      stepper 44 + gap 8 + add 44 + gap 8 + buy 44 = 148 px
 *
 * Parent grids MUST use align-items:stretch + grid-auto-rows:1fr.
 */
export default function ItemCard({ item, showAddToCart = true, showCategories = false }) {
  const { getItemPrice, getItemOffer, publicCategories } = useStore();
  const { lang, t } = useLang();

  const discountedPrice = getItemPrice(item);
  const offer           = getItemOffer(item);
  const hasOffer        = offer && discountedPrice < item.price;

  const itemCats = item.categoryIds || item.publicCategories || [];
  const cats     = publicCategories.filter((c) => itemCats.includes(c.id));

  const hasCustomImage = Boolean(item.image || item.imageUrl);
  const imgSrc         = getItemImage(item);

  const displayName = lang === "ta"
    ? (item.tamilName  || item.nameTamil   || item.englishName)
    : (item.englishName || item.nameEnglish || item.tamilName);

  // Stock badge — always rendered to reserve space (invisible when in-stock)
  const isOutOfStock = (item.stock ?? 0) <= 0;
  const isLowStock   = !isOutOfStock && item.stock <= 10;
  const stockText    = isOutOfStock
    ? t("outOfStock")
    : isLowStock
    ? `${t("lowStock")} (${item.stock})`
    : "";
  const stockColor   = isOutOfStock ? "text-danger" : "text-amber-700";

  return (
    <div className="min-w-0 h-full">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-[#faf6ee] rounded-none shadow-green hover:shadow-green-hover border border-bark-200 transition-all duration-200 h-full flex flex-col overflow-hidden"
      >
        {/* ── IMAGE (1:1 aspect ratio) ────────────────────────────────── */}
        <Link
          to={`/item/${item.id}`}
          className="relative block bg-[#faf6ee] border-b border-bark-200 overflow-hidden group/img"
          style={{ aspectRatio: "1 / 1" }}
        >
          <img
            src={imgSrc}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = EG_ICON; }}
            className={[
              "w-full h-full",
              hasCustomImage ? "object-cover" : "object-contain p-2",
              "transition-transform duration-300 group-hover/img:scale-105",
            ].join(" ")}
          />

          {hasOffer && (
            <div className="absolute top-2 left-2 z-10">
              <OfferBadge offer={offer} originalPrice={item.price} />
            </div>
          )}

          {item.unit && (
            <div className="absolute bottom-2 right-2 bg-forest-700/90 text-cream-100 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full font-catamaran">
              {item.unit}
            </div>
          )}

          {/* Quick-view overlay — hover-capable devices only */}
          <div className="hidden [@media(hover:hover)]:flex absolute inset-0 bg-forest-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 items-center justify-center">
            <span className="bg-cream-100 text-forest-700 font-bold text-xs px-3.5 py-1.5 rounded-none flex items-center gap-1.5 shadow-md">
              <Eye size={13} /> {t("viewItem")}
            </span>
          </div>
        </Link>

        {/* ── BODY ────────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-3">

          {/* Optional category chips */}
          {showCategories && cats.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {cats.map((c) => {
                const catName = lang === "ta"
                  ? (c.tamilName  || c.label)
                  : (c.englishName || c.label);
                return (
                  <span
                    key={c.id}
                    className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 truncate max-w-full"
                  >
                    {catName}
                  </span>
                );
              })}
            </div>
          )}

          {/* NAME — always 2 lines */}
          <Link to={`/item/${item.id}`} className="block mb-1.5" tabIndex={-1}>
            <h3
              title={displayName}
              className="font-extrabold text-bark-900 font-catamaran leading-snug text-sm sm:text-base line-clamp-2 overflow-hidden"
              style={{ minHeight: "2.7em" }}
            >
              {displayName}
            </h3>
          </Link>

          {/* PRICE ROW — always 1 line */}
          <div
            className="flex items-baseline gap-1.5 flex-wrap font-catamaran"
            style={{ minHeight: "1.6em" }}
          >
            <span className="font-extrabold text-sm sm:text-base text-forest-700 leading-none">
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>
            {hasOffer && (
              <span className="text-bark-400 line-through text-xs font-semibold leading-none">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
            )}
            {item.unit && (
              <span className="text-xs text-bark-400 font-normal leading-none">
                / {item.unit}
              </span>
            )}
          </div>

          {/* STOCK BADGE — always rendered; invisible when in-stock */}
          <p
            className={[
              "text-[10px] sm:text-xs font-bold text-center font-catamaran mt-1",
              stockText ? stockColor : "invisible",
            ].join(" ")}
            aria-hidden={!stockText}
            style={{ minHeight: "1.25em" }}
          >
            {stockText || "–"}
          </p>

          {/* ── ACTION AREA — margin-top:auto pins to card bottom ──── */}
          {showAddToCart && (
            <div className="mt-auto pt-2 border-t border-bark-200">
              <QuantityAddToCart item={item} compact />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
