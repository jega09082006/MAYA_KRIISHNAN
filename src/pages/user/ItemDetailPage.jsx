import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Tag,
  CheckCircle,
  Package,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OfferBadge from "../../components/OfferBadge";
import ItemCard from "../../components/ItemCard";
import PageTransition from "../../components/PageTransition";
import FloatingCallButton from "../../components/FloatingCallButton";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { getItemImage, EG_ICON } from "../../utils/images";

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
      <div className="min-h-screen flex flex-col bg-storefront text-bark-900 font-lato">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-[#faf6ee] border border-bark-200 shadow-green rounded-none max-w-sm w-full">
            <img
              src={EG_ICON}
              alt="Default Icon"
              className="w-16 h-16 mx-auto mb-4 object-contain"
            />
            <h2 className="text-xl font-bold font-tamil text-bark-900 mb-4">
              பொருள் கிடைக்கவில்லை (Item not found)
            </h2>
            <button onClick={() => navigate("/shop")} className="btn-primary rounded-none cursor-pointer w-full min-h-[44px]">
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
    .slice(0, 6);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const savings = hasOffer ? item.price - discountedPrice : 0;
  const hasCustomImage = Boolean(item.image || item.imageUrl);
  const imgSrc = getItemImage(item);

  return (
    <PageTransition className="min-h-screen flex flex-col bg-storefront text-bark-900 pb-20 sm:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full box-border">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-bark-500 hover:text-forest-700 transition-colors mb-4 sm:mb-6 cursor-pointer font-bold font-lato min-h-[44px]"
        >
          <ArrowLeft size={18} /> பின்செல்ல (Back)
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Product Image Square Display */}
          <div className="bg-[#faf6ee] border border-bark-200 rounded-none aspect-square relative group flex items-center justify-center shadow-green overflow-hidden w-full max-w-md mx-auto lg:max-w-none">
            <img
              src={imgSrc}
              alt={item.tamilName || item.englishName}
              onError={(e) => {
                e.currentTarget.src = EG_ICON;
              }}
              className={`w-full h-full ${
                hasCustomImage ? "object-cover" : "object-contain p-6"
              } transition-transform duration-300`}
            />

            {hasOffer && (
              <div className="absolute top-3 left-3 z-10">
                <OfferBadge offer={offer} originalPrice={item.price} />
              </div>
            )}

            {item.unit && (
              <div className="absolute bottom-3 right-3 bg-forest-700/90 text-cream-100 text-xs font-bold px-3 py-1 rounded-full font-lato">
                அளவு: {item.unit}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 font-lato">
            {/* Categories & Suggestion Badges */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {cats.map((c) => (
                <span
                  key={c.id}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-forest-100 text-forest-800"
                >
                  {c.label}
                </span>
              ))}
              {memberGroups.map((g) => (
                <span
                  key={g.id}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-gold-100 text-bark-900 border border-gold"
                >
                  ★ {g.tamilName}
                </span>
              ))}
            </div>

            {/* Tamil Name (Primary ~24px) & English Name (Secondary) */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-tamil text-bark-900 leading-snug">
                {item.tamilName}
              </h1>
              <p className="text-sm sm:text-lg text-bark-500 font-lato font-normal mt-1">
                {item.englishName}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#faf6ee] border border-bark-200 p-4 sm:p-5 rounded-none shadow-green">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-4xl font-extrabold text-forest-700 font-catamaran">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {hasOffer && (
                  <>
                    <span className="text-lg text-bark-400 line-through font-lato">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="bg-gold text-bark-900 text-xs font-extrabold px-2.5 py-1 rounded-full font-lato">
                      தள்ளுபடி ₹{savings.toLocaleString()}!
                    </span>
                  </>
                )}
                {item.unit && (
                  <span className="text-xs sm:text-sm font-semibold text-bark-500 font-lato">
                    / {item.unit}
                  </span>
                )}
              </div>
              {hasOffer && (
                <div className="mt-2.5 flex items-center gap-2">
                  <OfferBadge offer={offer} originalPrice={item.price} />
                  <span className="text-xs sm:text-sm text-bark-700 font-bold font-lato">{offer.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#faf6ee] p-4 rounded-none border border-bark-200 space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-bark-400 font-lato">
                பொருள் விளக்கம் (Product Description)
              </h3>
              <p className="text-bark-800 leading-relaxed text-sm font-lato">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-forest-100 text-forest-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Related Items (Horizontal Swipe Row on mobile) */}
        {related.length > 0 && (
          <section className="mt-12 pt-6 border-t border-gold/30 space-y-4">
            <div className="flex items-center gap-2.5">
              <GoldLotusOrnament size={20} />
              <h2 className="text-lg sm:text-2xl font-extrabold font-tamil text-bark-900">
                தொடர்புடைய பொருட்கள் <span className="font-playfair text-base font-normal text-forest-700 ml-1">(Related Products)</span>
              </h2>
            </div>

            {/* Mobile horizontal snap row */}
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
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

      <Footer />

      {/* Floating Call Button moved above sticky bottom bar on mobile */}
      <FloatingCallButton hasStickyBottomBar={true} />
    </PageTransition>
  );
}
