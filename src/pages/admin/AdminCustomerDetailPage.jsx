import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Gift,
  ShoppingBag,
  Package,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { getEmojiGradient } from "../../data/mockData";
import Modal from "../../components/Modal";
import OfferBadge from "../../components/OfferBadge";

const EMPTY_OFFER = {
  type: "item",
  name: "",
  itemId: "",
  itemIds: [],
  discountType: "percent",
  discountValue: "",
  comboPrice: "",
  startDate: "",
  endDate: "",
};

export default function AdminCustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    customers,
    items,
    offers,
    orders,
    addOffer,
    updateOffer,
    deleteOffer,
  } = useStore();

  const customer = customers.find((c) => c.id === id);
  const customerOffers = offers.filter((o) => o.customerId === id);
  const customerOrders = orders[id] || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [form, setForm] = useState(EMPTY_OFFER);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400">Customer not found</p>
          <button onClick={() => navigate("/admin/customers")} className="btn-primary mt-4">
            Back
          </button>
        </div>
      </div>
    );
  }

  function openAddModal() {
    setEditOffer(null);
    setForm({ ...EMPTY_OFFER });
    setModalOpen(true);
  }

  function openEditModal(offer) {
    setEditOffer(offer);
    setForm({
      type: offer.type,
      name: offer.name,
      itemId: offer.itemId || "",
      itemIds: offer.itemIds || [],
      discountType: offer.discountType || "percent",
      discountValue: offer.discountValue || "",
      comboPrice: offer.comboPrice || "",
      startDate: offer.startDate,
      endDate: offer.endDate,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      customerId: id,
      isActive: true,
      discountValue: Number(form.discountValue) || 0,
      comboPrice: Number(form.comboPrice) || 0,
    };
    if (editOffer) {
      updateOffer(editOffer.id, payload);
    } else {
      addOffer(payload);
    }
    setModalOpen(false);
  }

  function toggleComboItem(itemId) {
    setForm((prev) => ({
      ...prev,
      itemIds: prev.itemIds.includes(itemId)
        ? prev.itemIds.filter((i) => i !== itemId)
        : [...prev.itemIds, itemId],
    }));
  }

  const orderStatusColors = {
    completed: "bg-emerald-100 text-emerald-700",
    shipped: "bg-sky-100 text-brand-sky",
    processing: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-500",
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/customers")}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900">
          வாடிக்கையாளர் விவரம் (Customer Detail)
        </h1>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-20 h-20 rounded-3xl bg-gray-100"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=FF7A00&color=fff&size=80`;
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl font-extrabold text-gray-900">{customer.name}</h2>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  customer.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {customer.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">{customer.email}</p>
            <p className="text-gray-400 text-xs mt-0.5">{customer.phone} · {customer.address}</p>
          </div>
          <div className="flex gap-4 text-center">
            {[
              { label: "ஆர்டர்கள்", value: customer.totalOrders, color: "text-brand-orange" },
              { label: "வாங்கியது", value: `₹${customer.totalSpent.toLocaleString()}`, color: "text-brand-sky" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-2xl px-5 py-3">
                <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order History */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={18} className="text-brand-sky" />
            <h3 className="font-bold text-gray-900">ஆர்டர் வரலாறு (Order History)</h3>
          </div>
          {customerOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {customerOrders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-4 hover:border-sky-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.id}</p>
                      <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.total.toLocaleString()}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${orderStatusColors[order.status] || "bg-gray-100 text-gray-500"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.items.map((itemId) => {
                      const itm = items.find((i) => i.id === itemId);
                      if (!itm) return null;
                      const gradientClass = getEmojiGradient(itm.emoji);
                      return (
                        <div key={itemId} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2.5 py-1">
                          <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${gradientClass} flex items-center justify-center text-[10px]`}>
                            {itm.emoji || "🌿"}
                          </span>
                          <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]">
                            {itm.tamilName || itm.englishName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Offers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-brand-pink" />
              <h3 className="font-bold text-gray-900">தனிப்பயன் சலுகைகள் (Offers)</h3>
            </div>
            <button onClick={openAddModal} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} /> புதிய சலுகை
            </button>
          </div>

          {customerOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Gift size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">இந்த வாடிக்கையாளருக்கு சலுகைகள் எதுவும் இல்லை.</p>
              <button onClick={openAddModal} className="mt-3 text-sm text-brand-orange hover:text-brand-pink font-semibold transition-colors cursor-pointer">
                + Create first offer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {customerOffers.map((offer) => {
                const offerItem = offer.itemId ? items.find((i) => i.id === offer.itemId) : null;
                const comboItems = offer.itemIds
                  ? items.filter((i) => offer.itemIds.includes(i.id))
                  : [];

                return (
                  <div key={offer.id} className={`border-2 rounded-2xl p-4 transition-all ${offer.isActive ? "border-orange-100 bg-orange-50/30" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <OfferBadge offer={offer} />
                        <span className="font-bold text-gray-900 text-sm">{offer.name}</span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${offer.isActive ? "text-emerald-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
                          {offer.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button onClick={() => openEditModal(offer)} className="p-1.5 rounded-lg text-brand-sky hover:bg-sky-50 transition-colors cursor-pointer">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteOffer(offer.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-0.5">
                      {offer.type === "item" && offerItem && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Package size={12} />
                          <span>{offerItem.tamilName} ({offerItem.englishName})</span>
                          <span>·</span>
                          <span className="text-brand-orange font-bold">{offer.discountType === "percent" ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}</span>
                        </div>
                      )}
                      {offer.type === "combo" && (
                        <div>
                          <span className="font-medium">காம்போ: </span>
                          {comboItems.map((i) => i.tamilName || i.englishName).join(" + ")}
                          {offer.comboPrice ? ` · சிறப்பு விலை: ₹${offer.comboPrice}` : ""}
                        </div>
                      )}
                      <div>
                        காலம்: {offer.startDate} முதல் {offer.endDate} வரை
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Offer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editOffer ? "Edit Offer" : "New Offer"}
        size="lg"
      >
        <div className="space-y-5">
          {/* Offer type */}
          <div>
            <label className="label">Offer Type</label>
            <div className="flex gap-3">
              {["item", "combo"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize border-2 transition-all cursor-pointer ${
                    form.type === t
                      ? "bg-gradient-to-r from-brand-orange to-brand-pink text-white border-transparent shadow-md"
                      : "border-gray-200 text-gray-600 hover:border-brand-orange"
                  }`}
                >
                  {t === "item" ? "தனிப் பொருள் சலுகை (Item Offer)" : "காம்போ சலுகை (Combo Offer)"}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label">சலுகைப் பெயர் (Offer Name)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="உ.ம். மஞ்சள் 15% off / மூலிகை காம்போ"
              className="input-field"
            />
          </div>

          {/* Item offer fields */}
          {form.type === "item" && (
            <>
              <div>
                <label className="label">பொருளைத் தேர்வு செய்க (Select Item)</label>
                <select
                  value={form.itemId}
                  onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                  className="input-field cursor-pointer"
                >
                  <option value="">— பொருளைத் தேர்ந்தெடுக்கவும் —</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.tamilName} ({i.englishName}) - ₹{i.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">தள்ளுபடி வகை (Discount Type)</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="input-field cursor-pointer"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="label">தள்ளுபடி மதிப்பு (Discount Value)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === "percent" ? "15" : "50"}
                    className="input-field"
                  />
                </div>
              </div>
            </>
          )}

          {/* Combo offer fields */}
          {form.type === "combo" && (
            <>
              <div>
                <label className="label">பொருட்களைத் தேர்வு செய்க (குறைந்தது 2)</label>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto border border-gray-100 rounded-xl p-3">
                  {items.map((i) => (
                    <label key={i.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.itemIds.includes(i.id)}
                        onChange={() => toggleComboItem(i.id)}
                        className="accent-brand-orange w-4 h-4 cursor-pointer"
                      />
                      <span className="text-base select-none">{i.emoji || "🌿"}</span>
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        {i.tamilName} ({i.englishName})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">காம்போ சிறப்பு விலை (Combo Price in ₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.comboPrice}
                  onChange={(e) => setForm({ ...form, comboPrice: e.target.value })}
                  placeholder="உ.ம். 599"
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">தொடக்க தேதி (Start Date)</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-field cursor-pointer"
              />
            </div>
            <div>
              <label className="label">முடிவு தேதி (End Date)</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="input-field cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost flex-1 border border-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1 cursor-pointer">
              {editOffer ? "Update Offer" : "Create Offer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
