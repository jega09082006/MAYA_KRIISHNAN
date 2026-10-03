import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X, Search, ChevronDown, Leaf } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ItemCard from "../../components/ItemCard";
import CategoryChip from "../../components/CategoryChip";
import { useStore } from "../../context/StoreContext";

const SORT_OPTIONS = [
  { value: "default", label: "இயல்பு நிலை (Default)" },
  { value: "price-asc", label: "விலை: குறைந்தது முதல் (Low → High)" },
  { value: "price-desc", label: "விலை: அதிகமானது முதல் (High → Low)" },
  { value: "name-asc", label: "பெயர்: A–Z" },
  { value: "name-desc", label: "பெயர்: Z–A" },
];

export default function ItemListPage() {
  const { items, publicCategories, searchQuery, getItemPrice } = useStore();

  // BUG 4 FIX: compute maxPrice from real data BEFORE state so useState can use it
  const maxPrice = useMemo(() => {
    if (!items || items.length === 0) return 1000;
    const raw = Math.max(...items.map((i) => i.price));
    return Math.ceil(raw / 100) * 100;
  }, [items]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  // BUG 4 FIX: initial upper bound = computed maxPrice, not hardcoded 1000
  const [priceMax, setPriceMax] = useState(null); // null = "all"
  const [sort, setSort] = useState("default");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [filterOpen, setFilterOpen] = useState(false);

  // Resolved upper bound for slider
  const sliderMax = priceMax ?? maxPrice;

  const filtered = useMemo(() => {
    let result = [...items];

    // Search (Tamil + English)
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

    // Category filter – OR logic (matches any selected)
    if (selectedCategories.length > 0) {
      result = result.filter((i) => {
        const itemCats = i.categoryIds || i.publicCategories || [];
        return selectedCategories.some((sc) => itemCats.includes(sc));
      });
    }

    // Price range
    result = result.filter((i) => i.price >= 0 && i.price <= sliderMax);

    // Sort
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

  const hasFilters =
    selectedCategories.length > 0 ||
    (priceMax !== null && priceMax < maxPrice) ||
    localSearch.trim() !== "" ||
    sort !== "default";

  // ─── Filter panel (shared between sidebar and mobile drawer) ───────────────
  const FilterPanel = (
    <div
      style={{ overflowX: "hidden", boxSizing: "border-box" }}
      className="card p-4 space-y-5 overflow-hidden"
    >
      {/* BUG 5 FIX: header – title on one line, Clear all white-space: nowrap */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight">
            வடிகட்டிகள்
          </p>
          <p className="text-xs text-gray-400 leading-tight">Filters</p>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{ whiteSpace: "nowrap" }}
            className="text-xs text-brand-orange hover:text-brand-pink font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="label">தேடல் (Search)</label>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="மஞ்சள், Turmeric, லேகியம்..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            /* BUG: placeholder overflow → text-overflow:ellipsis on input */
            style={{ textOverflow: "ellipsis" }}
            className="input-field pl-8 text-sm"
          />
        </div>
      </div>

      {/* BUG 1+2+3+6 FIX: vertical list, full-width chips, no overflow */}
      <div>
        <label className="label">பிரிவுகள் (Categories)</label>
        <div className="flex flex-col gap-2" style={{ width: "100%" }}>
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

      {/* BUG 4 FIX: single maxPrice source, live label */}
      <div>
        <label className="label">
          விலை வரம்பு: ₹0 – ₹{sliderMax.toLocaleString()}
        </label>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={10}
          value={sliderMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-brand-orange cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 font-semibold">
          <span>₹0</span>
          <span>₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Leaf size={22} className="text-emerald-600" />
              <h1 className="text-2xl font-extrabold text-gray-900">
                அனைத்துப் பொருட்கள் (All Items)
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 font-medium">
              {filtered.length} பொருட்கள் கிடைக்கின்றன ({filtered.length} items
              found)
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field pr-8 appearance-none text-sm py-2 cursor-pointer font-medium"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Filter toggle — visible below 900 px */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{ whiteSpace: "nowrap" }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer lg:hidden ${
                filterOpen
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "border-gray-200 text-gray-600 bg-white"
              }`}
            >
              <SlidersHorizontal size={15} />
              வடிகட்டி (Filters)
              {hasFilters && (
                <span className="bg-brand-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile filter drawer — full width above grid */}
        {filterOpen && (
          <div className="lg:hidden mb-4" style={{ width: "100%", boxSizing: "border-box" }}>
            {FilterPanel}
          </div>
        )}

        {/*
          BUG 6 FIX (layout): CSS grid with a fixed 300px sidebar track.
          minmax(0, 1fr) prevents the product column from overflowing.
          The aside is NOT inside the flex layout anymore.
        */}
        <div
          className="hidden lg:grid gap-6"
          style={{ gridTemplateColumns: "300px minmax(0, 1fr)" }}
        >
          {/* ── Sidebar ─────────────────────────────── */}
          <aside
            className="min-w-0"
            style={{
              position: "sticky",
              top: "80px",       /* below navbar (~64px + 16px gap) */
              alignSelf: "start",
              boxSizing: "border-box",
              overflow: "hidden",
              maxWidth: "300px",
              width: "100%",
            }}
          >
            {FilterPanel}
          </aside>

          {/* ── Products Grid ────────────────────────── */}
          <div className="min-w-0">
            {filtered.length === 0 ? (
              <div className="card p-16 text-center animate-fade-in">
                <div className="text-6xl mb-4 select-none">🌿</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  பொருட்கள் எதுவும் கிடைக்கவில்லை (No items found)
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                  வடிகட்டி அல்லது தேடல் சொல்லை மாற்றி முயற்சிக்கவும்.
                </p>
                <button onClick={clearFilters} className="btn-primary cursor-pointer">
                  அனைத்து வடிகட்டிகளையும் நீக்கு (Clear Filters)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item} showCategories={true} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only product grid (shown when sidebar is hidden) */}
        <div className="lg:hidden min-w-0">
          {filtered.length === 0 ? (
            <div className="card p-16 text-center animate-fade-in">
              <div className="text-6xl mb-4 select-none">🌿</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                பொருட்கள் எதுவும் கிடைக்கவில்லை (No items found)
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                வடிகட்டி அல்லது தேடல் சொல்லை மாற்றி முயற்சிக்கவும்.
              </p>
              <button onClick={clearFilters} className="btn-primary cursor-pointer">
                அனைத்து வடிகட்டிகளையும் நீக்கு (Clear Filters)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} showCategories={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
