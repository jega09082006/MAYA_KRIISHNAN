import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../context/StoreContext";
import OfferBadge from "./OfferBadge";
import { getItemImage, EG_ICON } from "../utils/images";

export default function ItemCard({ item, showAddToCart = true, showCategories = false }) {
  const { addToCart, getItemPrice, getItemOffer, publicCategories } = useStore();
  const [added, setAdded] = useState(false);

  const discountedPrice = getItemPrice(item);
  const offer = getItemOffer(item);
  const hasOffer = offer && discountedPrice < item.price;

  const itemCats = item.categoryIds || item.publicCategories || [];
  const cats = publicCategories.filter((c) => itemCats.includes(c.id));

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const hasCustomImage = Boolean(item.image || item.imageUrl);
  const imgSrc = getItemImage(item);

  return (
    <div className="group block h-full min-w-0">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-[#faf6ee] rounded-none shadow-green hover:shadow-green-hover border border-bark-200 transition-all duration-200 h-full flex flex-col justify-between box-border overflow-hidden"
      >
        <div>
          {/* Product Card Image Area: Square (1/1), bg-[#faf6ee], border-b border-bark-200, rounded-none */}
          <Link to={`/item/${item.id}`} className="block relative overflow-hidden bg-[#faf6ee] aspect-square flex items-center justify-center border-b border-bark-200 rounded-none">
            <img
              src={imgSrc}
              alt={item.tamilName || item.englishName}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = EG_ICON;
              }}
              className={`w-full h-full ${
                hasCustomImage ? "object-cover" : "object-contain p-2"
              } transition-transform duration-300 group-hover:scale-105`}
            />

            {/* Offer badge overlay */}
            {hasOffer && (
              <div className="absolute top-2 left-2 z-10">
                <OfferBadge offer={offer} originalPrice={item.price} />
              </div>
            )}

            {/* Unit pill */}
            {item.unit && (
              <div className="absolute bottom-2 right-2 bg-forest-700/90 text-cream-100 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full font-lato">
                {item.unit}
              </div>
            )}

            {/* Quick view overlay — visible ONLY on devices with hover capability */}
            <div className="hidden @media(hover:hover):flex absolute inset-0 bg-forest-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
              <span className="bg-cream-100 text-forest-700 font-bold text-xs px-3.5 py-1.5 rounded-none flex items-center gap-1.5 shadow-md">
                <Eye size={13} /> விவரம் (View)
              </span>
            </div>
          </Link>

          {/* Content */}
          <div className="p-2.5 sm:p-4">
            {/* Optional category tags */}
            {showCategories && cats.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {cats.map((c) => (
                  <span
                    key={c.id}
                    className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 truncate"
                  >
                    {c.shortLabel || c.label}
                  </span>
                ))}
              </div>
            )}

            {/* Tamil Name (16-17px, bold, max 2 lines) */}
            <Link to={`/item/${item.id}`} className="block">
              <h3 className="font-extrabold text-bark-900 text-base sm:text-lg font-tamil leading-tight line-clamp-2 hover:text-forest transition-colors">
                {item.tamilName}
              </h3>
            </Link>

            {/* English Name (12-13px, muted, 1 line) */}
            <p className="text-xs sm:text-sm font-normal text-bark-400 font-lato truncate mb-2 mt-0.5">
              {item.englishName}
            </p>

            {/* Price & Offer */}
            <div className="flex items-baseline gap-1.5 mb-2 flex-wrap font-catamaran">
              <span className="font-extrabold text-base sm:text-lg text-forest-700">
                ₹{discountedPrice.toLocaleString()}
              </span>
              {hasOffer && (
                <span className="text-bark-400 line-through text-xs font-semibold font-lato">
                  ₹{item.price.toLocaleString()}
                </span>
              )}
              {item.unit && (
                <span className="text-xs text-bark-400 font-normal font-lato">
                  / {item.unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stock & Add to Cart button pinned to bottom */}
        <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-0">
          <div className="space-y-1.5 pt-1.5 border-t border-bark-200">
            {showAddToCart && (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold py-2.5 px-3 rounded-none transition-all duration-200 cursor-pointer min-h-[44px] ${
                  added
                    ? "bg-forest-600 text-cream-100 shadow-sm"
                    : "bg-gold text-bark-900 hover:bg-gold-600 shadow-green active:scale-98"
                }`}
              >
                <ShoppingCart size={15} />
                {added ? "சேர்க்கப்பட்டது" : "சேர் / Add"}
              </button>
            )}

            {/* Stock text: small, shown when low or out */}
            {item.stock <= 10 && (
              <p
                className={`text-[10px] sm:text-xs font-bold text-center ${
                  item.stock <= 0 ? "text-danger font-extrabold" : "text-amber-700"
                }`}
              >
                {item.stock <= 0 ? "இருப்பு இல்லை (Out of stock)" : `இருப்பு: ${item.stock} மட்டுமே!`}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
