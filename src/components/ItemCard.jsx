import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { getEmojiGradient } from "../data/mockData";
import OfferBadge from "./OfferBadge";

export default function ItemCard({ item, showAddToCart = true, showCategories = false }) {
  const { addToCart, getItemPrice, getItemOffer, publicCategories } = useStore();
  const [added, setAdded] = useState(false);

  const discountedPrice = getItemPrice(item);
  const offer = getItemOffer(item);
  const hasOffer = offer && discountedPrice < item.price;

  const itemCats = item.categoryIds || item.publicCategories || [];
  const cats = publicCategories.filter((c) => itemCats.includes(c.id));

  const gradientClass = getEmojiGradient(item.emoji);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link to={`/item/${item.id}`} className="group block h-full">
      <div className="card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
        <div>
          {/* Emoji Gradient Tile Header */}
          <div
            className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} h-40 sm:h-44 flex items-center justify-center`}
          >
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/20 rounded-full blur-sm pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/15 rounded-full blur-sm pointer-events-none" />

            {(() => {
              const photoUrl =
                item.imageUrl ||
                item.image ||
                (item.emoji === "🌿" ? "/photos/herb.svg" :
                 item.emoji === "🌶️" ? "/photos/spice.svg" :
                 item.emoji === "🌾" ? "/photos/grocery.svg" :
                 item.emoji === "🪔" ? "/photos/pooja.svg" :
                 item.emoji === "🧴" ? "/photos/oil.svg" :
                 item.emoji === "💊" ? "/photos/medicine.svg" :
                 "/photos/grocery.svg");
              return (
                <img
                  src={photoUrl}
                  alt={item.tamilName || item.englishName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              );
            })()}

            {/* Offer badge overlay */}
            {hasOffer && (
              <div className="absolute top-2.5 left-2.5">
                <OfferBadge offer={offer} originalPrice={item.price} />
              </div>
            )}

            {/* Unit pill */}
            {item.unit && (
              <div className="absolute bottom-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {item.unit}
              </div>
            )}

            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-gray-800 font-semibold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                <Eye size={13} /> விவரம்
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3.5 sm:p-4">
            {/* Optional category tags (hidden on home) */}
            {showCategories && cats.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {cats.map((c) => (
                  <span
                    key={c.id}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: c.color + "18", color: c.color }}
                  >
                    {c.shortLabel || c.label}
                  </span>
                ))}
              </div>
            )}

            {/* Tamil Name & English Name (Equal Size) */}
            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-brand-orange transition-colors">
              {item.tamilName}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-gray-700 leading-snug mb-2.5 mt-0.5">
              {item.englishName}
            </p>

            {/* Price & Unit */}
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-extrabold text-base sm:text-lg text-gray-900">
                ₹{discountedPrice.toLocaleString()}
              </span>
              {hasOffer && (
                <span className="text-gray-400 line-through text-xs font-semibold">
                  ₹{item.price.toLocaleString()}
                </span>
              )}
              {item.unit && (
                <span className="text-xs text-gray-400 font-medium">
                  / {item.unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stock & Add to Cart button */}
        <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-0">
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span
              className={`text-[11px] font-semibold ${
                item.stock > 10 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {item.stock > 10 ? `இருப்பு: ${item.stock}` : `இருப்பு: ${item.stock}!`}
            </span>

            {showAddToCart && (
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  added
                    ? "bg-emerald-600 text-white scale-95"
                    : "bg-gradient-to-r from-brand-orange to-brand-pink text-white hover:scale-105 hover:shadow-md"
                }`}
              >
                <ShoppingCart size={13} />
                {added ? "சேர்க்கப்பட்டது" : "சேர்"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
