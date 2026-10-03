import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ItemCard from "../../components/ItemCard";
import { useStore } from "../../context/StoreContext";

export default function HomePage() {
  const { items, currentUser } = useStore();

  // Create a mixed list of products by interleaving across different categories
  const mixedItems = useMemo(() => {
    if (!items || items.length === 0) return [];

    const categoryBuckets = {};
    items.forEach((item) => {
      const primaryCat = item.categoryIds?.[0] || "cat-other";
      if (!categoryBuckets[primaryCat]) categoryBuckets[primaryCat] = [];
      categoryBuckets[primaryCat].push(item);
    });

    const bucketKeys = Object.keys(categoryBuckets);
    const mixed = [];
    const maxLength = Math.max(...Object.values(categoryBuckets).map((b) => b.length));

    for (let i = 0; i < maxLength; i++) {
      for (const key of bucketKeys) {
        if (categoryBuckets[key][i]) {
          mixed.push(categoryBuckets[key][i]);
        }
      }
    }
    return mixed;
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <Navbar />

      {/* Main Content — Mixed Products Grid */}
      <div className="py-6 sm:py-8 space-y-6 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center shadow-md">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                {currentUser ? `வணக்கம், ${currentUser.name}!` : "பொருட்கள் (All Products)"}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                இயற்கை மூலிகைகள் & பாரம்பரிய பலசரக்குகள் (Herbs, Spices & Medicines)
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-orange hover:text-orange-600 transition-colors"
          >
            Shop Catalogue ({items.length} items) <ArrowRight size={15} />
          </Link>
        </div>

        {/* Unified Mixed Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {mixedItems.map((item) => (
            <ItemCard key={item.id} item={item} showCategories={false} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
