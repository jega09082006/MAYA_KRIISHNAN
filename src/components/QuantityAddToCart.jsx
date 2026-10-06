import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useLang } from "../context/LanguageContext";

/**
 * QuantityAddToCart
 *
 * Cart-synced add/stepper block used on every surface that shows an item.
 *
 * cartQty = 0   → "Add to Cart • ₹X" button (+ pre-add stepper above it)
 * cartQty ≥ 1   → forest-green cart stepper  [ − | N in cart | + ]
 *                  "Buy Now" button below
 *                  On detail page (compact=false): "View Cart" link + line total
 *
 * Props
 * ──────
 *   item     {object}  full item (id, price, stock, unit required)
 *   compact  {bool}    true = card mode (14 px font, no View Cart / line total)
 *
 * Height contract (compact / card mode)  ← MUST NOT CHANGE
 * ─────────────────────────────────────────────────────────
 *   row 1  stepper          44 px
 *   gap                      8 px
 *   row 2  add/buy-now      44 px
 *   gap                      8 px
 *   row 3  buy-now/viewcart 44 px
 *   ────────────────────────
 *   total                  148 px   (minHeight enforced on wrapper)
 *
 * In BOTH states (cartQty=0 and cartQty≥1) the same three 44-px rows are
 * rendered, so cards never shift layout when the state transitions.
 */
export default function QuantityAddToCart({ item, compact = false }) {
  const { cart, addToCart, updateCartQty, removeFromCart, getItemPrice } = useStore();
  const { t }    = useLang();
  const navigate = useNavigate();

  // ── Cart-synced quantity ─────────────────────────────────────────────
  const cartEntry = cart.find((c) => c.id === item.id);
  const cartQty   = cartEntry?.qty ?? 0;

  // ── Pre-add stepper (only visible when cartQty === 0) ────────────────
  // This is purely local UI state for choosing how many to add the first time.
  const [preQty, setPreQty] = useState(1);

  // Flash "Added ✓" for 1.2 s after first add
  const [justAdded, setJustAdded] = useState(false);

  // Reset preQty to 1 whenever this item is removed from the cart
  useEffect(() => {
    if (cartQty === 0) setPreQty(1);
  }, [cartQty]);

  const unitPrice    = getItemPrice(item);
  const isOutOfStock = (item.stock ?? 0) <= 0;
  const maxQty       = Math.max(1, item.stock ?? 1);
  const atMax        = cartQty >= maxQty;

  const fs = compact ? "text-[14px]" : "text-[15px]";

  // ── Handlers ─────────────────────────────────────────────────────────

  const handlePreDec = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setPreQty((q) => Math.max(1, q - 1));
  }, []);

  const handlePreInc = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setPreQty((q) => Math.min(maxQty, q + 1));
  }, [maxQty]);

  // First add: put preQty items into the real cart
  const handleFirstAdd = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(item, preQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }, [addToCart, item, preQty, isOutOfStock]);

  // Cart stepper: increment by 1
  const handleCartInc = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (atMax) return;
    addToCart(item, 1);
  }, [addToCart, item, atMax]);

  // Cart stepper: decrement by 1; at 1 → remove
  const handleCartDec = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (cartQty <= 1) {
      removeFromCart(item.id);
    } else {
      updateCartQty(item.id, cartQty - 1);
    }
  }, [cartQty, removeFromCart, updateCartQty, item.id]);

  // Buy Now: ensure ≥ 1 in cart, then go to checkout
  const handleBuyNow = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (isOutOfStock) return;
    if (cartQty === 0) addToCart(item, preQty);
    navigate("/checkout");
  }, [addToCart, item, preQty, cartQty, isOutOfStock, navigate]);

  // ── OUT OF STOCK ─────────────────────────────────────────────────────
  if (isOutOfStock) {
    return (
      <div className="flex flex-col w-full" style={{ gap: 8, minHeight: compact ? 148 : undefined }}>
        {/* Row 1: disabled stepper */}
        <div className="flex items-center w-full h-[44px] rounded-[10px] border border-bark-200 bg-gray-50 opacity-40 select-none" aria-hidden="true">
          <span className="w-8 text-center text-bark-400 font-bold ml-[6px]">−</span>
          <span className="flex-1 text-center text-sm font-bold text-bark-400">1</span>
          <span className="w-8 text-center text-bark-400 font-bold mr-[6px]">+</span>
        </div>
        {/* Rows 2+3: merged out-of-stock label */}
        <div
          className={["flex items-center justify-center w-full rounded-[12px]",
            "bg-bark-100 text-bark-400 font-extrabold cursor-not-allowed select-none", fs].join(" ")}
          style={{ minHeight: compact ? 96 : 44 }}
        >
          {t("outOfStockShort")}
        </div>
      </div>
    );
  }

  // ── NORMAL: cartQty === 0 ─────────────────────────────────────────────
  if (cartQty === 0) {
    const priceStr = `₹${(unitPrice * preQty).toLocaleString("en-IN")}`;
    const addLabel = compact ? t("addShort") : `${t("addToCart")} •`;
    const doneLabel = compact ? t("addedShort") : t("addedToCart");

    return (
      <div className="flex flex-col w-full" style={{ gap: 8, minHeight: compact ? 148 : undefined }}>

        {/* Row 1: pre-add stepper (local state) */}
        <div
          className="flex items-center w-full h-[44px] rounded-[10px] border border-bark-200 bg-[#f5f1e8] overflow-hidden select-none"
          role="group"
          aria-label={t("unit")}
        >
          <button
            type="button" onClick={handlePreDec} disabled={preQty <= 1}
            aria-label="Decrease"
            className="w-8 h-8 my-auto ml-[6px] flex items-center justify-center shrink-0 bg-white border border-bark-200 rounded-[10px] font-extrabold text-bark-700 text-lg leading-none transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-forest-50 enabled:active:scale-95 cursor-pointer"
          >−</button>

          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1 overflow-hidden">
            <span className={`font-extrabold text-bark-900 font-catamaran leading-none ${compact ? "text-sm" : "text-base"}`}>
              {preQty}
            </span>
            {item.unit && (
              <span className="text-[10px] text-bark-400 font-medium font-catamaran leading-none mt-0.5 truncate max-w-full">
                {item.unit}
              </span>
            )}
          </div>

          <button
            type="button" onClick={handlePreInc} disabled={preQty >= maxQty}
            aria-label="Increase"
            className="w-8 h-8 my-auto mr-[6px] flex items-center justify-center shrink-0 bg-white border border-bark-200 rounded-[10px] font-extrabold text-bark-700 text-lg leading-none transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-forest-50 enabled:active:scale-95 cursor-pointer"
          >+</button>
        </div>

        {/* Row 2: Add to Cart button */}
        <button
          type="button" onClick={handleFirstAdd}
          aria-live="polite"
          className={["w-full h-[44px] flex items-center justify-center gap-1.5 shrink-0",
            "rounded-[12px] font-extrabold text-white",
            "transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap", fs,
            justAdded ? "bg-forest-600" : "bg-[#1d3d29] hover:bg-forest-700 shadow-sm active:scale-[0.98]",
          ].join(" ")}
        >
          {justAdded ? (
            <span className="flex items-center gap-1.5 truncate">
              <span className="text-gold shrink-0" aria-hidden="true">✓</span>
              <span className="truncate">{doneLabel}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 truncate min-w-0">
              <ShoppingCart size={compact ? 14 : 16} className="text-[#d99c2b] shrink-0" aria-hidden="true" />
              <span className="truncate min-w-0">{addLabel} {priceStr}</span>
            </span>
          )}
        </button>

        {/* Row 3: Buy Now */}
        <button
          type="button" onClick={handleBuyNow}
          className={["w-full h-[44px] flex items-center justify-center shrink-0",
            "rounded-[12px] font-extrabold bg-white border border-bark-200 text-[#1d3d29]",
            "hover:bg-forest-50 active:scale-[0.98] transition-all duration-200 cursor-pointer",
            "overflow-hidden whitespace-nowrap", fs,
          ].join(" ")}
        >
          {t("buyNow")}
        </button>
      </div>
    );
  }

  // ── CART ACTIVE: cartQty ≥ 1 ────────────────────────────────────────
  const lineTotal = unitPrice * cartQty;
  const lineTotalStr = `₹${lineTotal.toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col w-full" style={{ gap: 8, minHeight: compact ? 148 : undefined }}>

      {/* Row 1: Cart-synced stepper — forest green bar */}
      <div
        className="flex items-center w-full h-[44px] rounded-[10px] bg-[#1d3d29] overflow-hidden select-none"
        role="group"
        aria-label={t("navCart")}
      >
        {/* Decrement / remove */}
        <button
          type="button" onClick={handleCartDec}
          aria-label="Remove one"
          className="w-10 h-full flex items-center justify-center shrink-0 text-[#d99c2b] font-extrabold text-xl leading-none hover:bg-forest-700 active:scale-95 transition-colors cursor-pointer"
        >−</button>

        {/* Centre: qty + "in cart" */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 overflow-hidden">
          <span className={`font-extrabold text-white font-catamaran leading-none ${compact ? "text-sm" : "text-base"}`}>
            {cartQty}
          </span>
          <span className="text-[10px] text-white/70 font-catamaran leading-none mt-0.5 truncate max-w-full">
            {t("inCart")}
          </span>
        </div>

        {/* Increment or max-stock indicator */}
        <button
          type="button" onClick={handleCartInc} disabled={atMax}
          aria-label={atMax ? t("maxStock") : "Add one more"}
          title={atMax ? t("maxStock") : undefined}
          className="w-10 h-full flex items-center justify-center shrink-0 text-[#d99c2b] font-extrabold text-xl leading-none hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-colors cursor-pointer"
        >+</button>
      </div>

      {/* Row 2: Buy Now (always shown; adds ≥1 then navigates) */}
      <button
        type="button" onClick={handleBuyNow}
        className={["w-full h-[44px] flex items-center justify-center shrink-0",
          "rounded-[12px] font-extrabold bg-gold text-bark-900",
          "hover:bg-gold-600 active:scale-[0.98] transition-all duration-200 cursor-pointer",
          "overflow-hidden whitespace-nowrap shadow-sm", fs,
        ].join(" ")}
      >
        {t("buyNow")}
      </button>

      {/* Row 3: View Cart + line total (detail page) OR just View Cart (compact) */}
      <Link
        to="/cart"
        onClick={(e) => e.stopPropagation()}
        className={["w-full h-[44px] flex items-center justify-center gap-2 shrink-0",
          "rounded-[12px] font-extrabold bg-white border border-bark-200 text-[#1d3d29]",
          "hover:bg-forest-50 active:scale-[0.98] transition-all duration-200",
          "overflow-hidden whitespace-nowrap", fs,
        ].join(" ")}
      >
        <span className="truncate">{t("viewCart")}</span>
        {/* Show line total on detail page where there's more space */}
        {!compact && (
          <span className="font-catamaran text-forest-700 shrink-0 ml-1">{lineTotalStr}</span>
        )}
      </Link>
    </div>
  );
}
