import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Tag,
  CheckCircle,
  Package,
} from "lucide-react";
import OfferBadge from "../../components/OfferBadge";
import ItemCard from "../../components/ItemCard";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { getItemImage, EG_ICON } from "../../utils/images";
import { getWhatsAppLink } from "../../data/shopInfo";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    items,
    addToCart,
    getItemPrice,
    getOriginalPrice,
    getOfferPercentage,
  } = useStore();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--bottom-bar-height", "72px");
    return () => {
      document.documentElement.style.setProperty("--bottom-bar-height", "0px");
    };
  }, []);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <PageTransition className="flex flex-col bg-storefront text-bark-900 font-lato">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 px-4">
          <img src={EG_ICON} alt="Not Found" className="w-24 h-24 opacity-60" />
          <h2 className="text-xl sm:text-2xl font-bold font-tamil text-bark-800 text-center">
            பொருள் கிடைக்கவில்லை! (Product Not Found)
          </h2>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="bg-gold text-bark-900 font-bold px-6 py-2.5 rounded-none hover:bg-gold-600 transition-all cursor-pointer min-h-[44px]"
          >
            பொருட்கள் பக்கத்திற்குச் செல் (Back to Shop)
          </button>
        </div>
      </PageTransition>
    );
  }

  const discountedPrice = getItemPrice(item);
  const originalPrice = getOriginalPrice(item);
  const offerPct = getOfferPercentage(item);

  const related = items
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);

  function handleAdd() {
    addToCart(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waInquiryMsg = `வணக்கம், இந்த பொருளைப் பற்றி தெரிந்து கொள்ள வேண்டும்: ${item.nameTamil} (${item.nameEnglish}), ${discountedPrice} ₹ / ${item.unit}`;

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900 font-lato">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 flex-1 w-full">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-forest-700 hover:text-bark-900 font-bold text-sm font-lato cursor-pointer min-h-[44px]"
        >
          <ArrowLeft size={16} />
          <span>பின்செல்ல (Back to previous page)</span>
        </button>

        {/* Main Product Card Grid */}
        <div className="bg-[#faf6ee] p-4 sm:p-8 border border-gold/30 shadow-green grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {/* Left Column: Product Image */}
          <div className="relative bg-cream-100 border border-gold/30 p-4 flex items-center justify-center min-h-[260px] sm:min-h-[360px]">
            <img
              src={getItemImage(item)}
              alt={item.nameTamil}
              className="max-h-72 sm:max-h-96 object-contain w-full"
            />
            {offerPct > 0 && (
              <div className="absolute top-3 right-3">
                <OfferBadge percentage={offerPct} />
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="space-y-4 flex flex-col justify-center">
            {/* Category tag */}
            <span className="inline-block bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full font-lato self-start">
              {item.category}
            </span>

            {/* Tamil & English Titles */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-tamil text-bark-900 leading-tight">
                {item.nameTamil}
              </h1>
              <p className="text-sm sm:text-base font-bold text-bark-600 font-lato mt-0.5">
                {item.nameEnglish} ({item.unit})
              </p>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-1 border-t border-gold/20">
              <span className="text-2xl sm:text-4xl font-extrabold text-forest-700 font-catamaran">
                ₹{discountedPrice}
              </span>
              {originalPrice > discountedPrice && (
                <span className="text-base sm:text-lg text-bark-400 line-through font-catamaran font-semibold">
                  ₹{originalPrice}
                </span>
              )}
              <span className="text-xs font-bold text-bark-500 font-lato">
                / {item.unit}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <h3 className="font-bold text-xs text-bark-400 uppercase tracking-wider">
                பொருள் விவரம் (Description)
              </h3>
              <p className="text-sm sm:text-base text-bark-800 font-tamil leading-relaxed">
                {item.descriptionTamil || "சிறந்த தரமான பொருள்."}
              </p>
              {item.descriptionEnglish && (
                <p className="text-xs sm:text-sm text-bark-600 font-lato">
                  {item.descriptionEnglish}
                </p>
              )}
            </div>

            {/* Product Uses / Benefits */}
            {item.usesTamil && item.usesTamil.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <h3 className="font-bold text-xs text-bark-400 uppercase tracking-wider">
                  பயன்கள் (Uses & Benefits)
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-bark-800 font-tamil space-y-1">
                  {item.usesTamil.map((use, idx) => (
                    <li key={idx}>{use}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-forest-100 text-forest-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 pt-1">
              <Package size={16} className={item.stock > 10 ? "text-forest-700" : "text-danger"} />
              <span
                className={`text-xs sm:text-sm font-bold ${
                  item.stock > 10 ? "text-forest-700" : "text-danger"
                }`}
              >
                {item.stock > 10
                  ? `இருப்பு: ${item.stock} பாக்கெட்டுகள் உள்ளன (In Stock)`
                  : `இருப்பு: ${item.stock} மட்டுமே உள்ளது! (Low Stock)`}
              </span>
            </div>

            {/* Qty Stepper & Desktop Add Button */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <div className="flex items-center border border-bark-200 rounded-none bg-cream-50 min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-11 flex items-center justify-center text-bark-800 hover:bg-forest-100 text-xl font-extrabold cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 font-bold text-bark-900 text-base border-x border-bark-200 min-w-[44px] text-center font-catamaran">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(item.stock, qty + 1))}
                  className="w-11 h-11 flex items-center justify-center text-bark-800 hover:bg-forest-100 text-xl font-extrabold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`hidden sm:flex flex-1 items-center justify-center gap-2 py-3 rounded-none font-extrabold text-base transition-all duration-300 cursor-pointer shadow-green min-h-[44px] ${
                  added
                    ? "bg-forest-700 text-cream-100"
                    : "bg-gold text-bark-900 hover:bg-gold-600"
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

            {/* Ask about this item on WhatsApp link */}
            <div className="pt-3">
              <a
                href={getWhatsAppLink(waInquiryMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#25D366] text-[#1d3d29] hover:bg-[#25D366]/10 px-4 py-2.5 rounded-none font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px] w-full sm:w-auto justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#25D366] shrink-0"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.591-1.048 3.834 3.792-1.026.999.598zm11.383-7.51c-.287-.144-1.701-.84-1.963-.935-.262-.096-.453-.144-.645.144-.192.288-.744.935-.912 1.127-.168.192-.336.216-.623.072-.287-.144-1.215-.448-2.315-1.428-.857-.764-1.435-1.707-1.603-1.995-.168-.288-.018-.444.126-.587.13-.129.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.645-1.585-.883-2.16-.232-.559-.467-.483-.645-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.985-1.008 2.401 0 1.417 1.032 2.784 1.176 2.977.144.192 2.033 3.103 4.925 4.35.688.297 1.225.475 1.644.609.691.22 1.32.189 1.817.115.555-.083 1.701-.696 1.94-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
                </svg>
                <span>இந்த பொருளைப் பற்றி WhatsApp-ல் கேளுங்கள் / Ask about this item on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

        {/* Related Items */}
        {related.length > 0 && (
          <section className="mt-12 pt-6 border-t border-gold/30 space-y-4">
            <div className="flex items-center gap-2.5">
              <GoldLotusOrnament size={20} />
              <h2 className="text-lg sm:text-2xl font-extrabold font-tamil text-bark-900">
                தொடர்புடைய பொருட்கள் <span className="font-playfair text-base font-normal text-forest-700 ml-1">(Related Products)</span>
              </h2>
            </div>

            <div className="flex sm:grid sm:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
              {related.map((r) => (
                <div key={r.id} className="snap-start w-[155px] sm:w-auto shrink-0">
                  <ItemCard item={r} showCategories={true} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf6ee] border-t-2 border-gold p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <p className="text-[10px] text-bark-400 font-bold uppercase tracking-wider">மொத்தம் (Total)</p>
          <p className="text-xl font-extrabold text-forest-700 font-catamaran leading-none">
            ₹{(discountedPrice * qty).toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-none font-extrabold text-sm transition-all duration-200 cursor-pointer min-h-[44px] ${
            added
              ? "bg-forest-700 text-cream-100"
              : "bg-gold text-bark-900 shadow-green active:scale-98"
          }`}
        >
          {added ? (
            <>
              <CheckCircle size={16} /> சேர்க்கப்பட்டது!
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> கூடையில் சேர்
            </>
          )}
        </button>
      </div>
    </PageTransition>
  );
}
