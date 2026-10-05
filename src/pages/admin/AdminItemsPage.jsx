import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import Modal from "../../components/Modal";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, EG_ICON } from "../../utils/images";

export default function AdminItemsPage() {
  const { items, deleteItem, publicCategories, getGroupsOfItem } = useStore();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = items.filter(
    (i) =>
      (i.tamilName && i.tamilName.toLowerCase().includes(search.toLowerCase())) ||
      (i.englishName && i.englishName.toLowerCase().includes(search.toLowerCase())) ||
      i.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  function confirmDelete() {
    if (deleteTarget) {
      deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-baseline flex-wrap gap-2">
            <GoldLotusOrnament size={22} className="self-center shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900">
              Items Management
            </h1>
            <span className="font-catamaran font-bold text-lg text-forest-700">
              (பொருட்கள் மேலாண்மை)
            </span>
          </div>
          <p className="text-gray-500 text-sm font-lato mt-1">
            {items.length} பொருட்கள் கடையில் உள்ளன ({items.length} products in store)
          </p>
        </div>
        <Link
          to="/admin/items/new"
          className="bg-forest text-cream-100 font-bold px-4 py-2.5 rounded-none hover:bg-forest-700 transition-all flex items-center gap-2 shadow-green text-sm shrink-0"
        >
          <Plus size={16} /> புதிய பொருள் சேர் (Add Item)
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-none p-4 shadow-green">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Tamil / English name or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-none text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      {/* Mobile Card List (md:hidden) & Desktop Table (hidden md:block) */}
      <div className="bg-white border border-gray-200 rounded-none shadow-green overflow-hidden">
        {/* Mobile View: Stacked Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-lato">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>பொருட்கள் எதுவும் கிடைக்கவில்லை (No items found)</p>
            </div>
          ) : (
            filtered.map((item) => {
              const hasCustomImage = Boolean(item.image || item.imageUrl);
              const imgSrc = getItemImage(item);

              return (
                <div key={item.id} className="p-4 flex flex-col gap-3 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-none overflow-hidden bg-[#faf6ee] border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                      <img
                        src={imgSrc}
                        alt={item.tamilName}
                        onError={(e) => {
                          e.currentTarget.src = EG_ICON;
                        }}
                        className={`w-full h-full ${
                          hasCustomImage ? "object-cover" : "object-contain"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-900 font-catamaran text-base leading-snug min-w-0 [overflow-wrap:anywhere]">
                        {item.tamilName}
                      </p>
                      <p className="text-xs text-gray-500 font-lato leading-snug min-w-0 [overflow-wrap:anywhere]">
                        {item.englishName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-extrabold text-forest-700 font-catamaran text-sm">
                          ₹{item.price.toLocaleString("en-IN")} {item.unit ? `(${item.unit})` : ""}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.stock > 10
                              ? "bg-forest-100 text-forest-800"
                              : item.stock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-danger"
                          }`}
                        >
                          இருப்பு: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <Link
                      to={`/admin/items/edit/${item.id}`}
                      className="min-h-[44px] px-4 bg-forest-50 text-forest-800 font-bold text-xs rounded-none border border-forest-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit size={16} /> திருத்து (Edit)
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="min-h-[44px] px-4 bg-red-50 text-danger font-bold text-xs rounded-none border border-red-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={16} /> நீக்கு (Delete)
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 font-lato">
                <th className="text-left px-5 py-3.5 font-bold text-gray-700">பொருள் (Item)</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700">பொதுப் பிரிவுகள் (PUBLIC)</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700">பரிந்துரை குழுக்கள் (Groups)</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700">விலை / அளவு</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700">இருப்பு</th>
                <th className="text-right px-5 py-3.5 font-bold text-gray-700">செயல்கள்</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 font-lato">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p>பொருட்கள் எதுவும் கிடைக்கவில்லை (No items found)</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const itemCats = item.categoryIds || item.publicCategories || [];
                  const cats = publicCategories.filter((c) =>
                    itemCats.includes(c.id)
                  );
                  const memberGroups = getGroupsOfItem(item.id);

                  const hasCustomImage = Boolean(item.image || item.imageUrl);
                  const imgSrc = getItemImage(item);

                  return (
                    <tr
                      key={item.id}
                      className="even:bg-gray-50 hover:bg-forest-50/50 transition-colors"
                    >
                      {/* Item Thumbnail & Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-none overflow-hidden bg-[#faf6ee] border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                            <img
                              src={imgSrc}
                              alt={item.tamilName}
                              onError={(e) => {
                                e.currentTarget.src = EG_ICON;
                              }}
                              className={`w-full h-full ${
                                hasCustomImage ? "object-cover" : "object-contain"
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug">
                              {item.tamilName}
                            </p>
                            <p className="text-xs text-gray-500 font-lato min-w-0 [overflow-wrap:anywhere] leading-snug">
                              {item.englishName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categories (PUBLIC) */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {cats.map((c) => (
                            <span
                              key={c.id}
                              className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-forest-100 text-forest-800"
                            >
                              {c.shortLabel || c.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Suggestion Groups */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {memberGroups.length === 0 ? (
                            <span className="text-xs text-gray-300">—</span>
                          ) : (
                            memberGroups.map((g) => (
                              <span
                                key={g.id}
                                className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                                style={{
                                  backgroundColor: g.color + "15",
                                  borderColor: g.color + "40",
                                  color: g.color,
                                }}
                              >
                                ★ {g.tamilName}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Price & Unit */}
                      <td className="px-5 py-3.5 font-catamaran">
                        <span className="font-extrabold text-gray-900 block">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {item.unit && (
                          <span className="text-xs text-gray-500 font-lato">
                            {item.unit}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5 font-lato">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.stock > 10
                              ? "bg-forest-100 text-forest-800"
                              : item.stock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-danger"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/items/edit/${item.id}`}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-none text-forest-700 hover:bg-forest-100 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-none text-danger hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
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
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Item (பொருளை நீக்கு)"
        size="sm"
      >
        <div className="text-center space-y-4 font-lato">
          <div className="text-5xl">🗑️</div>
          <p className="text-gray-800 font-medium">
            இந்த பொருளை நீக்க விரும்புகிறீர்களா? <br />
            <strong className="text-gray-900 font-bold font-catamaran">{deleteTarget?.tamilName} ({deleteTarget?.englishName})</strong>
          </p>
          <p className="text-xs text-gray-500">இந்த செயலை மாற்ற முடியாது.</p>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="bg-white text-gray-700 border border-gray-300 font-bold px-4 py-2 rounded-none hover:bg-gray-100 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button onClick={confirmDelete} className="bg-danger text-white font-bold px-4 py-2 rounded-none hover:bg-red-700 text-xs cursor-pointer border-0">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
