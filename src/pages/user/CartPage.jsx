import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import PageTransition from "../../components/PageTransition";
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

  useEffect(() => {
    document.documentElement.style.setProperty("--bottom-bar-height", "72px");
    return () => {
      document.documentElement.style.setProperty("--bottom-bar-height", "0px");
    };
  }, []);

  if (cart.length === 0) {
    return (
      <PageTransition className="flex flex-col bg-storefront text-bark-900 font-lato">
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 px-4">
          <img
            src={EG_ICON}
            alt="Empty Cart"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain opacity-80"
          />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-bark-900 font-tamil text-center">
            உங்கள் கூடை காலியாக உள்ளது (Cart is empty)
          </h2>
          <p className="text-bark-600 text-sm sm:text-base text-center max-w-md font-catamaran">
            பொருட்களை கூடையில சேர்க்க 'பொருட்கள்' பக்கத்திற்குச் செல்லவும்.
          </p>
          <Link
            to="/shop"
            className="bg-gold text-bark-900 font-extrabold px-6 py-3 rounded-none hover:bg-gold-600 transition-all shadow-green text-sm sm:text-base flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <ShoppingBag size={18} />
            <span>பொருட்களைப் பார்க்க (Shop Now)</span>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const grandTotal = cartTotal();

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900 font-lato">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 w-full">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-gold/30 pb-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-tamil text-gold-600 tracking-tight">
              வாங்கிய பொருட்கள் (Shopping Cart)
            </h1>
            <p className="text-xs sm:text-sm font-bold text-bark-700 font-lato">
              மொத்தம் {cart.reduce((sum, i) => sum + i.qty, 0)} பொருட்கள் உள்ளன
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-danger hover:text-red-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 px-3 py-2 border border-danger/30 rounded-none hover:bg-danger/10 transition-colors cursor-pointer min-h-[44px]"
          >
            <Trash2 size={16} />
            <span>கூடையைக் காலிசெய் (Clear Cart)</span>
          </button>
        </div>

        {/* Cart Item List */}
        <div className="space-y-4">
          {cart.map((cartItem) => {
            const item = items.find((i) => i.id === cartItem.id) || cartItem;
            const itemPrice = getItemPrice(item);
            const lineTotal = itemPrice * cartItem.qty;

            return (
              <div
                key={cartItem.id}
                className="bg-[#faf6ee] p-4 border border-gold/30 shadow-green flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-cream-100 border border-gold/30 p-1 flex items-center justify-center">
                    <img
                      src={getItemImage(item)}
                      alt={item.nameTamil}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/item/${item.id}`}
                      className="font-extrabold font-tamil text-bark-900 hover:text-forest-700 text-base sm:text-lg leading-snug block truncate"
                    >
                      {item.nameTamil}
                    </Link>
                    <p className="text-xs font-bold text-bark-600 font-lato truncate">
                      {item.nameEnglish} ({item.unit})
                    </p>

                    <p className="text-sm font-extrabold text-forest-700 font-catamaran mt-1">
                      ₹{itemPrice} / {item.unit}
                    </p>
                  </div>
                </div>

                {/* Quantity Stepper & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-gold/20 pt-3 sm:pt-0">
                  {/* Qty Stepper */}
                  <div className="flex items-center border border-bark-200 bg-cream-50 rounded-none min-h-[44px]">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, cartItem.qty - 1)}
                      className="w-10 h-10 flex items-center justify-center text-bark-800 hover:bg-forest-100 font-extrabold cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-3 font-bold text-bark-900 text-sm border-x border-bark-200 min-w-[36px] text-center font-catamaran">
                      {cartItem.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, cartItem.qty + 1)}
                      className="w-10 h-10 flex items-center justify-center text-bark-800 hover:bg-forest-100 font-extrabold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total Price */}
                  <div className="text-right min-w-[90px]">
                    <p className="text-xs text-bark-400 font-bold uppercase tracking-wider">
                      தொகை (Total)
                    </p>
                    <p className="text-base sm:text-lg font-extrabold text-forest-700 font-catamaran">
                      ₹{lineTotal.toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
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

        {/* Order Summary & Checkout Card */}
        <div className="bg-[#1d3d29] text-cream-100 p-6 border border-gold/40 shadow-2xl space-y-4">
          <h2 className="font-extrabold text-xl font-tamil text-gold-300 border-b border-gold/20 pb-2">
            கட்டண விவரம் (Order Summary)
          </h2>

          <div className="space-y-2 text-sm font-lato">
            <div className="flex justify-between text-cream-200">
              <span>மொத்த பொருட்கள் (Items Subtotal)</span>
              <span className="font-bold font-catamaran">₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-cream-200">
              <span>கடை டெலிவரி (Delivery Fee)</span>
              <span className="font-bold text-gold-300">இலவசம் (Free Pickup)</span>
            </div>
            <div className="border-t border-gold/30 pt-2 flex justify-between text-lg sm:text-xl font-extrabold text-gold-400">
              <span>மொத்தத் தொகை (Grand Total)</span>
              <span className="font-catamaran">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("🎉 ஆர்டர் பதிவு செய்யப்பட்டது! (Demo mode — no real checkout)")}
            className="w-full bg-gold text-bark-900 font-extrabold py-3.5 px-6 rounded-none hover:bg-gold-600 transition-all shadow-green flex items-center justify-center gap-2 text-base cursor-pointer min-h-[44px]"
          >
            <span>ஆர்டர் செய்ய தொடரவும் (Proceed to Checkout)</span>
            <ArrowRight size={18} />
          </button>
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
    </PageTransition>
  );
}
