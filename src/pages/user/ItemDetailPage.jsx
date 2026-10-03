import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Tag,
  CheckCircle,
  Package,
  Leaf,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OfferBadge from "../../components/OfferBadge";
import ItemCard from "../../components/ItemCard";
import { useStore } from "../../context/StoreContext";
import { getEmojiGradient } from "../../data/mockData";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    items,
    addToCart,
    getItemPrice,
    getItemOffer,
    publicCategories,
    getGroupsOfItem,
  } = useStore();

  const item = items.find((i) => i.id === id);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">பொருள் கிடைக்கவில்லை (Item not found)</h2>
            <button onClick={() => navigate("/shop")} className="btn-primary cursor-pointer">
              Back to Catalogue
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountedPrice = getItemPrice(item);
  const offer = getItemOffer(item);
  const hasOffer = offer && discountedPrice < item.price;
  const itemCats = item.categoryIds || item.publicCategories || [];
  const cats = publicCategories.filter((c) => itemCats.includes(c.id));
  const memberGroups = getGroupsOfItem(item.id);

  const related = items
    .filter(
      (i) =>
        i.id !== item.id &&
        (i.categoryIds || i.publicCategories || []).some((c) => itemCats.includes(c))
    )
    .slice(0, 4);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const savings = hasOffer ? item.price - discountedPrice : 0;
  const gradientClass = getEmojiGradient(item.emoji);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors mb-6 cursor-pointer font-medium"
        >
          <ArrowLeft size={16} /> பின்செல்ல (Back)
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Emoji Tile Display */}
          <div
            className={`card overflow-hidden rounded-3xl aspect-square relative group bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}
          >
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/20 rounded-full blur-md pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/15 rounded-full blur-md pointer-events-none" />

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

            {hasOffer && (
              <div className="absolute top-4 left-4">
                <OfferBadge offer={offer} originalPrice={item.price} />
              </div>
            )}

            {item.unit && (
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                அளவு: {item.unit}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 animate-slide-up">
            {/* Categories & Suggestion Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              {cats.map((c) => (
                <span
                  key={c.id}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: c.color + "20", color: c.color }}
                >
                  {c.label}
                </span>
              ))}
              {memberGroups.map((g) => (
                <span
                  key={g.id}
                  className="text-xs font-semibold px-3 py-1 rounded-full border"
                  style={{ borderColor: g.color, color: g.color, backgroundColor: g.color + "12" }}
                >
                  ★ {g.tamilName}
                </span>
              ))}
            </div>

            {/* Tamil Name (Primary) & English Name (Secondary) */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
                {item.tamilName}
              </h1>
              <p className="text-lg text-gray-500 font-semibold mt-1">
                {item.englishName}
              </p>
            </div>

            {/* Price Box */}
            <div className="card bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100 p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {hasOffer && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="badge-orange">
                      தள்ளுபடி ₹{savings.toLocaleString()}!
                    </span>
                  </>
                )}
                {item.unit && (
                  <span className="text-sm font-semibold text-gray-500">
                    / {item.unit}
                  </span>
                )}
              </div>
              {hasOffer && (
                <div className="mt-3 flex items-center gap-2">
                  <OfferBadge offer={offer} originalPrice={item.price} />
                  <span className="text-sm text-gray-700 font-semibold">{offer.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                பொருள் விளக்கம் (Product Description)
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 badge-sky text-xs">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Package size={16} className={item.stock > 10 ? "text-emerald-600" : "text-amber-600"} />
              <span
                className={`text-sm font-semibold ${
                  item.stock > 10 ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {item.stock > 10
                  ? `இருப்பு: ${item.stock} பாக்கெட்டுகள் உள்ளன (In Stock)`
                  : `இருப்பு: ${item.stock} மட்டுமே உள்ளது! (Low Stock)`}
              </span>
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 text-lg font-bold transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="px-5 py-2.5 font-bold text-gray-800 text-base border-x-2 border-gray-200 min-w-[48px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(item.stock, qty + 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 text-lg font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all duration-300 cursor-pointer ${
                  added
                    ? "bg-emerald-600 text-white scale-95"
                    : "btn-primary text-base"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle size={18} /> கூடையில் சேர்க்கப்பட்டது!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> கூடையில் சேர் (Add to Cart)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Leaf size={20} className="text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                தொடர்புடைய பொருட்கள் (Related Products)
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {related.map((r) => (
                <ItemCard key={r.id} item={r} showCategories={true} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
