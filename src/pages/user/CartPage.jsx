import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { getItemImage, EG_ICON } from "../../utils/images";

export default function CartPage() {
  const {
    cart, removeFromCart, updateCartQty, clearCart, cartTotal, getItemPrice, items,
  } = useStore();
  const { lang, t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.setProperty("--bottom-bar-height", "72px");
    return () => {
      document.documentElement.style.setProperty("--bottom-bar-height", "0px");
    };
  }, []);

  const grandTotal = cartTotal();
  const totalQty   = cart.reduce((sum, i) => sum + i.qty, 0);

  if (cart.length === 0) {
    return (
      <PageTransition className="flex flex-col bg-storefront text-bark-900">
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 px-4">
          <img src={EG_ICON} alt="Empty Cart" className="w-24 h-24 sm:w-32 sm:h-32 object-contain opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-bark-900 font-catamaran text-center">
            {t("emptyCartTitle")}
          </h2>
          <p className="text-bark-600 text-sm sm:text-base text-center max-w-md font-catamaran">
            {t("emptyCartSub")}
          </p>
          <Link
            to="/shop"
            className="bg-gold text-bark-900 font-extrabold px-6 py-3 rounded-none hover:bg-gold-600 transition-all shadow-green text-sm sm:text-base flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <ShoppingBag size={18} />
            <span>{t("shopNowCta")}</span>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 w-full">

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-gold/30 pb-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-catamaran text-gold-600 tracking-tight">
              {t("cartTitle")}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-bark-700">
              {totalQty} {t("cartCountSuffix")}
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-danger hover:text-red-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 px-3 py-2 border border-danger/30 rounded-none hover:bg-danger/10 transition-colors cursor-pointer min-h-[44px]"
          >
            <Trash2 size={16} />
            <span>{t("clearCart")}</span>
          </button>
        </div>

        {/* Cart Item List */}
        <div className="space-y-4">
          {cart.map((cartItem) => {
            // Resolve full item from master list; skip if the item was deleted
            const item = items.find((i) => i.id === cartItem.id);
            if (!item) return null;

            const itemPrice = getItemPrice(item);
            const lineTotal = itemPrice * cartItem.qty;

            const displayName = lang === "ta"
              ? (item.tamilName || item.englishName)
              : (item.englishName || item.tamilName);

            return (
              <div
                key={cartItem.id}
                className="bg-[#faf6ee] p-4 border border-gold/30 shadow-green flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-cream-100 border border-gold/30 p-1 flex items-center justify-center">
                    <img
                      src={getItemImage(item)}
                      alt={displayName}
                      onError={(e) => { e.currentTarget.src = EG_ICON; }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/item/${item.id}`}
                      className="font-extrabold font-catamaran text-bark-900 hover:text-forest-700 text-base sm:text-lg leading-snug block truncate"
                    >
                      {displayName}
                    </Link>
                    <p className="text-xs font-bold text-bark-500 truncate">{item.unit}</p>
                    <p className="text-sm font-extrabold text-forest-700 font-catamaran mt-1">
                      ₹{itemPrice.toLocaleString("en-IN")} / {item.unit}
                    </p>
                  </div>
                </div>

                {/* Qty Stepper & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-gold/20 pt-3 sm:pt-0">
                  <div className="flex items-center border border-bark-200 bg-cream-50 rounded-none min-h-[44px]">
                    <button type="button" onClick={() => updateCartQty(item.id, cartItem.qty - 1)} className="w-10 h-10 flex items-center justify-center text-bark-800 hover:bg-forest-100 font-extrabold cursor-pointer">−</button>
                    <span className="px-3 font-bold text-bark-900 text-sm border-x border-bark-200 min-w-[36px] text-center font-catamaran">{cartItem.qty}</span>
                    <button type="button" onClick={() => updateCartQty(item.id, cartItem.qty + 1)} className="w-10 h-10 flex items-center justify-center text-bark-800 hover:bg-forest-100 font-extrabold cursor-pointer">+</button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <p className="text-xs text-bark-400 font-bold uppercase tracking-wider">{t("lineTotal")}</p>
                    <p className="text-base sm:text-lg font-extrabold text-forest-700 font-catamaran">
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-bark-400 hover:text-danger p-2 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-[#1d3d29] text-cream-100 p-6 border border-gold/40 shadow-2xl space-y-4">
          <h2 className="font-extrabold text-xl font-catamaran text-gold-300 border-b border-gold/20 pb-2">
            {t("orderSummary")}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-cream-200">
              <span>{t("subtotal")}</span>
              <span className="font-bold font-catamaran">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-cream-200">
              <span>{t("deliveryFee")}</span>
              <span className="font-bold text-gold-300">{t("freePickup")}</span>
            </div>
            <div className="border-t border-gold/30 pt-2 flex justify-between text-lg sm:text-xl font-extrabold text-gold-400">
              <span>{t("grandTotal")}</span>
              <span className="font-catamaran">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="w-full bg-gold text-bark-900 font-extrabold py-3.5 px-6 rounded-none hover:bg-gold-600 transition-all shadow-green flex items-center justify-center gap-2 text-base cursor-pointer min-h-[44px]"
          >
            <span>{t("checkout")}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf6ee] border-t-2 border-gold p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <p className="text-[10px] text-bark-400 font-bold uppercase tracking-wider">{t("grandTotal")}</p>
          <p className="text-xl font-extrabold text-forest-700 font-catamaran leading-none">
            ₹{grandTotal.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="flex-1 bg-gold text-bark-900 font-extrabold py-3 px-4 text-sm rounded-none shadow-green flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-98"
        >
          <span>{t("checkoutShort")}</span> <ArrowRight size={16} />
        </button>
      </div>
    </PageTransition>
  );
}
