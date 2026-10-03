import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Users } from "lucide-react";
import { useStore } from "../../context/StoreContext";

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
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">வாடிக்கையாளர்கள் (Customers)</h1>
        <p className="text-gray-500 text-sm font-medium">{customers.length} மொத்த வாடிக்கையாளர்கள் ({customers.length} total customers)</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-gradient-to-r from-brand-sky to-blue-600 text-white shadow-md"
                  : "border border-gray-200 text-gray-600 hover:border-brand-sky bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Users size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400">வாடிக்கையாளர்கள் எதுவும் கிடைக்கவில்லை</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/admin/customers/${c.id}`}
              className="card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-14 h-14 rounded-2xl bg-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=FF7A00&color=fff&size=56`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold truncate mt-0.5">{c.address.split(",")[1]?.trim() || "Tamil Nadu"}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
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
                  { label: "Spent", value: `₹${(c.totalSpent / 1000).toFixed(1)}K` },
                  { label: "Offers", value: customerOfferCount(c.id) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl py-2">
                    <p className="font-bold text-gray-800 text-sm">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>Joined {new Date(c.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>
                <ChevronRight size={14} className="group-hover:text-brand-orange transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
