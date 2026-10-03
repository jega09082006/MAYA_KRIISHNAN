import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Check, X, Star, ArrowRight, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function AdminCategoriesPage() {
  const {
    publicCategories,
    addCategory,
    renameCategory,
    deleteCategory,
    suggestionGroups,
    updateGroup,
  } = useStore();

  const [newCatLabel, setNewCatLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  function handleAddCategory() {
    if (!newCatLabel.trim()) return;
    addCategory(newCatLabel.trim());
    setNewCatLabel("");
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditLabel(cat.label);
  }

  function saveEdit() {
    if (!editLabel.trim()) return;
    renameCategory(editingId, editLabel.trim());
    setEditingId(null);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">பிரிவுகள் & பரிந்துரை குழுக்கள் (Categories)</h1>
        <p className="text-gray-500 text-sm">
          பொதுப் பிரிவுகள் மற்றும் முகப்பு பரிந்துரை குழுக்களை நிர்வகிக்கவும்
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── LEFT: Public Categories ─────────────── */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-sky to-blue-600 flex items-center justify-center">
              <Tag size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">பொதுப் பிரிவுகள் (Public Categories)</h2>
              <p className="text-xs text-gray-400">வாடிக்கையாளர் வடிகட்டும் சில்லுகளில் தெரியும் (5 Public Categories)</p>
            </div>
          </div>

          {/* Add new */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New category name…"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="input-field text-sm flex-1"
            />
            <button
              onClick={handleAddCategory}
              className="btn-sky flex items-center gap-1.5 py-2 px-4 text-sm flex-shrink-0 cursor-pointer"
            >
              <Plus size={15} /> சேர்
            </button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {publicCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-sky-200 hover:bg-sky-50/50 transition-all group"
              >
                {/* Color dot */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />

                {/* Label or edit input */}
                {editingId === cat.id ? (
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    className="flex-1 input-field text-sm py-1"
                  />
                ) : (
                  <span className="flex-1 font-bold text-gray-800 text-sm">
                    {cat.label}
                  </span>
                )}

                {/* Chip preview */}
                <span
                  className="hidden sm:block text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: cat.color + "20", color: cat.color }}
                >
                  Preview
                </span>

                {/* Actions */}
                {editingId === cat.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={saveEdit}
                      className="p-1.5 text-emerald-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-brand-sky hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Suggestion Groups List ────────── */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center">
                <Star size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">பரிந்துரை குழுக்கள் (Suggestion Groups)</h2>
                <p className="text-xs text-gray-400">முகப்புப் பக்கத்தில் தனித்தனி பிரிவுகளாகத் தெரியும்</p>
              </div>
            </div>
            <Link
              to="/admin/suggestions"
              className="text-xs font-bold text-brand-orange hover:text-brand-pink flex items-center gap-1 transition-colors"
            >
              Manage Groups <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {suggestionGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all bg-white"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {group.tamilName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {group.name} · {group.itemIds?.length || 0} பொருட்கள்
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateGroup(group.id, { isActive: !group.isActive })}
                    className={`cursor-pointer ${
                      group.isActive ? "text-emerald-600" : "text-gray-300"
                    }`}
                    title={group.isActive ? "செயலில் உள்ளது" : "முடக்கப்பட்டது"}
                  >
                    {group.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <Link
                    to="/admin/suggestions"
                    className="p-1.5 rounded-lg text-brand-orange hover:bg-orange-50 transition-colors"
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
