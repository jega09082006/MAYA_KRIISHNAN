import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";
import { useLang } from "../context/LanguageContext";

/**
 * Wraps all storefront pages.
 * The outer div gets a 200ms opacity fade whenever the language changes,
 * honouring prefers-reduced-motion via the .lang-transition CSS class.
 */
export default function UserLayout() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [lang]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-storefront text-bark-900 lang-transition`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-24">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
