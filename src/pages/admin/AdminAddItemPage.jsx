import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save, ArrowLeft, Eye, Star, Tag,
  Upload, Image as ImageIcon, RotateCcw, CheckCircle2,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import ItemCard from "../../components/ItemCard";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, getCategoryImage, EG_ICON } from "../../utils/images";

// ─────────────────────────────────────────────────────────────────────────────
// Empty form shape. descriptionTa / descriptionEn replace the old combined
// "description" field. Both are optional strings.
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  tamilName: "",
  englishName: "",
  descriptionTa: "",
  descriptionEn: "",
  price: "",
  unit: "100g",
  stock: "",
  imageUrl: "",
  categoryIds: [],
  tags: "",
};

export default function AdminAddItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    items,
    addItem,
    updateItem,
    publicCategories,
    suggestionGroups,
    setItemGroups,
    getGroupsOfItem,
  } = useStore();
  const { lang, t } = useLang();

  const isEdit      = Boolean(id);
  // Look up the existing item. If in edit mode and not found → show not-found UI.
  const existingItem = isEdit ? items.find((i) => i.id === id) : null;

  const [form,             setForm]             = useState(EMPTY_FORM);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [errors,           setErrors]           = useState({});
  // saved = true → show success toast for 1 s before navigating
  const [saved,            setSaved]            = useState(false);

  // Prefill on edit. Runs only when `id` changes, not on lang toggle.
  useEffect(() => {
    if (!existingItem) return;
    setForm({
      tamilName:     existingItem.tamilName     || "",
      englishName:   existingItem.englishName   || "",
      // Support both new split fields and the legacy combined description
      descriptionTa: existingItem.descriptionTa || "",
      descriptionEn: existingItem.descriptionEn || "",
      price:         existingItem.price         ?? "",
      unit:          existingItem.unit          || "100g",
      stock:         existingItem.stock         ?? "",
      imageUrl:      existingItem.imageUrl      || existingItem.image || "",
      categoryIds:   existingItem.categoryIds   || existingItem.publicCategories || [],
      tags:          existingItem.tags?.join(", ") || "",
    });
    setSelectedGroupIds(getGroupsOfItem(existingItem.id).map((g) => g.id));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Image file upload ──────────────────────────────────────────────────────
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.tamilName.trim())                  e.tamilName   = t("tamilNameRequired");
    if (!form.englishName.trim())                e.englishName = t("englishNameRequired");
    if (!form.price || Number(form.price) <= 0)  e.price       = t("priceRequired");
    if (form.stock === "" || Number(form.stock) < 0) e.stock   = t("stockRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      tamilName:     form.tamilName.trim(),
      englishName:   form.englishName.trim(),
      descriptionTa: form.descriptionTa.trim(),
      descriptionEn: form.descriptionEn.trim(),
      // Keep legacy description for any code that still reads it
      description:   [form.descriptionEn.trim(), form.descriptionTa.trim()]
                       .filter(Boolean).join(" "),
      price:       Number(form.price),
      unit:        form.unit.trim() || "100g",
      stock:       Number(form.stock),
      imageUrl:    form.imageUrl.trim(),
      image:       form.imageUrl.trim(),
      categoryIds: form.categoryIds.length > 0 ? form.categoryIds : ["cat-1"],
      tags:        form.tags
                     ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
                     : [],
    };

    let savedItemId = id;
    if (isEdit) {
      updateItem(id, payload);
    } else {
      const created = addItem(payload);
      savedItemId   = created.id;
    }
    setItemGroups(savedItemId, selectedGroupIds);

    setSaved(true);
    setTimeout(() => navigate("/admin/items"), 1200);
  }

  // ── Chip toggles ───────────────────────────────────────────────────────────
  function toggleCategory(catId) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((c) => c !== catId)
        : [...prev.categoryIds, catId],
    }));
  }

  function toggleGroup(groupId) {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((g) => g !== groupId)
        : [...prev, groupId]
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const formImgSrc     = getItemImage(form);
  const hasCustomImage = Boolean(form.imageUrl?.trim());

  // previewItem feeds ItemCard — picks the right description for the active lang
  const previewItem = {
    id:            id || "preview",
    tamilName:     form.tamilName   || "தமிழ் பெயர்",
    englishName:   form.englishName || "English Name",
    descriptionTa: form.descriptionTa || "",
    descriptionEn: form.descriptionEn || "",
    description:   form.descriptionEn || form.descriptionTa || "",
    price:         Number(form.price)  || 0,
    unit:          form.unit          || "100g",
    stock:         Number(form.stock) || 0,
    imageUrl:      form.imageUrl,
    image:         form.imageUrl,
    categoryIds:   form.categoryIds,
    tags:          form.tags
                     ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
                     : [],
  };

  // ── Item not found (edit mode only) ───────────────────────────────────────
  if (isEdit && !existingItem) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center bg-white border border-gray-200 p-8 shadow-green rounded-none space-y-4 max-w-sm w-full mx-4">
          <p className="text-4xl">🌿</p>
          <h2 className="text-lg font-bold font-catamaran text-gray-900">{t("itemNotFound")}</h2>
          <p className="text-sm text-gray-500 font-catamaran">{t("itemNotFoundHint")}</p>
          <button
            onClick={() => navigate("/admin/items")}
            className="bg-forest text-cream-100 font-bold px-5 py-2.5 rounded-none hover:bg-forest-700 transition-all text-sm cursor-pointer min-h-[44px] inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> {t("backToItemsList")}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-gray-800 pb-24 lg:pb-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate("/admin/items")}
          aria-label={t("backToItemsList")}
          className="p-2 rounded-none hover:bg-gray-200 transition-colors text-gray-600 cursor-pointer border border-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <GoldLotusOrnament size={20} className="shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold font-catamaran text-gray-900 leading-tight min-w-0 [overflow-wrap:anywhere]">
              {isEdit ? t("editItemPageTitle") : t("addItemPageTitle")}
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-0.5 font-catamaran">
            {isEdit ? t("editItemPageSubtitle") : t("addItemPageSubtitle")}
          </p>
        </div>
      </div>

      {/* ── Main 2-column layout (stacks on mobile) ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ────────────── FORM (full width on mobile, 2/3 on desktop) ─── */}
        <form
          onSubmit={handleSubmit}
          id="add-item-form"
          noValidate
          className="lg:col-span-2 space-y-5"
        >
          {/* ── Section 1: Names & Descriptions ──────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-none p-5 sm:p-6 space-y-5 shadow-green">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 font-catamaran text-base border-b border-gray-200 pb-3">
              <GoldLotusOrnament size={18} className="shrink-0" />
              {t("productDetailsSection")}
            </h3>

            {/* Tamil Name + English Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tamil Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                  {t("tamilNameLabel")} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.tamilName}
                  onChange={(e) => setForm((p) => ({ ...p, tamilName: e.target.value }))}
                  placeholder={t("tamilNamePlaceholder")}
                  className={`w-full border rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium transition-colors ${
                    errors.tamilName ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"
                  }`}
                />
                {errors.tamilName && (
                  <p className="text-danger text-xs mt-1 font-bold font-catamaran">{errors.tamilName}</p>
                )}
              </div>

              {/* English Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                  {t("englishNameLabel")} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.englishName}
                  onChange={(e) => setForm((p) => ({ ...p, englishName: e.target.value }))}
                  placeholder={t("englishNamePlaceholder")}
                  className={`w-full border rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium transition-colors ${
                    errors.englishName ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"
                  }`}
                />
                {errors.englishName && (
                  <p className="text-danger text-xs mt-1 font-bold font-catamaran">{errors.englishName}</p>
                )}
              </div>
            </div>

            {/* Tamil Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                {t("descriptionTaLabel")}
              </label>
              <textarea
                rows={2}
                value={form.descriptionTa}
                onChange={(e) => setForm((p) => ({ ...p, descriptionTa: e.target.value }))}
                placeholder={t("descriptionTaPlaceholder")}
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-catamaran resize-none leading-relaxed"
              />
            </div>

            {/* English Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                {t("descriptionEnLabel")}
              </label>
              <textarea
                rows={2}
                value={form.descriptionEn}
                onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                placeholder={t("descriptionEnPlaceholder")}
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* ── Section 2: Photo ─────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-none p-5 sm:p-6 space-y-4 shadow-green">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-catamaran flex items-center gap-1.5">
              <ImageIcon size={15} className="text-forest-700 shrink-0" />
              {t("photoLabel")}
            </label>

            {/* Thumbnail + upload button */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-[#faf6ee] border border-gray-200">
              <div className="w-20 h-20 rounded-none overflow-hidden border border-gray-300 bg-white flex items-center justify-center flex-shrink-0 shadow-sm p-1">
                <img
                  src={formImgSrc}
                  alt="Preview"
                  onError={(e) => { e.currentTarget.src = EG_ICON; }}
                  className={`w-full h-full ${hasCustomImage ? "object-cover" : "object-contain"}`}
                />
              </div>
              <div className="flex-1 min-w-[180px] space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-bark-900 font-extrabold text-xs rounded-none shadow-green hover:bg-gold-600 transition-all cursor-pointer font-catamaran min-h-[44px]">
                  <Upload size={14} /> {t("uploadPhotoBtn")}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <p className="text-[11px] text-gray-500">PNG, JPG, WEBP, SVG</p>
              </div>
            </div>

            {/* Image URL row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label className="text-xs font-bold text-gray-600 font-catamaran">
                  {t("imageUrlLabel")}
                </label>
                {hasCustomImage && (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))}
                    className="text-xs text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1 cursor-pointer min-h-[36px]"
                  >
                    <RotateCcw size={12} /> {t("useDefaultImage")}
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder={t("imageUrlPlaceholder")}
                className="w-full border border-gray-200 rounded-none px-3 py-2 text-xs font-mono bg-gray-50 text-gray-900"
              />
              <p className="text-[11px] text-gray-500 italic font-catamaran">{t("imageUrlHint")}</p>
            </div>
          </div>

          {/* ── Section 3: Price / Unit / Stock / Tags ────────────────── */}
          <div className="bg-white border border-gray-200 rounded-none p-5 sm:p-6 space-y-4 shadow-green">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                  {t("priceLabel")} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder={t("pricePlaceholder")}
                  className={`w-full border rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium transition-colors ${
                    errors.price ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"
                  }`}
                />
                {errors.price && (
                  <p className="text-danger text-xs mt-1 font-bold font-catamaran">{errors.price}</p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                  {t("unitLabel")}
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                  placeholder={t("unitPlaceholder")}
                  className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                  {t("stockLabel")} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                  placeholder={t("stockPlaceholder")}
                  className={`w-full border rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium transition-colors ${
                    errors.stock ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"
                  }`}
                />
                {errors.stock && (
                  <p className="text-danger text-xs mt-1 font-bold font-catamaran">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
                {t("tagsLabel")}
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder={t("tagsPlaceholder")}
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* ── Section 4: Categories & Suggestion Groups ─────────────── */}
          <div className="bg-white border border-gray-200 rounded-none p-5 sm:p-6 space-y-6 shadow-green">

            {/* PUBLIC Categories */}
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1 font-catamaran text-base">
                <Tag size={15} className="text-forest-700 shrink-0" />
                {t("categoriesSection")}
              </h3>
              <p className="text-xs text-gray-500 mb-3 font-catamaran">{t("categoriesHint")}</p>
              <div className="flex flex-wrap gap-2">
                {publicCategories.map((cat) => {
                  const active   = form.categoryIds.includes(cat.id);
                  const catImg   = getCategoryImage(cat);
                  // Show only the active-language name — no bilingual
                  const catName  = lang === "ta"
                    ? (cat.tamilName   || cat.label)
                    : (cat.englishName || cat.label);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer min-h-[44px] font-catamaran ${
                        active
                          ? "bg-forest text-cream-100 border-forest shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:border-forest-400"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#faf6ee] border border-gold/30 flex items-center justify-center flex-shrink-0 p-0.5">
                        <img
                          src={catImg}
                          alt={catName}
                          onError={(e) => { e.currentTarget.src = EG_ICON; }}
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                      {/* Single language — no parenthetical */}
                      <span className="min-w-0 [overflow-wrap:anywhere]">{catName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestion Groups */}
            <div className="border-t border-gray-200 pt-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1 font-catamaran text-base">
                <Star size={15} className="text-gold-600 shrink-0" />
                {t("groupsSection")}
              </h3>
              <p className="text-xs text-gray-500 mb-3 font-catamaran">{t("groupsHint")}</p>
              <div className="flex flex-wrap gap-2">
                {suggestionGroups.map((group) => {
                  const active    = selectedGroupIds.includes(group.id);
                  // Show only the active-language name
                  const groupName = lang === "ta" ? group.tamilName : group.name;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer min-h-[44px] font-catamaran ${
                        active
                          ? "bg-gold text-bark-900 border-gold shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-forest-700" : "bg-gray-400"}`}
                        style={active ? {} : { backgroundColor: group.color }}
                      />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{groupName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Desktop Save Button (hidden on mobile — sticky bar below) */}
          <button
            type="submit"
            form="add-item-form"
            className="hidden lg:flex w-full bg-forest text-cream-100 hover:bg-forest-700 font-extrabold py-3.5 text-base rounded-none shadow-green items-center justify-center gap-2 cursor-pointer transition-all min-h-[52px] font-catamaran"
          >
            {saved ? (
              <><CheckCircle2 size={18} /> {t("savedToast")}</>
            ) : (
              <><Save size={18} /> {isEdit ? t("updateItemBtn") : t("saveItemBtn")}</>
            )}
          </button>
        </form>

        {/* ────────────── LIVE PREVIEW (right column on desktop, below on mobile) */}
        <div className="lg:col-span-1 order-first lg:order-none">
          <div className="lg:sticky lg:top-20">
            <div className="bg-[#faf6ee] border border-gray-200 rounded-none p-4 sm:p-5 space-y-4 shadow-green">

              {/* Preview header */}
              <div className="flex items-center gap-2 text-forest-700 font-bold font-catamaran text-sm">
                <Eye size={15} className="shrink-0" />
                {t("livePreviewLabel")}
              </div>

              {/* Active group tags */}
              {selectedGroupIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedGroupIds.map((gid) => {
                    const g = suggestionGroups.find((gr) => gr.id === gid);
                    if (!g) return null;
                    const gName = lang === "ta" ? g.tamilName : g.name;
                    return (
                      <span
                        key={g.id}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-bark-900 border border-gold font-catamaran"
                      >
                        ★ {gName}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* ItemCard preview — reactive to lang toggle */}
              <div className="max-w-[240px] mx-auto">
                <ItemCard item={previewItem} showAddToCart={false} showCategories={true} />
              </div>

              {/* Hint */}
              <p className="text-[11px] text-gray-400 text-center font-catamaran leading-snug">
                {lang === "ta"
                  ? "தமிழ் / ஆங்கில மாற்றும்போது முன்னோட்டம் புதுப்பிக்கப்படும்"
                  : "Preview updates on language toggle"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Save Bar (visible below lg, fixed bottom) ──────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gold px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        {/* Price summary */}
        {form.price ? (
          <div className="shrink-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t("priceLabel")}</p>
            <p className="text-lg font-extrabold text-forest-700 font-catamaran leading-none">
              ₹{Number(form.price).toLocaleString("en-IN")}
            </p>
          </div>
        ) : (
          <div className="shrink-0" />
        )}

        <button
          type="submit"
          form="add-item-form"
          className="flex-1 bg-forest text-cream-100 hover:bg-forest-700 font-extrabold py-3 text-sm rounded-none shadow-green flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px] font-catamaran active:scale-98"
        >
          {saved ? (
            <><CheckCircle2 size={16} /> {t("savedToast")}</>
          ) : (
            <><Save size={16} /> {isEdit ? t("updateItemBtn") : t("saveItemBtn")}</>
          )}
        </button>
      </div>
    </div>
  );
}
