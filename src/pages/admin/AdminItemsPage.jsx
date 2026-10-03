import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { getEmojiGradient } from "../../data/mockData";
import Modal from "../../components/Modal";

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">பொருட்கள் மேலாண்மை (Items)</h1>
          <p className="text-gray-500 text-sm font-medium">{items.length} பொருட்கள் கடையில் உள்ளன ({items.length} products in store)</p>
        </div>
        <Link to="/admin/items/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> புதிய பொருள் சேர் (Add Item)
        </Link>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Tamil / English name or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">பொருள் (Item)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">பொதுப் பிரிவுகள் (PUBLIC)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">பரிந்துரை குழுக்கள் (Groups)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">விலை / அளவு</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">இருப்பு</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">செயல்கள்</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
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
                  const gradientClass = getEmojiGradient(item.emoji);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
                      {/* Item */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100`}
                          >
                            {(() => {
                              const photoUrl =
                                item.imageUrl ||
                                item.image ||
                                (item.emoji === "🌿" ? "/photos/herb.svg" :
                                 item.emoji === "🌶️" ? "/photos/spice.svg" :
                                 item.emoji === "🌾" ? "/photos/grocery.svg" :
                                 item.emoji === "🪔" ? "/photos/pooja.svg" :
                                 item.emoji === "🧴" ? "/photos/oil.svg" :
                                 item.emoji === "💊" ? "/photos/medicine.svg" :
                                 "/photos/grocery.svg");
                              return (
                                <img
                                  src={photoUrl}
                                  alt={item.tamilName}
                                  className="w-full h-full object-cover"
                                />
                              );
                            })()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[180px]">
                              {item.tamilName}
                            </p>
                            <p className="text-xs text-gray-500 font-medium truncate max-w-[180px]">
                              {item.englishName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categories (PUBLIC) */}
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {cats.map((c) => (
                            <span
                              key={c.id}
                              className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: c.color + "20", color: c.color }}
                            >
                              {c.shortLabel || c.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Suggestion Groups */}
                      <td className="px-5 py-3.5 hidden lg:table-cell">
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
                      <td className="px-5 py-3.5">
                        <span className="font-extrabold text-gray-900 block">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.unit && (
                          <span className="text-xs text-gray-400 font-medium">
                            {item.unit}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            item.stock > 10
                              ? "bg-emerald-100 text-emerald-700"
                              : item.stock > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-600"
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
                            className="p-2 rounded-xl text-brand-sky hover:bg-sky-50 transition-colors cursor-pointer"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
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
        title="Delete Item"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="text-5xl">🗑️</div>
          <p className="text-gray-700">
            இந்த பொருளை நீக்க விரும்புகிறீர்களா? <br />
            <strong className="text-gray-900">{deleteTarget?.tamilName} ({deleteTarget?.englishName})</strong>
          </p>
          <p className="text-xs text-gray-400">இந்த செயலை மாற்ற முடியாது.</p>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn-ghost border border-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn-danger cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
