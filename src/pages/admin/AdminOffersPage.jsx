import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Gift, ToggleLeft, ToggleRight, Trash2, Search, ChevronRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import OfferBadge from "../../components/OfferBadge";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";

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
    <div className="space-y-6 text-gray-800 font-lato">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <GoldLotusOrnament size={22} />
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900">
            All Offers <span className="font-tamil font-extrabold text-xl text-forest-700 ml-2">(அனைத்து சலுகைகள்)</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm font-lato mt-0.5">
          {offers.length} சலுகைகள் · {offers.filter((o) => o.isActive).length} செயலில் உள்ளன
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Offers", value: offers.length },
          { label: "Active", value: offers.filter((o) => o.isActive).length },
          { label: "Item Offers", value: offers.filter((o) => o.type === "item").length },
          { label: "Combo Offers", value: offers.filter((o) => o.type === "combo").length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-none p-4 shadow-green">
            <p className="text-2xl font-extrabold text-forest-700 font-catamaran">{s.value}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider font-lato">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-none p-4 flex flex-wrap gap-4 items-center shadow-green">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by offer name or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-none text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          {["all", "item", "combo"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-none text-xs font-bold capitalize transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-forest text-cream-100 shadow-sm"
                  : "border border-gray-200 text-gray-600 hover:border-forest-400 bg-white"
              }`}
            >
              {t === "all" ? "All Types" : `${t.charAt(0).toUpperCase() + t.slice(1)} Offers`}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white border border-gray-200 rounded-none shadow-green overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 font-lato">
                <th className="text-left px-5 py-3.5 font-bold text-gray-700">சலுகை (Offer)</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 hidden md:table-cell">வாடிக்கையாளர் (Customer)</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 hidden sm:table-cell">பொருட்கள் (Items)</th>
                <th className="text-left px-5 py-3.5 font-bold text-gray-700 hidden lg:table-cell">காலக்கெடு (Validity)</th>
                <th className="text-center px-5 py-3.5 font-bold text-gray-700">நிலை (Status)</th>
                <th className="text-right px-5 py-3.5 font-bold text-gray-700">நீக்கு (Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 font-lato">
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
                    <tr key={offer.id} className="even:bg-gray-50 hover:bg-forest-50/50 transition-colors">
                      {/* Offer name + badge */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <OfferBadge offer={offer} />
                          <span className="font-bold text-gray-900 text-sm font-lato">{offer.name}</span>
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
                              className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200"
                              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cust.name)}&background=2d5a3d&color=fff&size=32`; }}
                            />
                            <span className="text-gray-700 font-bold text-xs group-hover:text-forest-700 transition-colors font-lato">
                              {cust.name}
                            </span>
                            <ChevronRight size={12} className="text-gray-400 group-hover:text-forest-700 transition-colors" />
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {offer.type === "item" && offerItem ? (
                            <span className="text-xs font-bold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full truncate max-w-full font-tamil">
                              {offerItem.tamilName || offerItem.englishName}
                            </span>
                          ) : (
                            comboItems.slice(0, 2).map((i) => (
                              <span key={i.id} className="text-xs font-bold text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-tamil">
                                {i.tamilName || i.englishName}
                              </span>
                            ))
                          )}
                          {offer.type === "combo" && comboItems.length > 2 && (
                            <span className="text-xs text-gray-400 font-lato">+{comboItems.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gray-500 font-bold font-lato">
                          {offer.startDate} → {offer.endDate}
                        </span>
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                          className={`${offer.isActive ? "text-forest-700" : "text-gray-300"} hover:scale-105 transition-transform cursor-pointer`}
                        >
                          {offer.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-1.5 rounded-none text-danger hover:bg-red-50 transition-colors cursor-pointer"
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

      <p className="text-xs text-gray-400 text-center font-lato">
        To create new offers, open a customer's detail page.
      </p>
    </div>
  );
}
