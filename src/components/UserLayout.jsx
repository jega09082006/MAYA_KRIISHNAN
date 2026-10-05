import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-storefront text-bark-900">
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-24">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
