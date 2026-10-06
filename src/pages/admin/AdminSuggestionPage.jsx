import React, { useState } from "react";
import {
  ChevronUp, ChevronDown, Plus, Minus, Search, Eye,
  Edit2, Trash2, ToggleLeft, ToggleRight, FolderPlus,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import ItemCard from "../../components/ItemCard";
import Modal from "../../components/Modal";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, EG_ICON } from "../../utils/images";

const PRESET_COLORS = [
  "#2d5a3d", "#d99c2b", "#1d3d29", "#b3402a",
  "#4e4034", "#9c8872", "#615041", "#796653",
];

export default function AdminSuggestionPage() {
  const {
    items, suggestionGroups, activeSuggestionGroups,
    createGroup, updateGroup, deleteGroup, moveGroup,
    addItemToGroup, removeItemFromGroup, moveItemInGroup, getGroupsOfItem,
  } = useStore();
  const { lang, t } = useLang();

  const [selectedGroupId, setSelectedGroupId] = useState(suggestionGroups[0]?.id || null);
  const [search,          setSearch]           = useState("");
  const [modalOpen,       setModalOpen]        = useState(false);
  const [editingGroup,    setEditingGroup]      = useState(null);
  const [groupForm,       setGroupForm]        = useState({ name: "", tamilName: "", color: "#2d5a3d" });

  const currentGroup      = suggestionGroups.find((g) => g.id === selectedGroupId) || suggestionGroups[0] || null;
  const currentGroupItems = (currentGroup?.itemIds || []).map((id) => items.find((i) => i.id === id)).filter(Boolean);

  const availableToAdd = items.filter((i) => {
    if ((currentGroup?.itemIds || []).includes(i.id)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (i.tamilName   && i.tamilName.toLowerCase().includes(q)) ||
      (i.englishName && i.englishName.toLowerCase().includes(q)) ||
      i.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  function openCreateModal() {
    setEditingGroup(null);
    setGroupForm({ name: "", tamilName: "", color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)] });
    setModalOpen(true);
  }

  function openEditModal(group, e) {
    e?.stopPropagation();
    setEditingGroup(group);
    setGroupForm({ name: group.name, tamilName: group.tamilName || "", color: group.color || "#2d5a3d" });
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
      const newG = createGroup(groupForm);
      setSelectedGroupId(newG.id);
    }
    setModalOpen(false);
  }

  function handleDeleteGroup(groupId, e) {
    e?.stopPropagation();
    const confirmMsg = lang === "ta"
      ? "இந்த பரிந்துரை குழுவை நீக்க விரும்புகிறீர்களா?"
      : "Are you sure you want to delete this suggestion group?";
    if (window.confirm(confirmMsg)) {
      deleteGroup(groupId);
      if (selectedGroupId === groupId) {
        const remaining = suggestionGroups.filter((g) => g.id !== groupId);
        setSelectedGroupId(remaining[0]?.id || null);
      }
    }
  }

  const activeLabel   = lang === "ta" ? "நேரலை"  : "Active";
  const inactiveLabel = lang === "ta" ? "முடக்கம்" : "Inactive";
  const itemsLabel    = lang === "ta" ? "பொருட்கள்" : "items";
  const noGroupLabel  = lang === "ta" ? "குழுக்கள் எதுவும் இல்லை. புதிய குழுவை உருவாக்கவும்." : "No groups yet. Create a new group.";
  const noItemsInGrp  = lang === "ta" ? "இந்தக் குழுவில் பொருட்கள் எதுவும் இல்லை." : "No items in this group yet.";
  const selectGroupLbl= lang === "ta" ? "குழுவைத் தேர்ந்தெடுக்கவும்" : "Select a group";
  const addItemsLabel = lang === "ta" ? "பொருட்களைச் சேர்" : "Add Items";
  const previewLabel  = lang === "ta" ? "முகப்பு முன்னோட்டம்" : "Home Preview";
  const noActiveGrp   = lang === "ta" ? "செயலில் உள்ள குழுக்கள் எதுவும் இல்லை." : "No active groups.";
  const orderLabel    = lang === "ta" ? "வரிசை ஒழுங்கு" : "Display order";
  const newGroupLabel = lang === "ta" ? "+ புதிய குழு" : "+ New Group";
  const descLabel     = lang === "ta"
    ? "முகப்பு பக்கத்தில் பரிந்துரை பிரிவுகளை உருவாக்கி நிர்வகிக்கவும்"
    : "Create and organize recommendation sections on the home page";

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-baseline flex-wrap gap-2">
            <GoldLotusOrnament size={22} className="self-center shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold font-catamaran text-gray-900">
              {t("adminSuggestions")}
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">{descLabel}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-forest text-cream-100 font-bold px-4 py-2.5 rounded-none hover:bg-forest-700 transition-all flex items-center gap-2 shadow-green text-xs cursor-pointer border-0 shrink-0 min-h-[44px]"
        >
          <FolderPlus size={16} /> {newGroupLabel}
        </button>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Groups List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-none p-5 shadow-green">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between font-catamaran text-base border-b border-gray-200 pb-2">
              <span className="flex items-center gap-1.5">
                <GoldLotusOrnament size={16} /> {lang === "ta" ? "குழுக்கள்" : "Groups"}
              </span>
              <span className="bg-forest-100 text-forest-800 text-xs px-2 py-0.5 rounded-full font-bold">{suggestionGroups.length}</span>
            </h3>

            {suggestionGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm"><p className="font-catamaran">{noGroupLabel}</p></div>
            ) : (
              <div className="space-y-2">
                {[...suggestionGroups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((group, idx) => {
                  const isSelected = currentGroup?.id === group.id;
                  const gName = lang === "ta" ? group.tamilName : group.name;
                  return (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroupId(group.id)}
                      className={`p-3 rounded-none border transition-all cursor-pointer ${isSelected ? "border-forest-700 bg-forest-50/50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                          <p className="font-bold text-sm text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug">{gName}</p>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 flex-shrink-0">
                          {group.itemIds?.length || 0} {itemsLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateGroup(group.id, { isActive: !group.isActive }); }}
                          className={`flex items-center gap-1 text-xs font-bold cursor-pointer min-h-[44px] px-1 font-catamaran ${group.isActive ? "text-forest-700" : "text-gray-400"}`}
                        >
                          {group.isActive
                            ? <><ToggleRight size={18} /> {activeLabel}</>
                            : <><ToggleLeft size={18} /> {inactiveLabel}</>
                          }
                        </button>
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); moveGroup(group.id, "up"); }} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-forest-700 disabled:opacity-20 cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center"><ChevronUp size={15} /></button>
                          <button onClick={(e) => { e.stopPropagation(); moveGroup(group.id, "down"); }} disabled={idx === suggestionGroups.length - 1} className="p-1.5 text-gray-400 hover:text-forest-700 disabled:opacity-20 cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center"><ChevronDown size={15} /></button>
                          <button onClick={(e) => openEditModal(group, e)} className="p-1.5 text-forest-700 hover:text-gold cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center"><Edit2 size={13} /></button>
                          <button onClick={(e) => handleDeleteGroup(group.id, e)} className="p-1.5 text-danger hover:text-red-700 cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: Items of selected group */}
        <div className="lg:col-span-4 space-y-4">
          {currentGroup ? (
            <>
              <div className="bg-white border border-gray-200 rounded-none p-5 shadow-green">
                <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2 font-catamaran">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentGroup.color }} />
                      {lang === "ta" ? currentGroup.tamilName : currentGroup.name}
                    </h3>
                    <p className="text-xs text-gray-500">{orderLabel} ({currentGroupItems.length} {itemsLabel})</p>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {currentGroupItems.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6 font-catamaran">{noItemsInGrp}</p>
                  ) : (
                    currentGroupItems.map((item, idx) => {
                      const name   = lang === "ta" ? item.tamilName : item.englishName;
                      const imgSrc = getItemImage(item);
                      const hasImg = Boolean(item.image || item.imageUrl);
                      return (
                        <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-none bg-gray-50 border border-gray-200">
                          <span className="text-xs font-extrabold text-forest-700 w-5 text-center font-catamaran shrink-0">#{idx + 1}</span>
                          <div className="w-8 h-8 rounded-none bg-[#faf6ee] border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 p-0.5">
                            <img src={imgSrc} alt={name} onError={(e) => { e.currentTarget.src = EG_ICON; }} className={`w-full h-full ${hasImg ? "object-cover" : "object-contain"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-tight">{name}</p>
                            <p className="text-[10px] text-gray-500 leading-tight">₹{item.price.toLocaleString("en-IN")}</p>
                          </div>
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button onClick={() => moveItemInGroup(currentGroup.id, item.id, "up")} disabled={idx === 0} className="p-0.5 rounded text-gray-400 hover:text-forest-700 disabled:opacity-20 cursor-pointer"><ChevronUp size={13} /></button>
                            <button onClick={() => moveItemInGroup(currentGroup.id, item.id, "down")} disabled={idx === currentGroupItems.length - 1} className="p-0.5 rounded text-gray-400 hover:text-forest-700 disabled:opacity-20 cursor-pointer"><ChevronDown size={13} /></button>
                          </div>
                          <button onClick={() => removeItemFromGroup(currentGroup.id, item.id)} className="p-1 rounded-none text-danger hover:bg-red-50 cursor-pointer flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"><Minus size={14} /></button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add items */}
              <div className="bg-white border border-gray-200 rounded-none p-5 shadow-green">
                <h4 className="font-bold text-gray-900 text-sm mb-2 font-catamaran">{addItemsLabel}</h4>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={lang === "ta" ? "தமிழ் / English பெயர்..." : "Search Tamil / English name…"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-none px-3.5 py-1.5 pl-8 text-xs bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {availableToAdd.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4 font-catamaran">
                      {search
                        ? (lang === "ta" ? "பொருட்கள் எதுவும் கிடைக்கவில்லை" : "No items found")
                        : (lang === "ta" ? "அனைத்து பொருட்களும் இந்தக் குழுவில் உள்ளன" : "All items are already in this group")}
                    </p>
                  ) : (
                    availableToAdd.map((item) => {
                      const name      = lang === "ta" ? item.tamilName : item.englishName;
                      const imgSrc    = getItemImage(item);
                      const hasImg    = Boolean(item.image || item.imageUrl);
                      const otherGrps = getGroupsOfItem(item.id);
                      return (
                        <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-none hover:bg-gray-50 transition-colors border border-gray-200">
                          <div className="w-8 h-8 rounded-none bg-[#faf6ee] overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0 p-0.5">
                            <img src={imgSrc} alt={name} onError={(e) => { e.currentTarget.src = EG_ICON; }} className={`w-full h-full ${hasImg ? "object-cover" : "object-contain"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-tight">{name}</p>
                            {otherGrps.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {otherGrps.map((og) => {
                                  const ogName = lang === "ta" ? og.tamilName : og.name;
                                  return (
                                    <span key={og.id} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold-100 text-bark-900 border border-gold">
                                      {ogName.split(" ")[0]}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <button onClick={() => addItemToGroup(currentGroup.id, item.id)} className="p-1.5 rounded-none bg-gold text-bark-900 hover:bg-gold-600 font-bold transition-all cursor-pointer flex-shrink-0 shadow-sm min-h-[36px] min-w-[36px] flex items-center justify-center">
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
            <div className="bg-white border border-gray-200 rounded-none p-8 text-center text-gray-400 font-catamaran">{selectGroupLbl}</div>
          )}
        </div>

        {/* RIGHT: Live Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-none p-5 shadow-green">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Eye size={16} className="text-forest-700" />
              <h3 className="font-bold text-gray-900 text-sm font-catamaran">{previewLabel}</h3>
            </div>

            <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
              {activeSuggestionGroups.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-none p-6 text-center text-gray-400 text-xs font-catamaran">{noActiveGrp}</div>
              ) : (
                activeSuggestionGroups.map((group) => {
                  const gName = lang === "ta" ? group.tamilName : group.name;
                  return (
                    <div key={group.id} className="border border-gray-200 rounded-none p-3 bg-cream-50 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                          <span className="font-extrabold text-xs text-bark-900 font-catamaran min-w-0 [overflow-wrap:anywhere]">{gName}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.items.slice(0, 4).map((item) => (
                          <div key={`${group.id}-${item.id}`} className="scale-95">
                            <ItemCard item={item} showAddToCart={false} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGroup
          ? (lang === "ta" ? "குழுவை மாற்று" : "Edit Group")
          : (lang === "ta" ? "புதிய பரிந்துரை குழு" : "New Suggestion Group")}
        size="md"
      >
        <form onSubmit={handleSaveGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
              {lang === "ta" ? "தமிழ் பெயர் *" : "Tamil Name *"}
            </label>
            <input type="text" value={groupForm.tamilName} onChange={(e) => setGroupForm({ ...groupForm, tamilName: e.target.value })} placeholder="உ.ம். பண்டிகை & பூஜை சிறப்பு" className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">English Name *</label>
            <input type="text" value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} placeholder="e.g. Festival & Pooja Specials" className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-catamaran">
              {lang === "ta" ? "குழு நிறம்" : "Accent Colour"}
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setGroupForm({ ...groupForm, color: c })} className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${groupForm.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : ""}`} style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={groupForm.color} onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })} className="w-8 h-8 rounded-none border-0 cursor-pointer ml-2" />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setModalOpen(false)} className="bg-white text-gray-700 border border-gray-300 font-bold py-2.5 flex-1 rounded-none hover:bg-gray-100 text-xs cursor-pointer min-h-[44px]">
              {t("cancel")}
            </button>
            <button type="submit" className="bg-forest text-cream-100 font-bold py-2.5 flex-1 rounded-none hover:bg-forest-700 text-xs cursor-pointer border-0 shadow-green min-h-[44px]">
              {editingGroup ? t("save") : (lang === "ta" ? "உருவாக்கு" : "Create Group")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
