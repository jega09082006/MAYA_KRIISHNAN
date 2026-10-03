import React from "react";
import { Tag, Percent, Zap } from "lucide-react";

export default function OfferBadge({ offer, originalPrice }) {
  if (!offer) return null;

  let label = "";
  let classes = "";

  if (offer.type === "item") {
    if (offer.discountType === "percent") {
      label = `${offer.discountValue}% OFF`;
      classes = "bg-gradient-to-r from-brand-orange to-yellow-400 text-white";
    } else {
      label = `₹${offer.discountValue} OFF`;
      classes = "bg-gradient-to-r from-brand-pink to-rose-500 text-white";
    }
  } else if (offer.type === "combo") {
    label = "COMBO DEAL";
    classes = "bg-gradient-to-r from-brand-purple to-pink-600 text-white";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${classes}`}
    >
      {offer.type === "combo" ? <Zap size={11} /> : <Percent size={11} />}
      {label}
    </span>
  );
}
