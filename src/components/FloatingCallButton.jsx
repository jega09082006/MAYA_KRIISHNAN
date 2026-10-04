import React from "react";
import { Phone } from "lucide-react";
import { shopInfo } from "../data/shopInfo";

export default function FloatingCallButton({ hasStickyBottomBar = false }) {
  return (
    <a
      href={shopInfo.phoneLink}
      aria-label="Call Store"
      className={`sm:hidden fixed right-4 z-40 w-14 h-14 rounded-full bg-gold text-bark-900 border-2 border-gold-600 shadow-xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
        hasStickyBottomBar ? "bottom-20" : "bottom-6"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <Phone size={24} className="fill-bark-900 text-bark-900" />
    </a>
  );
}
