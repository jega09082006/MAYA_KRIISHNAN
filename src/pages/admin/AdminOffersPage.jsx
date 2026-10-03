import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Gift, ToggleLeft, ToggleRight, Trash2, Search, ChevronRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import OfferBadge from "../../components/OfferBadge";

export default function AdminOffersPage() {
  const { offers, customers, items, updateOffer, deleteOffer } = useStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = offers.filter((o) => {
    const cust = customers.find((c) => c.id === o.customerId);
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      cust?.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || o.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">அனைத்து சலுகைகள் (All Offers)</h1>
        <p className="text-gray-500 text-sm font-medium">
          {offers.length} சலுகைகள் · {offers.filter((o) => o.isActive).length} செயலில் உள்ளன
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Offers", value: offers.length, color: "from-brand-orange to-yellow-400" },
          { label: "Active", value: offers.filter((o) => o.isActive).length, color: "from-emerald-500 to-teal-600" },
          { label: "Item Offers", value: offers.filter((o) => o.type === "item").length, color: "from-brand-sky to-blue-600" },
          { label: "Combo Offers", value: offers.filter((o) => o.type === "combo").length, color: "from-brand-pink to-rose-600" },
        ].map((s) => (
          <div key={s.label} className={`card p-4 bg-gradient-to-r ${s.color} text-white`}>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-white/90 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by offer name or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "item", "combo"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-md"
                  : "border border-gray-200 text-gray-600 hover:border-brand-orange bg-white"
              }`}
            >
              {t === "all" ? "All Types" : `${t.charAt(0).toUpperCase() + t.slice(1)} Offers`}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">சலுகை (Offer)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">வாடிக்கையாளர் (Customer)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">பொருட்கள் (Items)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">காலக்கெடு (Validity)</th>
                <th className="text-center px-5 py-3.5 font-semibold text-gray-600">நிலை (Status)</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">நீக்கு (Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <Gift size={40} className="mx-auto mb-3 opacity-20" />
                    <p>சலுகைகள் எதுவும் இல்லை (No offers found)</p>
                  </td>
                </tr>
              ) : (
                filtered.map((offer) => {
                  const cust = customers.find((c) => c.id === offer.customerId);
                  const offerItem = offer.itemId ? items.find((i) => i.id === offer.itemId) : null;
                  const comboItems = offer.itemIds
                    ? items.filter((i) => offer.itemIds.includes(i.id))
                    : [];

                  return (
                    <tr key={offer.id} className="hover:bg-orange-50/20 transition-colors">
                      {/* Offer name + badge */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <OfferBadge offer={offer} />
                          <span className="font-bold text-gray-900 text-sm">{offer.name}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        {cust ? (
                          <Link
                            to={`/admin/customers/${cust.id}`}
                            className="flex items-center gap-2 group"
                          >
                            <img
                              src={cust.avatar}
                              alt={cust.name}
                              className="w-8 h-8 rounded-full bg-gray-100"
                              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cust.name)}&background=FF7A00&color=fff&size=32`; }}
                            />
                            <span className="text-gray-700 font-medium text-sm group-hover:text-brand-orange transition-colors">
                              {cust.name}
                            </span>
                            <ChevronRight size={12} className="text-gray-300 group-hover:text-brand-orange transition-colors" />
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {offer.type === "item" && offerItem ? (
                            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-full">
                              {offerItem.tamilName || offerItem.englishName}
                            </span>
                          ) : (
                            comboItems.slice(0, 2).map((i) => (
                              <span key={i.id} className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                                {i.tamilName || i.englishName}
                              </span>
                            ))
                          )}
                          {offer.type === "combo" && comboItems.length > 2 && (
                            <span className="text-xs text-gray-400">+{comboItems.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gray-500 font-medium">
                          {offer.startDate} → {offer.endDate}
                        </span>
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                          className={`${offer.isActive ? "text-emerald-600" : "text-gray-300"} hover:scale-110 transition-transform cursor-pointer`}
                        >
                          {offer.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        To create new offers, open a customer's detail page.
      </p>
    </div>
  );
}
