import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Users } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";

export default function AdminCustomersPage() {
  const { customers, offers } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function customerOfferCount(id) {
    return offers.filter((o) => o.customerId === id).length;
  }

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-baseline flex-wrap gap-2">
          <GoldLotusOrnament size={22} className="self-center shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900">
            Customers
          </h1>
          <span className="font-catamaran font-bold text-lg text-forest-700">
            (வாடிக்கையாளர்கள்)
          </span>
        </div>
        <p className="text-gray-500 text-sm font-lato mt-1">
          {customers.length} மொத்த வாடிக்கையாளர்கள் ({customers.length} total customers)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-none p-4 flex flex-wrap gap-4 items-center shadow-green">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-none text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-none text-xs font-bold capitalize transition-all cursor-pointer min-h-[44px] ${
                statusFilter === s
                  ? "bg-forest text-cream-100 shadow-sm"
                  : "border border-gray-200 text-gray-600 hover:border-forest-400 bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-none p-16 text-center shadow-green font-lato">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-bold">வாடிக்கையாளர்கள் எதுவும் கிடைக்கவில்லை</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/admin/customers/${c.id}`}
              className="bg-white border border-gray-200 rounded-none p-5 shadow-green hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0 border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=2d5a3d&color=fff&size=56`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 font-lato min-w-0 [overflow-wrap:anywhere] leading-snug">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400 font-lato truncate" title={c.email}>
                        {c.email}
                      </p>
                      <p className="text-[11px] text-forest-700 font-bold mt-0.5 font-lato min-w-0 [overflow-wrap:anywhere]">
                        {c.address.split(",")[1]?.trim() || "Tamil Nadu"}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.status === "active"
                          ? "bg-forest-100 text-forest-800"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Orders", value: c.totalOrders },
                  { label: "Spent", value: `₹${c.totalSpent.toLocaleString("en-IN")}` },
                  { label: "Offers", value: customerOfferCount(c.id) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-none py-2 px-1">
                    <p className="font-extrabold text-gray-900 text-xs sm:text-sm font-catamaran min-w-0 [overflow-wrap:anywhere]">{stat.value}</p>
                    <p className="text-[11px] text-gray-400 font-lato">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-lato pt-2 border-t border-gray-100">
                <span>Joined {new Date(c.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>
                <ChevronRight size={14} className="group-hover:text-forest-700 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
