import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Eye, Star, Tag, Upload, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ItemCard from "../../components/ItemCard";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, getCategoryImage, EG_ICON } from "../../utils/images";

const EMPTY_FORM = {
  tamilName: "",
  englishName: "",
  description: "",
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

  const isEdit = Boolean(id);
  const existingItem = isEdit ? items.find((i) => i.id === id) : null;

  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setForm({
        tamilName: existingItem.tamilName || "",
        englishName: existingItem.englishName || "",
        description: existingItem.description || "",
        price: existingItem.price || "",
        unit: existingItem.unit || "100g",
        stock: existingItem.stock || "",
        imageUrl: existingItem.imageUrl || existingItem.image || "",
        categoryIds: existingItem.categoryIds || existingItem.publicCategories || [],
        tags: existingItem.tags?.join(", ") || "",
      });
      const currentGroups = getGroupsOfItem(existingItem.id).map((g) => g.id);
      setSelectedGroupIds(currentGroups);
    }
  }, [id, existingItem]);

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  const previewItem = {
    id: id || "preview",
    tamilName: form.tamilName || "தமிழ் பெயர்",
    englishName: form.englishName || "English Name",
    description: form.description || "பொருள் விளக்கம் (Description)…",
    price: Number(form.price) || 0,
    unit: form.unit || "100g",
    stock: Number(form.stock) || 0,
    imageUrl: form.imageUrl,
    image: form.imageUrl,
    categoryIds: form.categoryIds,
    tags: form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  };

  function validate() {
    const e = {};
    if (!form.tamilName.trim()) e.tamilName = "Tamil Name is required (தமிழ் பெயர் தேவை)";
    if (!form.englishName.trim()) e.englishName = "English Name is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Valid price in ₹ is required";
    if (!form.stock || Number(form.stock) < 0) e.stock = "Valid stock count is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryIds: form.categoryIds.length > 0 ? form.categoryIds : ["cat-1"],
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    let savedItemId = id;
    if (isEdit) {
      updateItem(id, payload);
    } else {
      const created = addItem(payload);
      savedItemId = created.id;
    }

    setItemGroups(savedItemId, selectedGroupIds);

    setSaved(true);
    setTimeout(() => navigate("/admin/items"), 1000);
  }

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

  const formImgSrc = getItemImage(form);
  const hasCustomImage = Boolean(form.imageUrl && form.imageUrl.trim() !== "");

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate("/admin/items")}
          className="p-2 rounded-none hover:bg-gray-200 transition-colors text-gray-600 cursor-pointer border border-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-baseline flex-wrap gap-2">
            <GoldLotusOrnament size={22} className="self-center shrink-0" />
            <h1 className="text-2xl font-bold font-playfair text-gray-900">
              {isEdit ? "Edit Item" : "Add New Item"}
            </h1>
            <span className="font-catamaran font-bold text-lg text-forest-700">
              ({isEdit ? "பொருளை மாற்று" : "புதிய பொருள் சேர்"})
            </span>
          </div>
          <p className="text-gray-500 text-sm font-lato mt-1">
            {isEdit ? "Update item information and photo" : "Add provisions or country medicine item"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="bg-white border border-gray-200 rounded-none p-6 space-y-5 shadow-green">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 font-catamaran text-base border-b border-gray-200 pb-3">
              <GoldLotusOrnament size={18} /> பொருள் விவரங்கள் (Product Details)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                  தமிழ் பெயர் (Tamil Name) *
                </label>
                <input
                  type="text"
                  value={form.tamilName}
                  onChange={(e) => setForm({ ...form, tamilName: e.target.value })}
                  placeholder="உ.ம். மஞ்சள் / கருஞ்சீரகம்"
                  className={`w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium ${errors.tamilName ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.tamilName && (
                  <p className="text-danger text-xs mt-1 font-bold font-lato">{errors.tamilName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                  English Name *
                </label>
                <input
                  type="text"
                  value={form.englishName}
                  onChange={(e) => setForm({ ...form, englishName: e.target.value })}
                  placeholder="e.g. Turmeric / Black Cumin"
                  className={`w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium ${errors.englishName ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.englishName && (
                  <p className="text-danger text-xs mt-1 font-bold font-lato">{errors.englishName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                விளக்கம் (Short Description)
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Pure quality turmeric. தூய சமையல் மஞ்சள்..."
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium resize-none"
              />
            </div>

            {/* Product Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato flex items-center gap-1.5">
                <ImageIcon size={16} className="text-forest-700" /> பொருள் புகைப்படம் (Product Photo Upload - Optional)
              </label>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 p-4 bg-[#faf6ee] rounded-none border border-gray-200">
                  <div className="w-20 h-20 rounded-none overflow-hidden border border-gray-300 bg-white flex items-center justify-center flex-shrink-0 shadow-sm p-1">
                    <img
                      src={formImgSrc}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = EG_ICON;
                      }}
                      className={`w-full h-full ${hasCustomImage ? "object-cover" : "object-contain"}`}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-bark-900 font-extrabold text-xs rounded-none shadow-green hover:bg-gold-600 transition-all cursor-pointer font-lato">
                      <Upload size={14} /> கணினியிலிருந்து புகைப்படம் பதிவேற்றுக (Upload Photo File)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-gray-500 font-lato">Supported formats: PNG, JPG, WEBP, SVG</p>
                  </div>
                </div>

                {/* Image URL Input & Default Button */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-600 block font-lato">
                      புகைப்பட சுட்டி (Image URL Path):
                    </label>
                    {hasCustomImage && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: "" })}
                        className="text-xs text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={12} /> Use default image
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="Leave empty for default eg_icon.png, or paste URL"
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-xs font-mono bg-gray-50 text-gray-900"
                  />
                  <p className="text-[11px] text-gray-500 italic font-lato">
                    Leave empty to use the default image.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                  விலை (Price in ₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="60"
                  className={`w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium ${errors.price ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.price && (
                  <p className="text-danger text-xs mt-1 font-bold font-lato">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                  அளவு (Unit / Weight) *
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="100g, 250g, 500ml, 1 piece"
                  className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                  இருப்பு (Stock) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="50"
                  className={`w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium ${errors.stock ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.stock && (
                  <p className="text-danger text-xs mt-1 font-bold font-lato">{errors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-lato">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="spice, herbal, pooja, immunity"
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Categories & Suggestion Groups */}
          <div className="bg-white border border-gray-200 rounded-none p-6 space-y-6 shadow-green">
            {/* PUBLIC categories with 24px round thumbnail */}
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2 font-catamaran text-base">
                <Tag size={16} className="text-forest-700 shrink-0" /> பொதுப் பிரிவுகள் (PUBLIC Categories)
              </h3>
              <p className="text-xs text-gray-500 mb-3 font-lato">Multi-select: one item can belong to multiple categories</p>
              <div className="flex flex-wrap gap-2">
                {publicCategories.map((cat) => {
                  const active = form.categoryIds.includes(cat.id);
                  const catImg = getCategoryImage(cat);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer min-h-[44px] ${
                        active
                          ? "bg-forest text-cream-100 border-forest shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:border-forest-400"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#faf6ee] border border-gold/30 flex items-center justify-center flex-shrink-0 p-0.5">
                        <img
                          src={catImg}
                          alt={cat.label}
                          onError={(e) => {
                            e.currentTarget.src = EG_ICON;
                          }}
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestion Groups Multi-Select */}
            <div className="border-t border-gray-200 pt-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2 font-catamaran text-base">
                <Star size={16} className="text-gold-600 shrink-0" /> பரிந்துரை குழுக்கள் (Suggestion Groups)
              </h3>
              <p className="text-xs text-gray-500 mb-3 font-lato">
                Select which home page featured sections should include this item
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestionGroups.map((group) => {
                  const active = selectedGroupIds.includes(group.id);
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer min-h-[44px] ${
                        active
                          ? "bg-gold text-bark-900 border-gold shadow-sm"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-forest-700" : "bg-gray-400"}`}
                      />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{group.tamilName} ({group.name})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-forest text-cream-100 hover:bg-forest-700 font-extrabold py-3.5 text-base rounded-none shadow-green flex items-center justify-center gap-2 cursor-pointer transition-all font-lato min-h-[52px]"
          >
            <Save size={18} />
            {saved ? "சேமிக்கப்பட்டது! (Saved)..." : isEdit ? "பொருளை மாற்று (Update Item)" : "பொருளைச் சேர் (Add Item)"}
          </button>
        </form>

        {/* Live Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-20">
            <div className="bg-[#faf6ee] border border-gray-200 rounded-none p-5 space-y-4 shadow-green">
              <div className="flex items-center gap-2 text-forest-700 font-bold font-lato">
                <Eye size={16} /> நேரலை முன்னோட்டம் (Live Preview)
              </div>

              {selectedGroupIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedGroupIds.map((gid) => {
                    const g = suggestionGroups.find((gr) => gr.id === gid);
                    if (!g) return null;
                    return (
                      <span
                        key={g.id}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-bark-900 border border-gold"
                      >
                        ★ {g.tamilName}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="max-w-[240px] mx-auto">
                <ItemCard item={previewItem} showAddToCart={false} showCategories={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
