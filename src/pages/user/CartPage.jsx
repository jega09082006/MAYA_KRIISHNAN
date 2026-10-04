import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import FloatingCallButton from "../../components/FloatingCallButton";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { getItemImage, EG_ICON } from "../../utils/images";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotal,
    getItemPrice,
    items,
  } = useStore();

  if (cart.length === 0) {
    return (
      <PageTransition className="min-h-screen flex flex-col bg-storefront text-bark-900 font-lato">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 px-4">
          <img
            src={EG_ICON}
            alt="Empty Cart"
            className="w-20 h-20 object-contain opacity-60"
          />
          <h2 className="text-xl sm:text-3xl font-extrabold font-tamil text-bark-900 text-center">
            கூடை காலியாக உள்ளது (Your cart is empty)
          </h2>
          <p className="text-bark-500 text-center max-w-sm text-xs sm:text-sm font-lato">
            தரமான பலசரக்கு மற்றும் நாட்டு மருந்துகளைத் தேர்வு செய்து கூடையில் சேர்க்கவும்.
          </p>
          <Link to="/shop" className="bg-gold text-bark-900 font-extrabold px-6 py-3 rounded-none hover:bg-gold-600 shadow-green flex items-center justify-center gap-2 text-sm sm:text-base font-lato min-h-[44px]">
            <ShoppingBag size={18} /> பொருட்கள் பார்க்க (Shop Now)
          </Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const packingCharge = 30;
  const grandTotal = cartTotal + packingCharge;

  return (
    <PageTransition className="min-h-screen flex flex-col bg-storefront text-bark-900 font-lato pb-20 sm:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full box-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gold/30 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <GoldLotusOrnament size={22} />
            <h1 className="text-xl sm:text-2xl font-extrabold font-tamil text-bark-900 truncate">
              உங்கள் கூடை <span className="font-playfair text-sm sm:text-lg font-normal text-forest-700 ml-1">({cart.length} பொருட்கள்)</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs sm:text-sm text-danger hover:text-red-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-lato shrink-0 min-h-[44px]"
          >
            <Trash2 size={15} /> <span className="hidden sm:inline">அனைத்தையும் நீக்கு</span> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items as Stacked Cards */}
          <div className="lg:col-span-2 space-y-3.5">
            {cart.map((cartItem) => {
              const fullItem = items.find((i) => i.id === cartItem.id) || cartItem;
              const unitPrice = getItemPrice(fullItem);

              const hasCustomImage = Boolean(fullItem.image || fullItem.imageUrl);
              const imgSrc = getItemImage(fullItem);

              return (
                <div
                  key={cartItem.id}
                  className="bg-[#faf6ee] border border-bark-200 rounded-none p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-green sm:items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 64px Thumbnail */}
                    <Link
                      to={`/item/${cartItem.id}`}
                      className="flex-shrink-0 w-16 h-16 bg-[#faf6ee] border border-bark-200 rounded-none overflow-hidden flex items-center justify-center p-1 shadow-sm"
                    >
                      <img
                        src={imgSrc}
                        alt={fullItem.tamilName || cartItem.name}
                        onError={(e) => {
                          e.currentTarget.src = EG_ICON;
                        }}
                        className={`w-full h-full ${
                          hasCustomImage ? "object-cover" : "object-contain"
                        }`}
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/item/${cartItem.id}`}
                        className="font-extrabold text-bark-900 font-tamil hover:text-forest-700 transition-colors text-base block leading-tight truncate"
                      >
                        {fullItem.tamilName || cartItem.name}
                      </Link>
                      <p className="text-xs text-bark-400 font-lato mt-0.5 font-normal truncate">
                        {fullItem.englishName} {fullItem.unit ? `(${fullItem.unit})` : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1 font-catamaran">
                        <span className="font-extrabold text-forest-700 text-sm">
                          ₹{unitPrice.toLocaleString()}
                        </span>
                        {unitPrice < fullItem.price && (
                          <span className="text-xs text-bark-400 line-through">
                            ₹{fullItem.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-bark-200/60">
                    {/* Qty Stepper */}
                    <div className="flex items-center border border-bark-200 rounded-none text-sm bg-cream-50 min-h-[44px]">
                      <button
                        type="button"
                        onClick={() => updateCartQty(cartItem.id, cartItem.qty - 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-forest-100 text-bark-800 font-extrabold cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 font-bold text-bark-900 border-x border-bark-200 min-w-[36px] text-center font-catamaran">
                        {cartItem.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(cartItem.id, cartItem.qty + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-forest-100 text-bark-800 font-extrabold cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="font-extrabold text-base text-forest-700 font-catamaran min-w-[70px] text-right">
                      ₹{(unitPrice * cartItem.qty).toLocaleString()}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(cartItem.id)}
                      className="text-danger hover:text-red-700 p-2.5 rounded-none transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-red-200 bg-red-50/50"
                      title="நீக்கு"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#faf6ee] border border-bark-200 rounded-none p-5 sm:p-6 sticky top-20 shadow-green space-y-4">
              <h3 className="font-bold text-bark-900 text-base sm:text-lg font-playfair border-b border-bark-200 pb-3">
                ஆர்டர் விவரம் (Order Summary)
              </h3>

              <div className="space-y-3 text-sm font-lato">
                <div className="flex justify-between text-bark-600">
                  <span>பொருட்கள் மொத்தம் (Subtotal)</span>
                  <span className="font-bold text-bark-900 font-catamaran">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-bark-600">
                  <span>பேக்கிங் கட்டணம் (Packing)</span>
                  <span className="font-bold text-bark-900 font-catamaran">₹{packingCharge}</span>
                </div>
                <div className="border-t border-bark-200 pt-3 flex justify-between text-base font-extrabold text-bark-900">
                  <span>மொத்த தொகை (Total)</span>
                  <span className="text-xl sm:text-2xl text-forest-700 font-extrabold font-catamaran">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert("🎉 ஆர்டர் பதிவு செய்யப்பட்டது! (Demo mode — no real checkout)")}
                className="hidden sm:flex bg-gold text-bark-900 hover:bg-gold-600 font-extrabold w-full items-center justify-center gap-2 py-3 text-base cursor-pointer rounded-none shadow-green transition-all min-h-[44px]"
              >
                ஆர்டர் செய் (Place Order) <ArrowRight size={18} />
              </button>

              <Link
                to="/shop"
                className="block text-center text-xs sm:text-sm text-forest-700 hover:text-gold font-bold transition-colors font-lato pt-2"
              >
                ← மேலும் பொருட்களைப் பார்க்க
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf6ee] border-t-2 border-gold p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <p className="text-[10px] text-bark-400 font-bold uppercase tracking-wider">மொத்தம் (Total)</p>
          <p className="text-xl font-extrabold text-forest-700 font-catamaran leading-none">
            ₹{grandTotal.toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("🎉 ஆர்டர் பதிவு செய்யப்பட்டது! (Demo mode — no real checkout)")}
          className="flex-1 bg-gold text-bark-900 font-extrabold py-3 px-4 text-sm rounded-none shadow-green flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-98"
        >
          <span>ஆர்டர் செய் (Checkout)</span> <ArrowRight size={16} />
        </button>
      </div>

      <Footer />

      {/* Floating Call Button moved above sticky bottom bar */}
      <FloatingCallButton hasStickyBottomBar={true} />
    </PageTransition>
  );
}
