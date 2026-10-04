import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ExternalLink, Heart } from "lucide-react";
import { shopInfo } from "../data/shopInfo";
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

              {/* Phone Click-to-call */}
              <div className="flex items-center gap-2.5">
                <Phone size={18} className="text-gold-300 shrink-0" />
                <a
                  href={shopInfo.phoneLink}
                  className="min-h-[44px] flex items-center hover:text-gold transition-colors text-cream-100 font-bold"
                >
                  அழைக்க: {shopInfo.phoneDisplay}
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
