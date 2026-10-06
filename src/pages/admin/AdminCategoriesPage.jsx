import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Check, X, Star, ArrowRight, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getCategoryImage, EG_ICON } from "../../utils/images";

export default function AdminCategoriesPage() {
  const {
    publicCategories, addCategory, renameCategory, deleteCategory,
    suggestionGroups, updateGroup, items,
  } = useStore();
  const { lang, t } = useLang();

  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [editingId,   setEditingId]   = useState(null);
  const [editLabel,   setEditLabel]   = useState("");
  const [editImage,   setEditImage]   = useState("");

  function handleAddCategory() {
    if (!newCatLabel.trim()) return;
    addCategory(newCatLabel.trim(), newCatImage.trim());
    setNewCatLabel(""); setNewCatImage("");
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditLabel(cat.label);
    setEditImage(cat.image || cat.imageUrl || "");
  }

  function saveEdit() {
    if (!editLabel.trim()) return;
    renameCategory(editingId, editLabel.trim(), editImage.trim());
    setEditingId(null);
  }

  const catsSectionTitle   = lang === "ta" ? "பொதுப் பிரிவுகள்"    : "Public Categories";
  const groupsSectionTitle = lang === "ta" ? "பரிந்துரை குழுக்கள்" : "Suggestion Groups";
  const addCatLabel        = lang === "ta" ? "புதிய பிரிவு சேர்"   : "Add Category";
  const itemsLabel         = lang === "ta" ? "பொருட்கள்"            : "items";
  const activeLabel        = lang === "ta" ? "செயலில் உள்ளது"       : "Active";
  const inactiveLabel      = lang === "ta" ? "முடக்கப்பட்டது"       : "Inactive";

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-baseline flex-wrap gap-2">
          <GoldLotusOrnament size={22} className="self-center shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold font-catamaran text-gray-900">
            {t("adminCategories")}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {lang === "ta"
            ? "பொதுப் பிரிவுகள் மற்றும் முகப்பு பரிந்துரை குழுக்களை நிர்வகிக்கவும்"
            : "Manage public categories and home page suggestion groups"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Public Categories ── */}
        <div className="bg-white border border-gray-200 rounded-none p-6 space-y-5 shadow-green">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <div className="w-8 h-8 rounded-none bg-forest-700 flex items-center justify-center text-gold shrink-0"><Tag size={16} /></div>
            <div className="min-w-0">
              <h2 className="font-bold text-gray-900 font-catamaran text-base">{catsSectionTitle}</h2>
              <p className="text-xs text-gray-500">({publicCategories.length})</p>
            </div>
          </div>

          {/* Add new */}
          <div className="space-y-2.5 p-3 bg-gray-50 border border-gray-200">
            <p className="text-xs font-bold text-gray-700 font-catamaran">{addCatLabel}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder={lang === "ta" ? "பிரிவு பெயர் (எ.கா. மூலிகை)..." : "Category name (e.g. Herbs)..."}
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                className="flex-1 border border-gray-200 rounded-none px-3 py-2 text-sm focus:ring-2 focus:ring-forest bg-white text-gray-900 font-medium"
              />
              <input
                type="text"
                placeholder="Image URL (optional)..."
                value={newCatImage}
                onChange={(e) => setNewCatImage(e.target.value)}
                className="flex-1 border border-gray-200 rounded-none px-3 py-2 text-xs font-mono bg-white text-gray-900"
              />
              <button
                onClick={handleAddCategory}
                className="bg-forest text-cream-100 font-bold px-4 py-2 rounded-none hover:bg-forest-700 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-green shrink-0"
              >
                <Plus size={15} /> {lang === "ta" ? "சேர்" : "Add"}
              </button>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-3">
            {publicCategories.map((cat) => {
              const catName    = lang === "ta" ? (cat.tamilName || cat.label) : (cat.englishName || cat.label);
              const catImg     = getCategoryImage(cat);
              const catItemCnt = items.filter((i) => (i.categoryIds || i.publicCategories || []).includes(cat.id)).length;

              return (
                <div key={cat.id} className="flex items-center justify-between gap-3 p-3.5 rounded-none border border-gray-200 hover:border-forest-400 hover:bg-gray-50/50 transition-all group bg-white">
                  <div className="w-12 h-12 rounded-full border border-gold/40 overflow-hidden bg-[#faf6ee] flex items-center justify-center p-1 flex-shrink-0 shadow-sm">
                    <img src={catImg} alt={catName} onError={(e) => { e.currentTarget.src = EG_ICON; }} className="w-full h-full object-contain rounded-full" />
                  </div>

                  {editingId === cat.id ? (
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="Category name..." className="w-full border border-gray-300 rounded-none px-2 py-1 text-sm bg-gray-50 text-gray-900 font-medium" />
                      <input value={editImage} onChange={(e) => setEditImage(e.target.value)} placeholder="Image URL (empty for default)..." className="w-full border border-gray-300 rounded-none px-2 py-1 text-xs font-mono bg-gray-50 text-gray-900" />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-gray-900 text-sm font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug">{catName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{catItemCnt} {itemsLabel}</p>
                    </div>
                  )}

                  {editingId === cat.id ? (
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={saveEdit} className="p-1.5 text-forest-700 hover:bg-forest-100 rounded-none transition-colors cursor-pointer" title="Save"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-none transition-colors cursor-pointer" title="Cancel"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => startEdit(cat)} className="p-1.5 text-forest-700 hover:bg-forest-100 rounded-none transition-colors cursor-pointer" title={t("edit")}><Edit2 size={15} /></button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-danger hover:bg-red-50 rounded-none transition-colors cursor-pointer" title={t("delete")}><Trash2 size={15} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Suggestion Groups ── */}
        <div className="bg-white border border-gray-200 rounded-none p-6 space-y-5 shadow-green">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-none bg-gold text-bark-900 flex items-center justify-center shrink-0"><Star size={16} /></div>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 font-catamaran text-base">{groupsSectionTitle}</h2>
              </div>
            </div>
            <Link to="/admin/suggestions" className="text-xs font-bold text-forest-700 hover:text-gold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 min-h-[44px] px-1">
              {lang === "ta" ? "நிர்வகி" : "Manage"} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {suggestionGroups.map((group) => {
              const gName = lang === "ta" ? group.tamilName : group.name;
              return (
                <div key={group.id} className="flex items-center justify-between gap-3 p-3 rounded-none border border-gray-200 hover:border-gray-300 transition-all bg-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug">{gName}</p>
                      <p className="text-xs text-gray-500 min-w-0 [overflow-wrap:anywhere] leading-snug">
                        {group.itemIds?.length || 0} {itemsLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateGroup(group.id, { isActive: !group.isActive })}
                      className={`cursor-pointer ${group.isActive ? "text-forest-700" : "text-gray-300"}`}
                      title={group.isActive ? activeLabel : inactiveLabel}
                    >
                      {group.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                    <Link to="/admin/suggestions" className="p-1.5 rounded-none text-forest-700 hover:bg-forest-100 transition-colors" title={lang === "ta" ? "நிர்வகி" : "Manage"}>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
