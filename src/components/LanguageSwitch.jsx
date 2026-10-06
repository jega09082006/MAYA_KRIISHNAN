import React from "react";
import { Globe } from "lucide-react";
import { useLang } from "../context/LanguageContext";

/**
 * Globe-icon language toggle button.
 * Shows the language you can switch TO ("English" when in Tamil, "தமிழ்" when in English).
 * 44×44 min touch target, gold outline, square corners.
 * The <html> element has .lang-ta / .lang-en which drives a 200ms opacity fade
 * (see index.css .lang-transition). Respects prefers-reduced-motion.
 */
export default function LanguageSwitch({ className = "" }) {
  const { lang, toggleLang } = useLang();

  // Label shows where you WILL go, not where you are
  const targetLabel = lang === "ta" ? "English" : "தமிழ்";
  const ariaLabel = lang === "ta"
    ? "Change language to English"
    : "மொழியை தமிழுக்கு மாற்று";

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={[
        "inline-flex items-center justify-center gap-1.5",
        "min-h-[44px] min-w-[44px] px-2.5",
        "bg-[#12281b] hover:bg-[#1d3d29]",
        "text-cream-100 border border-gold/60",
        "rounded-none shadow-sm",
        "transition-colors duration-150",
        "cursor-pointer active:scale-95",
        className,
      ].join(" ")}
    >
      <Globe size={17} className="text-gold-300 shrink-0" aria-hidden="true" />
      <span className="font-extrabold text-xs font-catamaran text-gold-300 tracking-wide leading-none whitespace-nowrap">
        {targetLabel}
      </span>
    </button>
  );
}
