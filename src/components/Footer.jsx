import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Globe, MessageCircle, Send, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent block leading-tight">
                  MAYA_KRISHNAN
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  மாயகிருஷ்ணன்
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              பாரம்பரிய பலசரக்கு & நாட்டு மருந்து — Pure herbs, spices, and traditional products from our shop to your home.
            </p>
            <div className="flex gap-3 mt-4">
              {[Globe, MessageCircle, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-pink flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">பிரிவுகள் (Categories)</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                "Traditional / Grocery",
                "Herbal / Traditional",
                "Food / Prepared Product",
                "Oil",
                "Medicine / Herbal Product",
              ].map((c) => (
                <li key={c}>
                  <Link to="/shop" className="hover:text-brand-orange transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">கடை தகவல் (Store Info)</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["எங்களை பற்றி (About Us)", "பாரம்பரிய முறை (Our Heritage)", "நாட்டு மருந்து விளக்கம்", "கடை முகவரி (Location)", "தொடர்புக்கு (Contact Us)"].map((i) => (
                <li key={i}>
                  <a href="#" className="hover:text-brand-pink transition-colors">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">உதவி (Support)</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["உதவி மையம் (Help Center)", "ஆர்டர் நிலை (Track Order)", "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)", "தொடர்பு கொள்ள (Contact)"].map((i) => (
                <li key={i}>
                  <a href="#" className="hover:text-brand-sky transition-colors">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© 2024 MAYA_KRISHNAN (மாயகிருஷ்ணன்). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-brand-pink mx-1 fill-brand-pink" /> in Tamil Nadu, India
          </p>
        </div>
      </div>
    </footer>
  );
}
