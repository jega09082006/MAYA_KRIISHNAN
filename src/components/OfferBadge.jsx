import React from "react";
import { Percent, Zap } from "lucide-react";

export default function OfferBadge({ offer }) {
  if (!offer) return null;

  let label = "";

  if (offer.type === "item") {
    if (offer.discountType === "percent") {
      label = `${offer.discountValue}% OFF`;
    } else {
      label = `₹${offer.discountValue} OFF`;
    }
  } else if (offer.type === "combo") {
    label = "COMBO DEAL";
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-gold text-bark-900 shadow-sm border border-gold-600/30 font-lato">
      {offer.type === "combo" ? <Zap size={11} /> : <Percent size={11} />}
      {label}
    </span>
  );
}
