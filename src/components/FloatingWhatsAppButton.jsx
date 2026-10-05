import React, { useState, useEffect } from "react";
import { getWhatsAppLink } from "../data/shopInfo";

export default function FloatingWhatsAppButton() {
  const [initialShow, setInitialShow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialShow(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const showLabel = initialShow || isHovered;

  return (
    <div
      className="fixed right-4 sm:right-6 z-40 group pointer-events-auto"
      style={{
        bottom: "calc(var(--bottom-bar-height, 0px) + 24px + env(safe-area-inset-bottom, 0px))",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3 Outward Wave Rings (behind button) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
        <span
          className="wa-wave-ring absolute inset-0 rounded-full bg-[#25D366]/45 pointer-events-none"
          style={{
            animationDelay: "0s",
            animationPlayState: showLabel ? "paused" : "running",
          }}
        />
        <span
          className="wa-wave-ring absolute inset-0 rounded-full bg-[#25D366]/45 pointer-events-none"
          style={{
            animationDelay: "0.8s",
            animationPlayState: showLabel ? "paused" : "running",
          }}
        />
        <span
          className="wa-wave-ring absolute inset-0 rounded-full bg-[#25D366]/45 pointer-events-none"
          style={{
            animationDelay: "1.6s",
            animationPlayState: showLabel ? "paused" : "running",
          }}
        />
      </div>

      {/* Main WhatsApp Floating Button */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-ல் எங்களுடன் பேசுங்கள் / Chat with us on WhatsApp"
        className="wa-pulse-btn relative z-10 flex items-center justify-center w-[60px] h-[60px] sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 transition-all duration-200 shadow-[0_6px_18px_rgba(37,211,102,0.45)] cursor-pointer"
        style={{
          animationPlayState: showLabel ? "paused" : "running",
        }}
      >
        {/* Official WhatsApp Logo SVG (white speech bubble with handset, 30px) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white shrink-0"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.591-1.048 3.834 3.792-1.026.999.598zm11.383-7.51c-.287-.144-1.701-.84-1.963-.935-.262-.096-.453-.144-.645.144-.192.288-.744.935-.912 1.127-.168.192-.336.216-.623.072-.287-.144-1.215-.448-2.315-1.428-.857-.764-1.435-1.707-1.603-1.995-.168-.288-.018-.444.126-.587.13-.129.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.645-1.585-.883-2.16-.232-.559-.467-.483-.645-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.985-1.008 2.401 0 1.417 1.032 2.784 1.176 2.977.144.192 2.033 3.103 4.925 4.35.688.297 1.225.475 1.644.609.691.22 1.32.189 1.817.115.555-.083 1.701-.696 1.94-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
        </svg>

        {/* Mouse-only Hover Label (Hidden on touch devices via @media (hover: hover)) */}
        <div
          className={`hidden [@media(hover:hover)]:block absolute right-full mr-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none ${
            showLabel
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2"
          }`}
        >
          <div className="bg-[#FAF6EE] text-[#1d3d29] px-3.5 py-1.5 rounded-none border border-[#25D366]/40 shadow-[0_4px_14px_rgba(37,211,102,0.3)] text-right whitespace-nowrap">
            <p className="font-bold text-xs sm:text-sm font-tamil leading-tight">
              WhatsApp-ல் பேசுங்கள்
            </p>
            <p className="text-[10px] sm:text-xs font-semibold text-[#1d3d29]/80 font-lato leading-tight">
              Chat with us
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
