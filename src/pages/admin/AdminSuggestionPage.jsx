import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Search,
  Eye,
  Sparkles,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  FolderPlus,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { getEmojiGradient } from "../../data/mockData";
import ItemCard from "../../components/ItemCard";
import Modal from "../../components/Modal";

const PRESET_COLORS = [
  "#FF7A00",
  "#FF4D8D",
  "#10B981",
  "#0284C7",
  "#9C27B0",
  "#F59E0B",
  "#EC4899",
  "#6366F1",
];

export default function AdminSuggestionPage() {
  const {
    items,
    suggestionGroups,
    activeSuggestionGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    moveGroup,
    addItemToGroup,
    removeItemFromGroup,
    moveItemInGroup,
    getGroupsOfItem,
  } = useStore();

  const [selectedGroupId, setSelectedGroupId] = useState(
    suggestionGroups[0]?.id || null
  );
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupForm, setGroupForm] = useState({
    name: "",
    tamilName: "",
    color: "#FF7A00",
  });

  // Ensure selected group is valid
  const currentGroup =
    suggestionGroups.find((g) => g.id === selectedGroupId) ||
    suggestionGroups[0] ||
    null;

  const currentGroupItemIds = currentGroup?.itemIds || [];
  const currentGroupItems = currentGroupItemIds
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean);

  // Filter items available to add to currentGroup (can search in Tamil or English)
  const availableToAdd = items.filter((i) => {
    const notInGroup = !currentGroupItemIds.includes(i.id);
    if (!notInGroup) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (i.tamilName && i.tamilName.toLowerCase().includes(q)) ||
      (i.englishName && i.englishName.toLowerCase().includes(q)) ||
      i.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  function openCreateModal() {
    setEditingGroup(null);
    setGroupForm({
      name: "",
      tamilName: "",
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
    });
    setModalOpen(true);
  }

  function openEditModal(group, e) {
    e?.stopPropagation();
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      tamilName: group.tamilName || "",
      color: group.color || "#FF7A00",
    });
    setModalOpen(true);
  }

  function handleSaveGroup(e) {
    e.preventDefault();
    if (!groupForm.name.trim()) return;
    if (editingGroup) {
      updateGroup(editingGroup.id, {
        name: groupForm.name.trim(),
        tamilName: groupForm.tamilName.trim() || groupForm.name.trim(),
        color: groupForm.color,
      });
    } else {
      const newG = createGroup({
        name: groupForm.name,
        tamilName: groupForm.tamilName,
        color: groupForm.color,
      });
      setSelectedGroupId(newG.id);
    }
    setModalOpen(false);
  }

  function handleDeleteGroup(groupId, e) {
    e?.stopPropagation();
    if (window.confirm("Are you sure you want to delete this suggestion group?")) {
      deleteGroup(groupId);
      if (selectedGroupId === groupId) {
        const remaining = suggestionGroups.filter((g) => g.id !== groupId);
        setSelectedGroupId(remaining[0]?.id || null);
      }
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            பரிந்துரை குழுக்கள் மேலாண்மை (Suggestion Groups)
          </h1>
          <p className="text-gray-500 text-sm">
            Create and organize multiple recommendation sections on the home page
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 cursor-pointer text-sm"
        >
          <FolderPlus size={16} /> + புதிய குழு (New Group)
        </button>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT: Groups List (4 cols) ────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-brand-orange" /> குழுக்கள் (Groups)
              </span>
              <span className="badge-orange">{suggestionGroups.length}</span>
            </h3>

            {suggestionGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <p>குழுக்கள் எதுவும் இல்லை. புதிய குழுவை உருவாக்கவும்.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...suggestionGroups]
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((group, idx) => {
                    const isSelected = currentGroup?.id === group.id;
                    return (
                      <div
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-orange bg-orange-50/50 shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: group.color }}
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-gray-900 truncate">
                                {group.tamilName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {group.name}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                            {group.itemIds?.length || 0} பொருட்கள்
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-100/80">
                          {/* Active toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateGroup(group.id, { isActive: !group.isActive });
                            }}
                            className={`flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                              group.isActive ? "text-emerald-600" : "text-gray-400"
                            }`}
                          >
                            {group.isActive ? (
                              <>
                                <ToggleRight size={18} /> நேரலை (Active)
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={18} /> முடக்கம் (Inactive)
                              </>
                            )}
                          </button>

                          {/* Reorder and Edit / Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveGroup(group.id, "up");
                              }}
                              disabled={idx === 0}
                              className="p-1 text-gray-400 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                              title="மேலே நகர்த்து"
                            >
                              <ChevronUp size={15} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveGroup(group.id, "down");
                              }}
                              disabled={idx === suggestionGroups.length - 1}
                              className="p-1 text-gray-400 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                              title="கீழே நகர்த்து"
                            >
                              <ChevronDown size={15} />
                            </button>
                            <button
                              onClick={(e) => openEditModal(group, e)}
                              className="p-1 text-brand-sky hover:text-blue-600 cursor-pointer"
                              title="மாற்று"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteGroup(group.id, e)}
                              className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                              title="நீக்கு"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* ── MIDDLE: Items of Selected Group (4 cols) ──────── */}
        <div className="lg:col-span-4 space-y-4">
          {currentGroup ? (
            <>
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: currentGroup.color }}
                      />
                      {currentGroup.tamilName}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      வரிசை ஒழுங்கு ({currentGroupItems.length} பொருட்கள்)
                    </p>
                  </div>
                </div>

                {/* Items currently in group */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {currentGroupItems.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">
                      இந்தக் குழுவில் பொருட்கள் எதுவும் இல்லை. கீழே இருந்து சேர்க்கவும்.
                    </p>
                  ) : (
                    currentGroupItems.map((item, idx) => {
                      const gradientClass = getEmojiGradient(item.emoji);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100"
                        >
                          <span className="text-xs font-extrabold text-brand-orange w-5 text-center">
                            #{idx + 1}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 text-sm`}
                          >
                            {item.emoji || "🌿"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {item.tamilName}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {item.englishName} · ₹{item.price}
                            </p>
                          </div>
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              onClick={() => moveItemInGroup(currentGroup.id, item.id, "up")}
                              disabled={idx === 0}
                              className="p-0.5 rounded text-gray-400 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp size={13} />
                            </button>
                            <button
                              onClick={() => moveItemInGroup(currentGroup.id, item.id, "down")}
                              disabled={idx === currentGroupItems.length - 1}
                              className="p-0.5 rounded text-gray-400 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown size={13} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItemFromGroup(currentGroup.id, item.id)}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-50 cursor-pointer flex-shrink-0"
                            title="குழுவிலிருந்து நீக்கு"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add items to this group */}
              <div className="card p-5">
                <h4 className="font-bold text-gray-900 text-sm mb-2">
                  பொருட்களைச் சேர் (Add Items)
                </h4>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Tamil / English name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-9 text-xs"
                  />
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {availableToAdd.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      {search ? "பொருட்கள் எதுவும் கிடைக்கவில்லை" : "அனைத்து பொருட்களும் இந்தக் குழுவில் உள்ளன"}
                    </p>
                  ) : (
                    availableToAdd.map((item) => {
                      const gradientClass = getEmojiGradient(item.emoji);
                      const otherGroups = getGroupsOfItem(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 text-sm`}
                          >
                            {item.emoji || "🌿"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {item.tamilName}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {item.englishName}
                            </p>
                            {otherGroups.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {otherGroups.map((og) => (
                                  <span
                                    key={og.id}
                                    className="text-[9px] font-semibold px-1.5 py-0.2 rounded"
                                    style={{
                                      backgroundColor: og.color + "18",
                                      color: og.color,
                                    }}
                                  >
                                    {og.name.split(" ")[0]}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => addItemToGroup(currentGroup.id, item.id)}
                            className="p-1.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-pink text-white hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
                            title="குழுவில் சேர்"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card p-8 text-center text-gray-400">
              குழுவைத் தேர்ந்தெடுக்கவும்
            </div>
          )}
        </div>

        {/* ── RIGHT: Live Home Page Preview (4 cols) ────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Eye size={16} className="text-brand-pink" />
              <h3 className="font-bold text-gray-900 text-sm">முகப்பு முன்னோட்டம் (Home Preview)</h3>
            </div>

            {/* Mock Header */}
            <div className="bg-white rounded-xl border border-gray-100 px-3 py-2 mb-3 flex items-center justify-between opacity-80">
              <span className="font-extrabold text-xs bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent">
                MAYA_KRISHNAN
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">மாயகிருஷ்ணன்</span>
            </div>

            {/* Active Groups Preview */}
            <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
              {activeSuggestionGroups.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-xs">
                  செயலில் உள்ள குழுக்கள் எதுவும் இல்லை.
                </div>
              ) : (
                activeSuggestionGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-2xl p-3 bg-white shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <span className="font-extrabold text-xs text-gray-900">
                          {group.tamilName}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400">
                        {group.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {group.items.slice(0, 4).map((item) => (
                        <div key={`${group.id}-${item.id}`} className="scale-95">
                          <ItemCard item={item} showAddToCart={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Group Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGroup ? "குழுவை மாற்று (Edit Group)" : "புதிய பரிந்துரை குழு (New Group)"}
        size="md"
      >
        <form onSubmit={handleSaveGroup} className="space-y-4">
          <div>
            <label className="label">தமிழ் பெயர் (Tamil Name) *</label>
            <input
              type="text"
              value={groupForm.tamilName}
              onChange={(e) => setGroupForm({ ...groupForm, tamilName: e.target.value })}
              placeholder="உ.ம். பண்டிகை & பூஜை சிறப்பு"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">English Name *</label>
            <input
              type="text"
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
              placeholder="e.g. Festival & Pooja Specials"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">குழு நிறம் (Accent Color)</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setGroupForm({ ...groupForm, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    groupForm.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={groupForm.color}
                onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer ml-2"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost flex-1 border border-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 cursor-pointer">
              {editingGroup ? "Save Changes" : "Create Group"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
