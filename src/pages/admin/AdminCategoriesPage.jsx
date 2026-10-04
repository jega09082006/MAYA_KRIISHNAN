import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Check, X, Star, ArrowRight, Tag, ToggleLeft, ToggleRight, RotateCcw } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getCategoryImage, EG_ICON } from "../../utils/images";

export default function AdminCategoriesPage() {
  const {
    publicCategories,
    addCategory,
    renameCategory,
    deleteCategory,
    suggestionGroups,
    updateGroup,
    items,
  } = useStore();

  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editImage, setEditImage] = useState("");

  function handleAddCategory() {
    if (!newCatLabel.trim()) return;
    addCategory(newCatLabel.trim(), newCatImage.trim());
    setNewCatLabel("");
    setNewCatImage("");
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

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <GoldLotusOrnament size={22} />
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900">
            Categories & Suggestion Groups <span className="font-tamil font-extrabold text-xl text-forest-700 ml-2">(பிரிவுகள்)</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm font-lato mt-0.5">
          பொதுப் பிரிவுகள் மற்றும் முகப்பு பரிந்துரை குழுக்களை நிர்வகிக்கவும்
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PUBLIC Categories */}
        <div className="bg-white border border-gray-200 rounded-none p-6 space-y-5 shadow-green">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <div className="w-8 h-8 rounded-none bg-forest-700 flex items-center justify-center text-gold">
              <Tag size={16} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 font-tamil text-base">பொதுப் பிரிவுகள் (Public Categories)</h2>
              <p className="text-xs text-gray-500 font-lato">வாடிக்கையாளர் வடிகட்டும் சில்லுகளில் தெரியும் ({publicCategories.length} Public Categories)</p>
            </div>
          </div>

          {/* Add new category form */}
          <div className="space-y-2.5 p-3 bg-gray-50 border border-gray-200">
            <p className="text-xs font-bold text-gray-700 font-tamil">புதிய பிரிவு சேர் (Add Category)</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Category name (e.g. மூலிகை)..."
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
                className="bg-forest text-cream-100 font-bold px-4 py-2 rounded-none hover:bg-forest-700 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-green shrink-0 font-lato"
              >
                <Plus size={15} /> சேர்
              </button>
            </div>
            <p className="text-[11px] text-gray-500 italic">Leave image URL empty to use default eg_icon.png.</p>
          </div>

          {/* List of PUBLIC categories */}
          <div className="space-y-3">
            {publicCategories.map((cat) => {
              const catItemCount = items.filter((i) =>
                (i.categoryIds || i.publicCategories || []).includes(cat.id)
              ).length;

              const catImg = getCategoryIcon ? getCategoryIcon(cat) : getCategoryImage(cat);
              const hasCustomImg = Boolean(cat.image || cat.imageUrl);

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-none border border-gray-200 hover:border-forest-400 hover:bg-gray-50/50 transition-all group bg-white"
                >
                  {/* 48px round thumbnail */}
                  <div className="w-12 h-12 rounded-full border border-gold/40 overflow-hidden bg-[#faf6ee] flex items-center justify-center p-1 flex-shrink-0 shadow-sm">
                    <img
                      src={catImg}
                      alt={cat.label}
                      onError={(e) => {
                        e.currentTarget.src = EG_ICON;
                      }}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>

                  {editingId === cat.id ? (
                    <div className="flex-1 space-y-1.5">
                      <input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="Category name..."
                        className="w-full border border-gray-300 rounded-none px-2 py-1 text-sm bg-gray-50 text-gray-900 font-medium"
                      />
                      <input
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="Image URL (empty for default)..."
                        className="w-full border border-gray-300 rounded-none px-2 py-1 text-xs font-mono bg-gray-50 text-gray-900"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-gray-900 text-sm font-tamil truncate">
                        {cat.label}
                      </h4>
                      <p className="text-xs text-gray-500 font-lato mt-0.5">
                        {catItemCount} பொருட்கள் ({catItemCount} items)
                      </p>
                    </div>
                  )}

                  {editingId === cat.id ? (
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={saveEdit}
                        className="p-1.5 text-forest-700 hover:bg-forest-100 rounded-none transition-colors cursor-pointer"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-none transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-forest-700 hover:bg-forest-100 rounded-none transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 text-danger hover:bg-red-50 rounded-none transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestion Groups List */}
        <div className="bg-white border border-gray-200 rounded-none p-6 space-y-5 shadow-green">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-none bg-gold text-bark-900 flex items-center justify-center">
                <Star size={16} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 font-tamil text-base">பரிந்துரை குழுக்கள் (Suggestion Groups)</h2>
                <p className="text-xs text-gray-500 font-lato">முகப்புப் பக்கத்தில் தனித்தனி பிரிவுகளாகத் தெரியும்</p>
              </div>
            </div>
            <Link
              to="/admin/suggestions"
              className="text-xs font-bold text-forest-700 hover:text-gold flex items-center gap-1 transition-colors font-lato"
            >
              Manage Groups <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {suggestionGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-3 p-3 rounded-none border border-gray-200 hover:border-gray-300 transition-all bg-white"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-gray-900 font-tamil truncate">
                      {group.tamilName}
                    </p>
                    <p className="text-xs text-gray-500 font-lato truncate">
                      {group.name} · {group.itemIds?.length || 0} பொருட்கள்
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateGroup(group.id, { isActive: !group.isActive })}
                    className={`cursor-pointer ${
                      group.isActive ? "text-forest-700" : "text-gray-300"
                    }`}
                    title={group.isActive ? "செயலில் உள்ளது" : "முடக்கப்பட்டது"}
                  >
                    {group.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <Link
                    to="/admin/suggestions"
                    className="p-1.5 rounded-none text-forest-700 hover:bg-forest-100 transition-colors"
                    title="நிர்வகி"
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
