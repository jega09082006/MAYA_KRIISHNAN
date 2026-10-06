import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import Modal from "../../components/Modal";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, EG_ICON } from "../../utils/images";

export default function AdminItemsPage() {
  const { items, deleteItem, publicCategories, getGroupsOfItem } = useStore();
  const { lang, t } = useLang();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Search matches both languages regardless of active lang
  const filtered = items.filter(
    (i) =>
      (i.tamilName   && i.tamilName.toLowerCase().includes(search.toLowerCase())) ||
      (i.englishName && i.englishName.toLowerCase().includes(search.toLowerCase())) ||
      i.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  function confirmDelete() {
    if (deleteTarget) { deleteItem(deleteTarget.id); setDeleteTarget(null); }
  }

  const stockLabel   = lang === "ta" ? "இருப்பு" : "Stock";
  const noItemsLabel = lang === "ta" ? "பொருட்கள் எதுவும் கிடைக்கவில்லை" : "No items found";
  const deleteConfirmLabel = lang === "ta"
    ? "இந்த பொருளை நீக்க விரும்புகிறீர்களா?"
    : "Are you sure you want to delete this item?";
  const irreversibleLabel = lang === "ta" ? "இந்த செயலை மாற்ற முடியாது." : "This action cannot be undone.";

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-baseline flex-wrap gap-2">
            <GoldLotusOrnament size={22} className="self-center shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold font-catamaran text-gray-900">
              {t("adminItems")}
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} {lang === "ta" ? "பொருட்கள் கடையில் உள்ளன" : "products in store"}
          </p>
        </div>
        <Link
          to="/admin/items/new"
          className="bg-forest text-cream-100 font-bold px-4 py-2.5 rounded-none hover:bg-forest-700 transition-all flex items-center gap-2 shadow-green text-sm shrink-0"
        >
          <Plus size={16} /> {t("adminAddItem")}
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-none p-4 shadow-green">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={lang === "ta" ? "தமிழ் / English பெயர் அல்லது tags..." : "Search Tamil / English name or tags…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-none text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-none shadow-green overflow-hidden">
        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-gray-200">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-catamaran">{noItemsLabel}</p>
            </div>
          ) : (
            filtered.map((item) => {
              const name   = lang === "ta" ? item.tamilName : item.englishName;
              const imgSrc = getItemImage(item);
              const hasImg = Boolean(item.image || item.imageUrl);
              return (
                <div key={item.id} className="p-4 flex flex-col gap-3 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-none overflow-hidden bg-[#faf6ee] border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                      <img src={imgSrc} alt={name} onError={(e) => { e.currentTarget.src = EG_ICON; }} className={`w-full h-full ${hasImg ? "object-cover" : "object-contain"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-900 font-catamaran text-base leading-snug min-w-0 [overflow-wrap:anywhere]">{name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-extrabold text-forest-700 font-catamaran text-sm">
                          ₹{item.price.toLocaleString("en-IN")} {item.unit ? `(${item.unit})` : ""}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.stock > 10 ? "bg-forest-100 text-forest-800" : item.stock > 0 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-danger"}`}>
                          {stockLabel}: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <Link to={`/admin/items/edit/${item.id}`} className="min-h-[44px] px-4 bg-forest-50 text-forest-800 font-bold text-xs rounded-none border border-forest-200 flex items-center gap-1.5 cursor-pointer">
                      <Edit size={16} /> {t("edit")}
                    </Link>
                    <button onClick={() => setDeleteTarget(item)} className="min-h-[44px] px-4 bg-red-50 text-danger font-bold text-xs rounded-none border border-red-200 flex items-center gap-1.5 cursor-pointer">
                      <Trash2 size={16} /> {t("delete")}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 font-catamaran">
                  {lang === "ta" ? "பொருள்" : "Item"}
                </th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 font-catamaran">
                  {t("adminCategories")}
                </th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 font-catamaran">
                  {t("adminSuggestions")}
                </th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 font-catamaran">
                  {lang === "ta" ? "விலை / அளவு" : "Price / Unit"}
                </th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 font-catamaran">
                  {stockLabel}
                </th>
                <th className="text-right px-5 py-3.5 font-bold text-gray-700 font-catamaran">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-catamaran">{noItemsLabel}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const name     = lang === "ta" ? item.tamilName : item.englishName;
                  const imgSrc   = getItemImage(item);
                  const hasImg   = Boolean(item.image || item.imageUrl);
                  const itemCats = item.categoryIds || item.publicCategories || [];
                  const cats     = publicCategories.filter((c) => itemCats.includes(c.id));
                  const groups   = getGroupsOfItem(item.id);

                  return (
                    <tr key={item.id} className="even:bg-gray-50 hover:bg-forest-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-none overflow-hidden bg-[#faf6ee] border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                            <img src={imgSrc} alt={name} onError={(e) => { e.currentTarget.src = EG_ICON; }} className={`w-full h-full ${hasImg ? "object-cover" : "object-contain"}`} />
                          </div>
                          <p className="font-extrabold text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug">{name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {cats.map((c) => {
                            const catName = lang === "ta" ? (c.tamilName || c.label) : (c.englishName || c.label);
                            return (
                              <span key={c.id} className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-forest-100 text-forest-800 font-catamaran">
                                {catName}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {groups.length === 0 ? (
                            <span className="text-xs text-gray-300">—</span>
                          ) : (
                            groups.map((g) => {
                              const gName = lang === "ta" ? g.tamilName : g.name;
                              return (
                                <span key={g.id} className="text-[10px] px-2 py-0.5 rounded-full font-bold border font-catamaran" style={{ backgroundColor: g.color + "15", borderColor: g.color + "40", color: g.color }}>
                                  ★ {gName}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-catamaran">
                        <span className="font-extrabold text-gray-900 block">₹{item.price.toLocaleString("en-IN")}</span>
                        {item.unit && <span className="text-xs text-gray-500">{item.unit}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.stock > 10 ? "bg-forest-100 text-forest-800" : item.stock > 0 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-danger"}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/items/edit/${item.id}`} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-none text-forest-700 hover:bg-forest-100 transition-colors cursor-pointer" title={t("edit")}>
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => setDeleteTarget(item)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-none text-danger hover:bg-red-50 transition-colors cursor-pointer" title={t("delete")}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={lang === "ta" ? "பொருளை நீக்கு" : "Delete Item"} size="sm">
        <div className="text-center space-y-4">
          <div className="text-5xl">🗑️</div>
          <p className="text-gray-800 font-medium font-catamaran">
            {deleteConfirmLabel}
            <br />
            <strong className="text-gray-900 font-bold font-catamaran">
              {deleteTarget ? (lang === "ta" ? deleteTarget.tamilName : deleteTarget.englishName) : ""}
            </strong>
          </p>
          <p className="text-xs text-gray-500">{irreversibleLabel}</p>
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={() => setDeleteTarget(null)} className="bg-white text-gray-700 border border-gray-300 font-bold px-4 py-2 rounded-none hover:bg-gray-100 text-xs cursor-pointer">
              {t("cancel")}
            </button>
            <button onClick={confirmDelete} className="bg-danger text-white font-bold px-4 py-2 rounded-none hover:bg-red-700 text-xs cursor-pointer border-0">
              {t("delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
