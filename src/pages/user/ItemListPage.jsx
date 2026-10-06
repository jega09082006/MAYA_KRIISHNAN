import React, { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, Search, ChevronDown, Check, ArrowUpDown } from "lucide-react";
import ItemCard from "../../components/ItemCard";
import CategoryChip from "../../components/CategoryChip";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { getCategoryImage, EG_ICON } from "../../utils/images";

export default function ItemListPage() {
  const { items, publicCategories, searchQuery, getItemPrice } = useStore();
  const { lang, t } = useLang();

  // Sort options built from translation keys — re-evaluated when lang changes
  const SORT_OPTIONS = useMemo(() => [
    { value: "default",    label: t("sortDefault") },
    { value: "price-asc",  label: t("sortPriceLowHigh") },
    { value: "price-desc", label: t("sortPriceHighLow") },
    { value: "name-asc",   label: t("sortNameAZ") },
    { value: "name-desc",  label: t("sortNameZA") },
  ], [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const maxPrice = useMemo(() => {
    if (!items || items.length === 0) return 1000;
    const raw = Math.max(...items.map((i) => i.price));
    return Math.ceil(raw / 100) * 100;
  }, [items]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMax, setPriceMax] = useState(null);
  const [sort, setSort] = useState("default");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const sliderMax = priceMax ?? maxPrice;

  useEffect(() => {
    if (searchQuery !== undefined) setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (filterSheetOpen || sortSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [filterSheetOpen, sortSheetOpen]);

  const filtered = useMemo(() => {
    let result = [...items];

    // Search matches BOTH languages regardless of active lang
    const q = localSearch.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (i) =>
          (i.tamilName   && i.tamilName.toLowerCase().includes(q)) ||
          (i.englishName && i.englishName.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          i.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((i) => {
        const cats = i.categoryIds || i.publicCategories || [];
        return selectedCategories.some((sc) => cats.includes(sc));
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
          (lang === "ta" ? a.tamilName : a.englishName)
            .localeCompare(lang === "ta" ? b.tamilName : b.englishName)
        );
        break;
      case "name-desc":
        result.sort((a, b) =>
          (lang === "ta" ? b.tamilName : b.englishName)
            .localeCompare(lang === "ta" ? a.tamilName : a.englishName)
        );
        break;
      default:
        break;
    }

    return result;
  }, [items, localSearch, selectedCategories, sliderMax, sort, getItemPrice, lang]);

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

  const activeFilterCount =
    selectedCategories.length +
    (priceMax !== null && priceMax < maxPrice ? 1 : 0) +
    (localSearch.trim() !== "" ? 1 : 0);

  const hasFilters = activeFilterCount > 0 || sort !== "default";

  // ── Desktop Sidebar Filter Panel ─────────────────────────────────────────
  const DesktopFilterPanel = (
    <div className="bg-[#faf6ee] rounded-none p-4 space-y-5 border border-bark-200 shadow-green">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-bark-200 pb-3">
        <div className="min-w-0 flex items-center gap-2">
          <GoldLotusOrnament size={18} />
          <p className="font-extrabold text-bark-900 text-sm font-catamaran leading-tight">
            {t("filtersLabel")}
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-forest-700 hover:text-gold font-bold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <X size={12} /> {t("clearAll")}
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="label text-bark-800 font-catamaran text-xs">{t("filterTitle")}</label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
          <input
            type="text"
            placeholder={t("searchItemsPlaceholder")}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-bark-200 rounded-none text-sm bg-cream-50 text-bark-900 focus:ring-2 focus:ring-forest"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="label text-bark-800 font-catamaran text-xs">{t("categoriesLabel")}</label>
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
        <label className="label text-bark-800 font-catamaran text-xs">
          {t("priceRange")}: ₹0 – ₹{sliderMax.toLocaleString("en-IN")}
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
        <div className="flex justify-between text-xs text-bark-400 mt-1 font-bold">
          <span>₹0</span>
          <span>₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">

      {/* ── Mobile Sticky Control Bar ─────────────────────────────────────── */}
      <div className="lg:hidden sticky top-[56px] z-30 bg-[#12281b] border-b border-gold/30 p-2.5 space-y-2">
        {/* Full-width Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
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

        {/* Filter & Sort buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gold text-bark-900 font-extrabold text-xs rounded-none shadow-sm min-h-[44px] cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            <span>{t("filtersLabel")}</span>
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
            <span>{t("sortLabel")}</span>
          </button>
        </div>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {selectedCategories.map((catId) => {
              const cat = publicCategories.find((c) => c.id === catId);
              if (!cat) return null;
              const name = lang === "ta" ? (cat.tamilName || cat.label) : (cat.englishName || cat.label);
              return (
                <span
                  key={catId}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold text-bark-900 shrink-0 font-catamaran"
                >
                  {name.split(" ")[0]}
                  <X size={12} className="cursor-pointer" onClick={() => toggleCategory(catId)} />
                </span>
              );
            })}
            {priceMax !== null && priceMax < maxPrice && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold text-bark-900 shrink-0">
                ≤ ₹{priceMax}
                <X size={12} className="cursor-pointer" onClick={() => setPriceMax(null)} />
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[11px] font-bold text-gold-300 underline shrink-0 px-2 cursor-pointer"
            >
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">

        {/* ── Desktop Header ─────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-between mb-6 border-b border-gold/30 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <GoldLotusOrnament size={24} />
              <h1 className="text-2xl font-extrabold font-catamaran text-bark-900">
                {t("allItemsTitle")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-bark-500 mt-0.5 font-medium">
              {filtered.length} {t("itemsFound")}
            </p>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#faf6ee] border border-bark-200 rounded-none px-4 py-2 pr-8 appearance-none text-sm text-bark-900 font-bold focus:ring-2 focus:ring-forest cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-bark-500 pointer-events-none" />
          </div>
        </div>

        {/* ── Mobile Page Header Summary ──────────────────────────────────── */}
        <div className="lg:hidden mb-4 flex items-center justify-between border-b border-gold/20 pb-2">
          <span className="text-xs font-bold text-bark-600">
            {t("showingItems")} {filtered.length} {t("itemsFound")}
          </span>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-forest-700 font-bold underline">
              {t("resetFilters")}
            </button>
          )}
        </div>

        {/* ── Desktop: Grid with Sidebar ──────────────────────────────────── */}
        <div
          className="hidden lg:grid gap-6"
          style={{ gridTemplateColumns: "300px minmax(0, 1fr)" }}
        >
          <aside style={{ position: "sticky", top: "80px", alignSelf: "start", maxWidth: "300px", width: "100%" }}>
            {DesktopFilterPanel}
          </aside>

          <div className="min-w-0">
            {filtered.length === 0 ? (
              <EmptyState t={t} clearFilters={clearFilters} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch [&>*]:min-w-0">
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item} showCategories={true} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile: 2-column grid ───────────────────────────────────────── */}
        <div className="lg:hidden min-w-0">
          {filtered.length === 0 ? (
            <EmptyStateMobile t={t} clearFilters={clearFilters} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch [&>*]:min-w-0">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} showCategories={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Sheet: FILTERS ────────────────────────────────── */}
      {filterSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div onClick={() => setFilterSheetOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative w-full max-h-[85dvh] bg-[#faf6ee] border-t-2 border-gold rounded-t-2xl shadow-2xl flex flex-col z-10 box-border overflow-hidden">
            <div className="w-12 h-1.5 bg-bark-300/60 rounded-full mx-auto my-2.5 shrink-0" />

            <div className="px-4 pb-3 border-b border-bark-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <GoldLotusOrnament size={20} />
                <h3 className="font-extrabold font-catamaran text-lg text-bark-900">{t("filtersLabel")}</h3>
              </div>
              <button onClick={() => setFilterSheetOpen(false)} className="p-2 text-bark-600 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto flex-1 box-border">
              {/* Category rows */}
              <div>
                <label className="block font-bold text-bark-900 text-sm font-catamaran mb-3">
                  {t("categoriesLabel")}
                </label>
                <div className="space-y-2">
                  {publicCategories.map((cat) => {
                    const active = selectedCategories.includes(cat.id);
                    const catImg = getCategoryImage(cat);
                    const name = lang === "ta" ? (cat.tamilName || cat.label) : (cat.englishName || cat.label);
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
                            <img src={catImg} alt={name} onError={(e) => { e.currentTarget.src = EG_ICON; }} className="w-full h-full object-contain rounded-full" />
                          </div>
                          <span className={`font-extrabold font-catamaran text-sm leading-tight truncate ${active ? "text-cream-100" : "text-bark-900"}`}>
                            {name}
                          </span>
                        </div>
                        {active && <Check size={18} className="text-gold shrink-0 ml-2" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range */}
              <div className="pt-2 border-t border-bark-200">
                <label className="block font-bold text-bark-900 text-sm font-catamaran mb-2">
                  {t("priceRange")}: ₹0 – ₹{sliderMax.toLocaleString("en-IN")}
                </label>
                <input type="range" min={0} max={maxPrice} step={10} value={sliderMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[#2d5a3d] h-3 cursor-pointer" />
                <div className="flex justify-between text-xs text-bark-500 font-bold mt-1">
                  <span>₹0</span>
                  <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-bark-200 flex gap-3 shrink-0">
              <button type="button" onClick={clearFilters} className="flex-1 border border-bark-300 text-bark-800 font-bold py-3 text-sm rounded-none hover:bg-gray-100 min-h-[44px] cursor-pointer">
                {t("clearAll")}
              </button>
              <button type="button" onClick={() => setFilterSheetOpen(false)} className="flex-[2] bg-forest text-cream-100 font-extrabold py-3 text-sm rounded-none shadow-green hover:bg-forest-700 min-h-[44px] cursor-pointer">
                {t("showItems")} ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Sheet: SORT ────────────────────────────────────── */}
      {sortSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div onClick={() => setSortSheetOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative w-full max-h-[60dvh] bg-[#faf6ee] border-t-2 border-gold rounded-t-2xl shadow-2xl flex flex-col z-10 box-border overflow-hidden">
            <div className="w-12 h-1.5 bg-bark-300/60 rounded-full mx-auto my-2.5 shrink-0" />
            <div className="px-4 pb-3 border-b border-bark-200 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold font-catamaran text-lg text-bark-900">{t("sortTitle")}</h3>
              <button onClick={() => setSortSheetOpen(false)} className="p-2 text-bark-600 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto flex-1">
              {SORT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setSortSheetOpen(false); }}
                  className={`flex items-center justify-between p-3.5 border rounded-none cursor-pointer min-h-[48px] transition-colors ${
                    sort === opt.value
                      ? "bg-forest border-forest text-cream-100 font-bold"
                      : "bg-white text-bark-800 border-bark-200"
                  }`}
                >
                  <span className="text-sm font-catamaran">{opt.label}</span>
                  <input type="radio" name="mobile-sort" checked={sort === opt.value} onChange={() => {}} className="accent-[#d99c2b] w-4 h-4" />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}

function EmptyState({ t, clearFilters }) {
  return (
    <div className="bg-[#faf6ee] border border-bark-200 rounded-none p-12 text-center shadow-green">
      <p className="text-4xl mb-4">🌿</p>
      <h3 className="text-xl font-bold font-catamaran text-bark-900 mb-2">{t("noItemsFound")}</h3>
      <p className="text-bark-500 mb-6 text-sm">{t("noItemsHint")}</p>
      <button onClick={clearFilters} className="btn-primary rounded-none cursor-pointer">{t("clearFilters")}</button>
    </div>
  );
}

function EmptyStateMobile({ t, clearFilters }) {
  return (
    <div className="bg-[#faf6ee] border border-bark-200 rounded-none p-8 text-center shadow-green">
      <p className="text-3xl mb-3">🌿</p>
      <h3 className="text-lg font-bold font-catamaran text-bark-900 mb-1">{t("noItemsFound")}</h3>
      <p className="text-bark-500 mb-4 text-xs">{t("noItemsHint")}</p>
      <button onClick={clearFilters} className="btn-primary rounded-none text-xs py-2 px-4 cursor-pointer">{t("clearFilters")}</button>
    </div>
  );
}
