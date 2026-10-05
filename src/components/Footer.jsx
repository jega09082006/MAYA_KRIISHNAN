import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ExternalLink, Heart } from "lucide-react";
import { shopInfo, getWhatsAppLink } from "../data/shopInfo";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-hero-mandala text-cream-100 mt-auto border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 sm:py-12 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Shop Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Logo className="w-12 h-12 border border-gold/40 shrink-0" />
              <div>
                <span className="font-extrabold text-xl text-cream-100 font-tamil block leading-tight">
                  {shopInfo.nameTamil}
                </span>
                <span className="text-xs font-bold text-gold-300 font-lato">
                  {shopInfo.nameEnglish}
                </span>
              </div>
            </div>
            <p className="text-cream-200 text-sm font-lato font-semibold mb-2">
              {shopInfo.businessTamil}
            </p>
            <p className="text-gold-200 text-xs font-lato">
              {shopInfo.businessEnglish}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-3 text-gold font-playfair tracking-wide">
              விரைவு இணைப்புகள் (Quick Links)
            </h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-1 text-sm text-cream-300 font-lato">
              <li>
                <Link to="/" className="min-h-[44px] flex items-center hover:text-gold transition-colors font-medium">
                  முகப்பு (Home)
                </Link>
              </li>
              <li>
                <Link to="/shop" className="min-h-[44px] flex items-center hover:text-gold transition-colors font-medium">
                  பொருட்கள் (Shop)
                </Link>
              </li>
              <li>
                <Link to="/about" className="min-h-[44px] flex items-center hover:text-gold transition-colors font-medium">
                  எங்களை பற்றி (About)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="min-h-[44px] flex items-center hover:text-gold transition-colors font-medium">
                  தொடர்பு கொள்ள (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Address & Contact */}
          <div>
            <h4 className="font-bold text-base mb-3 text-gold font-playfair tracking-wide">
              கடை முகவரி & தொடர்பு (Address & Contact)
            </h4>
            <div className="space-y-3 text-sm text-cream-300 font-lato">
              {/* Address as Plain Text */}
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-gold-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-cream-100">{shopInfo.addressTamil}</p>
                  <p className="text-xs text-cream-400 mt-0.5">{shopInfo.addressEnglish}</p>
                </div>
              </div>

              {/* Phone Click-to-call & WhatsApp Link */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-cream-300 font-lato">
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-gold-300 shrink-0" />
                  <a
                    href={shopInfo.phoneLink}
                    className="min-h-[44px] flex items-center hover:text-gold transition-colors text-cream-100 font-bold"
                  >
                    அழைக்க: {shopInfo.phoneDisplay}
                  </a>
                </div>
                <span className="text-gold/40">•</span>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-cream-100 font-bold hover:text-[#25D366] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#25D366] shrink-0"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.591-1.048 3.834 3.792-1.026.999.598zm11.383-7.51c-.287-.144-1.701-.84-1.963-.935-.262-.096-.453-.144-.645.144-.192.288-.744.935-.912 1.127-.168.192-.336.216-.623.072-.287-.144-1.215-.448-2.315-1.428-.857-.764-1.435-1.707-1.603-1.995-.168-.288-.018-.444.126-.587.13-.129.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.645-1.585-.883-2.16-.232-.559-.467-.483-.645-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.985-1.008 2.401 0 1.417 1.032 2.784 1.176 2.977.144.192 2.033 3.103 4.925 4.35.688.297 1.225.475 1.644.609.691.22 1.32.189 1.817.115.555-.083 1.701-.696 1.94-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Get directions link ONLY if mapsLink has a value */}
              {shopInfo.mapsLink ? (
                <div className="pt-1">
                  <a
                    href={shopInfo.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
                  >
                    <span>Get directions on Google Maps</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-gold/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-cream-400 font-lato text-center sm:text-left">
          <p>© {new Date().getFullYear()} {shopInfo.nameEnglish}. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-gold mx-1 fill-gold" /> in Aruppukkottai, Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
}
