import React, { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, Search, ChevronDown, Check, ArrowUpDown } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ItemCard from "../../components/ItemCard";
import CategoryChip from "../../components/CategoryChip";
import PageTransition from "../../components/PageTransition";
import FloatingCallButton from "../../components/FloatingCallButton";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { getItemImage, getCategoryImage, EG_ICON } from "../../utils/images";

const SORT_OPTIONS = [
  { value: "default", label: "இயல்பு நிலை (Default)" },
  { value: "price-asc", label: "விலை: குறைந்தது முதல் (Low → High)" },
  { value: "price-desc", label: "விலை: அதிகமானது முதல் (High → Low)" },
  { value: "name-asc", label: "பெயர்: A–Z" },
  { value: "name-desc", label: "பெயர்: Z–A" },
];

export default function ItemListPage() {
  const { items, publicCategories, searchQuery, getItemPrice } = useStore();

  const maxPrice = useMemo(() => {
    if (!items || items.length === 0) return 1000;
    const raw = Math.max(...items.map((i) => i.price));
    return Math.ceil(raw / 100) * 100;
  }, [items]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMax, setPriceMax] = useState(null); // null = "all"
  const [sort, setSort] = useState("default");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const sliderMax = priceMax ?? maxPrice;

  // Sync global search query
  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  // Lock body scroll when sheets are open
  useEffect(() => {
    if (filterSheetOpen || sortSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterSheetOpen, sortSheetOpen]);

  const filtered = useMemo(() => {
    let result = [...items];

    const q = localSearch.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (i) =>
          (i.tamilName && i.tamilName.toLowerCase().includes(q)) ||
          (i.englishName && i.englishName.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          i.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((i) => {
        const itemCats = i.categoryIds || i.publicCategories || [];
        return selectedCategories.some((sc) => itemCats.includes(sc));
      });
    }

    result = result.filter((i) => i.price >= 0 && i.price <= sliderMax);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => getItemPrice(a) - getItemPrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => getItemPrice(b) - getItemPrice(a));
        break;
      case "name-asc":
        result.sort((a, b) =>
          (a.tamilName || a.englishName).localeCompare(b.tamilName || b.englishName)
        );
        break;
      case "name-desc":
        result.sort((a, b) =>
          (b.tamilName || b.englishName).localeCompare(a.tamilName || a.englishName)
        );
        break;
      default:
        break;
    }

    return result;
  }, [items, localSearch, selectedCategories, sliderMax, sort, getItemPrice]);

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function clearFilters() {
    setSelectedCategories([]);
    setPriceMax(null);
    setLocalSearch("");
    setSort("default");
  }

  const activeFilterCount = selectedCategories.length + (priceMax !== null && priceMax < maxPrice ? 1 : 0) + (localSearch.trim() !== "" ? 1 : 0);

  const hasFilters = activeFilterCount > 0 || sort !== "default";

  // Desktop Sidebar Filter Panel
  const DesktopFilterPanel = (
    <div className="bg-[#faf6ee] rounded-none p-4 space-y-5 border border-bark-200 shadow-green">
      <div className="flex items-center justify-between gap-2 border-b border-bark-200 pb-3">
        <div className="min-w-0 flex items-center gap-2">
          <GoldLotusOrnament size={18} />
          <div>
            <p className="font-extrabold text-bark-900 text-sm font-tamil leading-tight">
              வடிகட்டிகள்
            </p>
            <p className="text-xs text-bark-400 font-lato leading-tight">Filters</p>
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 cursor-pointer shrink-0 font-lato"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="label text-bark-800 font-tamil text-xs">தேடல் (Search)</label>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400"
          />
          <input
            type="text"
            placeholder="மஞ்சள், Turmeric..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-bark-200 rounded-none text-sm bg-cream-50 text-bark-900 focus:ring-2 focus:ring-forest"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="label text-bark-800 font-tamil text-xs">பிரிவுகள் (Categories)</label>
        <div className="flex flex-col gap-2">
          {publicCategories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              active={selectedCategories.includes(cat.id)}
              onClick={() => toggleCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="label text-bark-800 font-tamil text-xs">
          விலை வரம்பு: ₹0 – ₹{sliderMax.toLocaleString()}
        </label>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={10}
          value={sliderMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-[#2d5a3d] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-bark-400 mt-1 font-bold font-lato">
          <span>₹0</span>
          <span>₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition className="min-h-screen flex flex-col bg-storefront text-bark-900 pb-12 sm:pb-0">
      <Navbar />

      {/* Mobile Sticky Control Bar (Under Navbar) */}
      <div className="lg:hidden sticky top-[56px] z-30 bg-[#12281b] border-b border-gold/30 p-2.5 space-y-2">
        {/* Full-width Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
          <input
            type="text"
            placeholder="தேடுக... Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gold/40 text-sm bg-[#faf6ee] text-bark-900 rounded-none focus:outline-none"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-bark-400 p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Buttons: Filters & Sort side-by-side */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gold text-bark-900 font-extrabold text-xs rounded-none shadow-sm min-h-[44px] cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            <span>வடிகட்டிகள் / Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#1d3d29] text-gold text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSortSheetOpen(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1d3d29] text-cream-100 border border-gold/40 font-bold text-xs rounded-none shadow-sm min-h-[44px] cursor-pointer"
          >
            <ArrowUpDown size={15} className="text-gold-300" />
            <span>வரிசைப்படுத்து / Sort</span>
          </button>
        </div>

        {/* Removable Active Filter Pills (Horizontally Scrollable) */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {selectedCategories.map((catId) => {
              const cat = publicCategories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <span
                  key={catId}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold text-bark-900 shrink-0 font-tamil"
                >
                  {cat.label.split(" ")[0]}
                  <X size={12} className="cursor-pointer" onClick={() => toggleCategory(catId)} />
                </span>
              );
            })}
            {priceMax !== null && priceMax < maxPrice && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold text-bark-900 shrink-0 font-lato">
                ≤ ₹{priceMax}
                <X size={12} className="cursor-pointer" onClick={() => setPriceMax(null)} />
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[11px] font-bold text-gold-300 underline shrink-0 px-2 font-lato cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6 border-b border-gold/30 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <GoldLotusOrnament size={24} />
              <h1 className="text-2xl font-extrabold font-tamil text-bark-900">
                அனைத்துப் பொருட்கள் <span className="font-playfair text-xl font-normal text-forest-700 ml-1">(All Items)</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-bark-500 mt-0.5 font-lato font-medium">
              {filtered.length} பொருட்கள் கிடைக்கின்றன ({filtered.length} items found)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[#faf6ee] border border-bark-200 rounded-none px-4 py-2 pr-8 appearance-none text-sm text-bark-900 font-bold focus:ring-2 focus:ring-forest cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bark-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Page Header Summary */}
        <div className="lg:hidden mb-4 flex items-center justify-between border-b border-gold/20 pb-2">
          <span className="text-xs font-bold text-bark-600 font-lato">
            Showing {filtered.length} items
          </span>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-forest-700 font-bold underline font-lato">
              Reset Filters
            </button>
          )}
        </div>

        {/* Desktop Layout (Grid with Left Sidebar) */}
        <div
          className="hidden lg:grid gap-6"
          style={{ gridTemplateColumns: "300px minmax(0, 1fr)" }}
        >
          {/* Sidebar */}
          <aside
            className="min-w-0"
            style={{
              position: "sticky",
              top: "80px",
              alignSelf: "start",
              maxWidth: "300px",
              width: "100%",
            }}
          >
            {DesktopFilterPanel}
          </aside>

          {/* Products Grid */}
          <div className="min-w-0">
            {filtered.length === 0 ? (
              <div className="bg-[#faf6ee] border border-bark-200 rounded-none p-12 text-center shadow-green">
                <img src={EG_ICON} alt="No items" className="w-16 h-16 mx-auto mb-4 object-contain opacity-50" />
                <h3 className="text-xl font-bold font-tamil text-bark-900 mb-2">
                  பொருட்கள் எதுவும் கிடைக்கவில்லை (No items found)
                </h3>
                <p className="text-bark-500 mb-6 text-sm font-lato">
                  வடிகட்டி அல்லது தேடல் சொல்லை மாற்றி முயற்சிக்கவும்.
                </p>
                <button onClick={clearFilters} className="btn-primary rounded-none cursor-pointer">
                  அனைத்து வடிகட்டிகளையும் நீக்கு (Clear Filters)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item} showCategories={true} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Product Grid (2-column on phones) */}
        <div className="lg:hidden min-w-0">
          {filtered.length === 0 ? (
            <div className="bg-[#faf6ee] border border-bark-200 rounded-none p-8 text-center shadow-green">
              <img src={EG_ICON} alt="No items" className="w-14 h-14 mx-auto mb-3 object-contain opacity-50" />
              <h3 className="text-lg font-bold font-tamil text-bark-900 mb-1">
                பொருட்கள் கிடைக்கவில்லை
              </h3>
              <p className="text-bark-500 mb-4 text-xs font-lato">
                வடிகட்டி அல்லது தேடல் சொல்லை மாற்றி முயற்சிக்கவும்.
              </p>
              <button onClick={clearFilters} className="btn-primary rounded-none text-xs py-2 px-4 cursor-pointer">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} showCategories={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET 1: FILTERS */}
      {filterSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setFilterSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Sheet Body */}
          <div className="relative w-full max-h-[85dvh] bg-[#faf6ee] border-t-2 border-gold rounded-t-2xl shadow-2xl flex flex-col z-10 font-lato box-border overflow-hidden">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-bark-300/60 rounded-full mx-auto my-2.5 shrink-0" />

            {/* Sheet Header */}
            <div className="px-4 pb-3 border-b border-bark-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <GoldLotusOrnament size={20} />
                <h3 className="font-extrabold font-tamil text-lg text-bark-900">
                  வடிகட்டிகள் (Filters)
                </h3>
              </div>
              <button
                onClick={() => setFilterSheetOpen(false)}
                className="p-2 text-bark-600 hover:text-bark-900 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Sheet Content */}
            <div className="p-4 space-y-6 overflow-y-auto flex-1 box-border">
              {/* Category List Rows */}
              <div>
                <label className="block font-bold text-bark-900 text-sm font-tamil mb-3">
                  பிரிவுகள் (Categories)
                </label>
                <div className="space-y-2">
                  {publicCategories.map((cat) => {
                    const active = selectedCategories.includes(cat.id);
                    const catImg = getCategoryImage(cat);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-none border text-left cursor-pointer min-h-[48px] transition-colors ${
                          active
                            ? "bg-forest border-forest text-cream-100 font-bold shadow-xs"
                            : "bg-white text-bark-800 border-bark-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full border border-gold/40 bg-[#faf6ee] overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                            <img
                              src={catImg}
                              alt={cat.label}
                              onError={(e) => {
                                e.currentTarget.src = EG_ICON;
                              }}
                              className="w-full h-full object-contain rounded-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className={`font-extrabold font-tamil text-sm leading-tight ${active ? "text-cream-100" : "text-bark-900"}`}>
                              {cat.tamilName || cat.label}
                            </p>
                            <p className={`text-xs font-lato leading-tight ${active ? "text-gold-200" : "text-bark-500"}`}>
                              {cat.englishName || cat.shortLabel}
                            </p>
                          </div>
                        </div>

                        {active && <Check size={18} className="text-gold shrink-0 ml-2" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-2 border-t border-bark-200">
                <label className="block font-bold text-bark-900 text-sm font-tamil mb-2">
                  விலை வரம்பு: ₹0 – ₹{sliderMax.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={10}
                  value={sliderMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#2d5a3d] h-3 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-bark-500 font-bold mt-1">
                  <span>₹0</span>
                  <span>₹{maxPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Sticky Sheet Footer */}
            <div className="p-4 bg-white border-t border-bark-200 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 border border-bark-300 text-bark-800 font-bold py-3 text-sm rounded-none hover:bg-gray-100 min-h-[44px] cursor-pointer"
              >
                அழி / Clear all
              </button>
              <button
                type="button"
                onClick={() => setFilterSheetOpen(false)}
                className="flex-[2] bg-forest text-cream-100 font-extrabold py-3 text-sm rounded-none shadow-green hover:bg-forest-700 min-h-[44px] cursor-pointer"
              >
                பொருட்களைக் காட்டு ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET 2: SORT */}
      {sortSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setSortSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Sheet Body */}
          <div className="relative w-full max-h-[60dvh] bg-[#faf6ee] border-t-2 border-gold rounded-t-2xl shadow-2xl flex flex-col z-10 font-lato box-border overflow-hidden">
            <div className="w-12 h-1.5 bg-bark-300/60 rounded-full mx-auto my-2.5 shrink-0" />

            <div className="px-4 pb-3 border-b border-bark-200 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold font-tamil text-lg text-bark-900">
                வரிசைப்படுத்து (Sort Items)
              </h3>
              <button
                onClick={() => setSortSheetOpen(false)}
                className="p-2 text-bark-600 hover:text-bark-900 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto flex-1">
              {SORT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => {
                    setSort(opt.value);
                    setSortSheetOpen(false);
                  }}
                  className={`flex items-center justify-between p-3.5 border rounded-none cursor-pointer min-h-[48px] transition-colors ${
                    sort === opt.value
                      ? "bg-forest border-forest text-cream-100 font-bold"
                      : "bg-white text-bark-800 border-bark-200"
                  }`}
                >
                  <span className="text-sm font-tamil">{opt.label}</span>
                  <input
                    type="radio"
                    name="mobile-sort"
                    checked={sort === opt.value}
                    onChange={() => {}}
                    className="accent-[#d99c2b] w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Floating Call Button on Mobile */}
      <FloatingCallButton />
    </PageTransition>
  );
}
