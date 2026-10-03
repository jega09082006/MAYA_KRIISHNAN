import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useStore } from "../../context/StoreContext";
import { getEmojiGradient } from "../../data/mockData";

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
      <div className="min-h-screen flex flex-col bg-[#f8faff]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-4 animate-fade-in">
          <div className="text-8xl select-none">🌿</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            கூடை காலியாக உள்ளது (Your cart is empty)
          </h2>
          <p className="text-gray-500 text-center max-w-sm text-sm">
            பாரம்பரிய பலசரக்கு மற்றும் நாட்டு மருந்துகளைத் தேர்வு செய்து கூடையில் சேர்க்கவும்.
          </p>
          <Link to="/shop" className="btn-primary flex items-center gap-2 text-base">
            <ShoppingBag size={18} /> பொருட்கள் பார்க்க (Shop Now)
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const packingCharge = 30;
  const grandTotal = cartTotal + packingCharge;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            உங்கள் கூடை ({cart.length} பொருட்கள்)
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={15} /> அனைத்தையும் நீக்கு (Clear All)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((cartItem) => {
              const fullItem = items.find((i) => i.id === cartItem.id) || cartItem;
              const unitPrice = getItemPrice(fullItem);
              const gradientClass = getEmojiGradient(fullItem.emoji);

              return (
                <div
                  key={cartItem.id}
                  className="card p-4 flex gap-4 hover:shadow-card-hover transition-shadow animate-fade-in items-center"
                >
                  {/* Emoji Tile */}
                  <Link
                    to={`/item/${cartItem.id}`}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-sm`}
                  >
                    <span className="text-3xl select-none">{fullItem.emoji || "🌿"}</span>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/item/${cartItem.id}`}
                      className="font-bold text-gray-900 hover:text-brand-orange transition-colors text-base block leading-tight"
                    >
                      {fullItem.tamilName || cartItem.name}
                    </Link>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {fullItem.englishName} {fullItem.unit ? `(${fullItem.unit})` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-extrabold text-gray-900 text-sm">
                        ₹{unitPrice.toLocaleString()}
                      </span>
                      {unitPrice < fullItem.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{fullItem.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Qty + Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(cartItem.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="நீக்கு"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden text-sm bg-white">
                      <button
                        onClick={() => updateCartQty(cartItem.id, cartItem.qty - 1)}
                        className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 font-bold transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-800 border-x border-gray-200 min-w-[32px] text-center">
                        {cartItem.qty}
                      </span>
                      <button
                        onClick={() => updateCartQty(cartItem.id, cartItem.qty + 1)}
                        className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 font-bold transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-bold text-sm text-gray-900">
                      ₹{(unitPrice * cartItem.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 text-lg mb-5">
                ஆர்டர் விவரம் (Order Summary)
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>பொருட்கள் மொத்தம் (Subtotal)</span>
                  <span className="font-bold text-gray-800">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>பேக்கிங் கட்டணம் (Packing)</span>
                  <span className="font-semibold text-gray-700">₹{packingCharge}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                  <span>மொத்த தொகை (Total)</span>
                  <span className="text-xl text-brand-orange font-bold">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => alert("🎉 ஆர்டர் பதிவு செய்யப்பட்டது! (Demo mode — no real checkout)")}
                className="btn-primary w-full text-center py-3 text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                ஆர்டர் செய் (Place Order) <ArrowRight size={18} />
              </button>

              <Link
                to="/shop"
                className="block text-center text-sm text-brand-orange hover:text-brand-pink font-semibold mt-4 transition-colors"
              >
                ← மேலும் பொருட்களைப் பார்க்க
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
