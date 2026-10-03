import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Eye, Star, Tag, Leaf, Upload, Image as ImageIcon } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ItemCard from "../../components/ItemCard";

const PRESET_PHOTOS = [
  { name: "மூலிகை (Herb)", url: "/photos/herb.svg", emoji: "🌿" },
  { name: "காரவகை (Spice)", url: "/photos/spice.svg", emoji: "🌶️" },
  { name: "மளிகை (Grocery)", url: "/photos/grocery.svg", emoji: "🌾" },
  { name: "பூஜை (Pooja)", url: "/photos/pooja.svg", emoji: "🪔" },
  { name: "எண்ணெய் (Oil)", url: "/photos/oil.svg", emoji: "🧴" },
  { name: "மருந்து (Medicine)", url: "/photos/medicine.svg", emoji: "💊" },
];

const EMPTY_FORM = {
  tamilName: "",
  englishName: "",
  description: "",
  price: "",
  unit: "100g",
  stock: "",
  imageUrl: "/photos/herb.svg",
  emoji: "🌿",
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
        imageUrl: existingItem.imageUrl || existingItem.image || "/photos/herb.svg",
        emoji: existingItem.emoji || "🌿",
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

  // Live preview object
  const previewItem = {
    id: id || "preview",
    tamilName: form.tamilName || "தமிழ் பெயர்",
    englishName: form.englishName || "English Name",
    description: form.description || "பொருள் விளக்கம் (Description)…",
    price: Number(form.price) || 0,
    unit: form.unit || "100g",
    stock: Number(form.stock) || 0,
    imageUrl: form.imageUrl,
    emoji: form.emoji || "🌿",
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

    // Update suggestion group memberships
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

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/items")}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEdit ? "பொருளை மாற்று (Edit Item)" : "புதிய பொருள் சேர் (Add New Item)"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? "Update item information and photo" : "Add traditional provisions or country medicine item"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="card p-6 space-y-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Leaf size={16} className="text-emerald-600" /> பொருள் விவரங்கள் (Product Details)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">தமிழ் பெயர் (Tamil Name) *</label>
                <input
                  type="text"
                  value={form.tamilName}
                  onChange={(e) => setForm({ ...form, tamilName: e.target.value })}
                  placeholder="உ.ம். மஞ்சள் / கருஞ்சீரகம்"
                  className={`input-field ${errors.tamilName ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.tamilName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.tamilName}</p>
                )}
              </div>

              <div>
                <label className="label">English Name *</label>
                <input
                  type="text"
                  value={form.englishName}
                  onChange={(e) => setForm({ ...form, englishName: e.target.value })}
                  placeholder="e.g. Turmeric / Black Cumin"
                  className={`input-field ${errors.englishName ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.englishName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.englishName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">விளக்கம் (Short English + Tamil Description)</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Pure traditional turmeric. தூய சமையல் மஞ்சள்..."
                className="input-field resize-none"
              />
            </div>

            {/* Product Photo Upload & Selection */}
            <div>
              <label className="label font-bold flex items-center gap-1.5">
                <ImageIcon size={16} className="text-brand-orange" /> பொருள் புகைப்படம் (Product Photo Upload)
              </label>

              <div className="space-y-4">
                {/* File Upload Button & Preview */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-brand-orange bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{form.emoji || "🌿"}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-orange to-brand-pink text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer">
                      <Upload size={14} /> கணினியிலிருந்து புகைப்படம் பதிவேற்றுக (Upload Photo File)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-gray-500 font-medium">Supported formats: PNG, JPG, WEBP, SVG</p>
                  </div>
                </div>

                {/* Preset Photos Selection */}
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">அல்லது மாதிரி புகைப்படத்தைத் தேர்வு செய்க (Or Select Preset Photo):</p>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_PHOTOS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: preset.url, emoji: preset.emoji })}
                        className={`group relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          form.imageUrl === preset.url
                            ? "border-brand-orange ring-2 ring-brand-orange/40 scale-105 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-bold text-center py-0.5 truncate px-1">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image URL Input */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">புகைப்பட சுட்டி (Image URL Path):</label>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/photos/herb.svg or https://example.com/photo.jpg"
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">விலை (Price in ₹) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="60"
                  className={`input-field ${errors.price ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="label">அளவு (Unit / Weight) *</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="100g, 250g, 500ml, 1 piece"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">இருப்பு (Stock) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="50"
                  className={`input-field ${errors.stock ? "border-red-400 ring-1 ring-red-400" : ""}`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="spice, herbal, pooja, immunity"
                className="input-field"
              />
            </div>
          </div>

          {/* Categories & Suggestion Groups */}
          <div className="card p-6 space-y-6">
            {/* PUBLIC categories */}
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Tag size={16} className="text-brand-sky" /> பொதுப் பிரிவுகள் (PUBLIC Categories)
              </h3>
              <p className="text-xs text-gray-500 mb-3">Multi-select: one item can belong to multiple categories</p>
              <div className="flex flex-wrap gap-2">
                {publicCategories.map((cat) => {
                  const active = form.categoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 cursor-pointer ${
                        active
                          ? "text-white border-transparent shadow-md"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: active ? "white" : cat.color }}
                      />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestion Groups Multi-Select */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Star size={16} className="text-brand-orange" /> பரிந்துரை குழுக்கள் (Suggestion Groups)
              </h3>
              <p className="text-xs text-gray-500 mb-3">
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 cursor-pointer ${
                        active
                          ? "text-white border-transparent shadow-md scale-105"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                      style={active ? { backgroundColor: group.color, borderColor: group.color } : {}}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: active ? "white" : group.color }}
                      />
                      {group.tamilName} ({group.name})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn-primary w-full py-3 text-base flex items-center justify-center gap-2 cursor-pointer ${
              saved ? "from-brand-green to-emerald-500" : ""
            }`}
          >
            <Save size={18} />
            {saved ? "சேமிக்கப்பட்டது! (Saved)..." : isEdit ? "பொருளை மாற்று (Update Item)" : "பொருளைச் சேர் (Add Item)"}
          </button>
        </form>

        {/* Live Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-20">
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-2 text-brand-pink font-bold">
                <Eye size={16} /> நேரலை முன்னோட்டம் (Live Preview)
              </div>

              {/* Badges preview */}
              {selectedGroupIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedGroupIds.map((gid) => {
                    const g = suggestionGroups.find((gr) => gr.id === gid);
                    if (!g) return null;
                    return (
                      <span
                        key={g.id}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: g.color + "20", color: g.color }}
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
