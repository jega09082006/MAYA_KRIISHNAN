import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, CheckCircle2, ArrowRight } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { getItemImage, EG_ICON } from "../../utils/images";

/**
 * CheckoutPage — protected (requires login).
 * Currently a demo confirmation screen; replace with real payment flow later.
 * The auth guard in ProtectedRoute ensures only logged-in users reach here.
 */
export default function CheckoutPage() {
  const { cart, items, cartTotal, getItemPrice, currentUser, clearCart } = useStore();
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const grandTotal = cartTotal();
  const totalQty   = cart.reduce((sum, i) => sum + i.qty, 0);

  // Empty cart → redirect to shop
  if (cart.length === 0) {
    return (
      <PageTransition className="flex flex-col bg-storefront text-bark-900">
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 px-4">
          <img src={EG_ICON} alt="Empty Cart" className="w-24 h-24 object-contain opacity-70" />
          <h2 className="text-2xl font-extrabold font-catamaran text-bark-900 text-center">
            {t("emptyCartTitle")}
          </h2>
          <p className="text-bark-600 text-sm text-center max-w-sm font-catamaran">
            {t("emptyCartSub")}
          </p>
          <Link
            to="/shop"
            className="bg-gold text-bark-900 font-extrabold px-6 py-3 rounded-none hover:bg-gold-600 transition-all shadow-green flex items-center gap-2 min-h-[44px]"
          >
            <ShoppingBag size={18} /> {t("shopNowCta")}
          </Link>
        </div>
      </PageTransition>
    );
  }

  function handlePlaceOrder() {
    // Demo — in production replace with real payment/order API call
    clearCart();
    navigate("/", { replace: true });
    // A real app would navigate to an order-confirmation page
    alert(`🎉 ${t("checkoutDemoMsg")}`);
  }

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 w-full">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gold/30 pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 text-bark-600 hover:text-bark-900 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label={t("backToPrevious")}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <GoldLotusOrnament size={22} />
            <h1 className="text-xl sm:text-3xl font-extrabold font-catamaran text-gold-600 tracking-tight">
              {t("checkoutTitle")}
            </h1>
          </div>
        </div>

        {/* Logged-in user greeting */}
        <div className="flex items-center gap-2 bg-forest-50 border border-forest-200 px-4 py-3 rounded-none">
          <CheckCircle2 size={18} className="text-forest-700 shrink-0" />
          <p className="text-sm font-bold font-catamaran text-forest-800">
            {t("loggedInAs")} <span className="text-forest-700">{currentUser?.name}</span>
          </p>
        </div>

        {/* Order lines */}
        <div className="bg-[#faf6ee] border border-gold/30 shadow-green divide-y divide-bark-200">
          {cart.map((cartItem) => {
            const item = items.find((i) => i.id === cartItem.id);
            if (!item) return null;
            const linePrice = getItemPrice(item) * cartItem.qty;
            const name = lang === "ta"
              ? (item.tamilName || item.englishName)
              : (item.englishName || item.tamilName);
            return (
              <div key={cartItem.id} className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 shrink-0 bg-cream-100 border border-gold/20 p-1 flex items-center justify-center">
                  <img
                    src={getItemImage(item)}
                    alt={name}
                    onError={(e) => { e.currentTarget.src = EG_ICON; }}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold font-catamaran text-bark-900 text-sm truncate">{name}</p>
                  <p className="text-xs text-bark-500">{item.unit} × {cartItem.qty}</p>
                </div>
                <p className="font-extrabold font-catamaran text-forest-700 shrink-0">
                  ₹{linePrice.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary + CTA */}
        <div className="bg-[#1d3d29] text-cream-100 p-6 border border-gold/40 shadow-2xl space-y-4">
          <h2 className="font-extrabold text-lg font-catamaran text-gold-300 border-b border-gold/20 pb-2">
            {t("orderSummary")}
          </h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-cream-200">
              <span>{t("subtotal")} ({totalQty} {t("cartCountSuffix")})</span>
              <span className="font-bold font-catamaran">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-cream-200">
              <span>{t("deliveryFee")}</span>
              <span className="font-bold text-gold-300">{t("freePickup")}</span>
            </div>
            <div className="border-t border-gold/30 pt-2 flex justify-between text-lg font-extrabold text-gold-400">
              <span>{t("grandTotal")}</span>
              <span className="font-catamaran">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            className="w-full bg-gold text-bark-900 font-extrabold py-3.5 px-6 rounded-none hover:bg-gold-600 transition-all shadow-green flex items-center justify-center gap-2 text-base cursor-pointer min-h-[44px]"
          >
            <span>{t("placeOrder")}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
