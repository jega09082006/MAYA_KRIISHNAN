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
import Modal from "../../components/Modal";
import OfferBadge from "../../components/OfferBadge";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { getItemImage, EG_ICON } from "../../utils/images";

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
      <div className="flex items-center justify-center h-full font-lato">
        <div className="text-center bg-white border border-gray-200 p-8 shadow-green rounded-none">
          <p className="text-gray-500 font-bold">Customer not found</p>
          <button onClick={() => navigate("/admin/customers")} className="bg-forest text-cream-100 font-bold px-4 py-2 rounded-none hover:bg-forest-700 mt-4 text-xs min-h-[44px]">
            Back to Customers
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
    completed: "bg-forest-100 text-forest-800",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-danger",
  };

  return (
    <div className="space-y-6 text-gray-800 font-lato">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate("/admin/customers")}
          className="p-2 rounded-none hover:bg-gray-200 transition-colors text-gray-600 cursor-pointer border border-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-baseline flex-wrap gap-2">
          <GoldLotusOrnament size={22} className="self-center shrink-0" />
          <h1 className="text-2xl font-bold font-playfair text-gray-900">
            Customer Details
          </h1>
          <span className="font-catamaran font-bold text-lg text-forest-700">
            (வாடிக்கையாளர் விவரம்)
          </span>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-none p-6 shadow-green">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 shrink-0"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=2d5a3d&color=fff&size=80`;
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900 font-lato min-w-0 [overflow-wrap:anywhere]">{customer.name}</h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  customer.status === "active"
                    ? "bg-forest-100 text-forest-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {customer.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium font-lato min-w-0 [overflow-wrap:anywhere]">{customer.email}</p>
            <p className="text-gray-500 text-xs mt-0.5 font-lato min-w-0 [overflow-wrap:anywhere]">{customer.phone} · {customer.address}</p>
          </div>
          <div className="flex gap-4 text-center">
            {[
              { label: "ஆர்டர்கள்", value: customer.totalOrders, color: "text-forest-700" },
              { label: "வாங்கியது", value: `₹${customer.totalSpent.toLocaleString("en-IN")}`, color: "text-gold-700" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-none px-5 py-3">
                <p className={`text-xl font-extrabold font-catamaran ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 font-lato">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order History */}
        <div className="bg-white border border-gray-200 rounded-none p-6 shadow-green">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-3">
            <ShoppingBag size={18} className="text-forest-700 shrink-0" />
            <h3 className="font-bold text-gray-900 font-catamaran text-base">ஆர்டர் வரலாறு (Order History)</h3>
          </div>
          {customerOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 font-lato">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {customerOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-none p-4 hover:border-forest-400 transition-colors bg-white">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm font-mono">{order.id}</p>
                      <p className="text-xs text-gray-400 font-lato">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-gray-900 font-catamaran">₹{order.total.toLocaleString("en-IN")}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize font-lato ${orderStatusColors[order.status] || "bg-gray-100 text-gray-500"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.items.map((itemId) => {
                      const itm = items.find((i) => i.id === itemId);
                      if (!itm) return null;
                      const hasCustomImage = Boolean(itm.image || itm.imageUrl);
                      const imgSrc = getItemImage(itm);
                      return (
                        <div key={itemId} className="flex items-center gap-1.5 bg-[#faf6ee] border border-gray-200 rounded-none px-2.5 py-1">
                          <img
                            src={imgSrc}
                            alt={itm.tamilName}
                            onError={(e) => {
                              e.currentTarget.src = EG_ICON;
                            }}
                            className={`w-4 h-4 ${hasCustomImage ? "object-cover" : "object-contain"} flex-shrink-0`}
                          />
                          <span className="text-xs text-gray-800 font-bold font-catamaran min-w-0 [overflow-wrap:anywhere]">
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
        <div className="bg-white border border-gray-200 rounded-none p-6 shadow-green">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-gold-600 shrink-0" />
              <h3 className="font-bold text-gray-900 font-catamaran text-base">தனிப்பயன் சலுகைகள் (Offers)</h3>
            </div>
            <button onClick={openAddModal} className="bg-forest text-cream-100 font-bold px-3 py-1.5 rounded-none hover:bg-forest-700 text-xs flex items-center gap-1.5 cursor-pointer shadow-green min-h-[44px]">
              <Plus size={14} /> புதிய சலுகை
            </button>
          </div>

          {customerOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-lato">
              <Gift size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">இந்த வாடிக்கையாளருக்கு சலுகைகள் எதுவும் இல்லை.</p>
              <button onClick={openAddModal} className="mt-3 text-xs text-forest-700 hover:text-gold font-bold transition-colors cursor-pointer min-h-[44px]">
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
                  <div key={offer.id} className={`border rounded-none p-4 transition-all bg-white ${offer.isActive ? "border-gold/40 shadow-sm" : "border-gray-200 opacity-60"}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <OfferBadge offer={offer} />
                        <span className="font-bold text-gray-900 text-sm font-lato min-w-0 [overflow-wrap:anywhere]">{offer.name}</span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })} className={`p-1.5 rounded-none transition-colors cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center ${offer.isActive ? "text-forest-700 hover:bg-forest-100" : "text-gray-400 hover:bg-gray-100"}`}>
                          {offer.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button onClick={() => openEditModal(offer)} className="p-1.5 rounded-none text-forest-700 hover:bg-forest-100 transition-colors cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => deleteOffer(offer.id)} className="p-1.5 rounded-none text-danger hover:bg-red-50 transition-colors cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-0.5 font-lato">
                      {offer.type === "item" && offerItem && (
                        <div className="flex items-center gap-1.5 font-medium flex-wrap">
                          <Package size={12} className="shrink-0" />
                          <span className="min-w-0 [overflow-wrap:anywhere]">{offerItem.tamilName} ({offerItem.englishName})</span>
                          <span>·</span>
                          <span className="text-forest-700 font-bold">{offer.discountType === "percent" ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}</span>
                        </div>
                      )}
                      {offer.type === "combo" && (
                        <div className="min-w-0 [overflow-wrap:anywhere]">
                          <span className="font-bold">காம்போ: </span>
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
        <div className="space-y-5 font-lato">
          {/* Offer type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Offer Type</label>
            <div className="flex gap-3">
              {["item", "combo"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2.5 rounded-none text-xs font-bold capitalize border transition-all cursor-pointer min-h-[44px] ${
                    form.type === t
                      ? "bg-forest text-cream-100 border-forest shadow-sm"
                      : "border-gray-300 text-gray-700 hover:border-forest-400 bg-white"
                  }`}
                >
                  {t === "item" ? "தனிப் பொருள் சலுகை (Item Offer)" : "காம்போ சலுகை (Combo Offer)"}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">சலுகைப் பெயர் (Offer Name)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="உ.ம். மஞ்சள் 15% off / மூலிகை காம்போ"
              className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
            />
          </div>

          {/* Item offer fields */}
          {form.type === "item" && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">பொருளைத் தேர்வு செய்க (Select Item)</label>
                <select
                  value={form.itemId}
                  onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                  className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 cursor-pointer font-medium"
                >
                  <option value="">— பொருளைத் தேர்ந்தெடுக்கவும் —</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.tamilName} ({i.englishName}) - ₹{i.price.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">தள்ளுபடி வகை (Discount Type)</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 cursor-pointer font-medium"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">தள்ளுபடி மதிப்பு (Discount Value)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === "percent" ? "15" : "50"}
                    className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </>
          )}

          {/* Combo offer fields */}
          {form.type === "combo" && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">பொருட்களைத் தேர்வு செய்க (குறைந்தது 2)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto border border-gray-200 rounded-none p-3 bg-gray-50">
                  {items.map((i) => (
                    <label key={i.id} className="flex items-center gap-2 p-2 rounded-none hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.itemIds.includes(i.id)}
                        onChange={() => toggleComboItem(i.id)}
                        className="accent-[#2d5a3d] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <span className="text-xs font-bold text-gray-800 font-catamaran min-w-0 [overflow-wrap:anywhere]">
                        {i.tamilName} ({i.englishName})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">காம்போ சிறப்பு விலை (Combo Price in ₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.comboPrice}
                  onChange={(e) => setForm({ ...form, comboPrice: e.target.value })}
                  placeholder="உ.ம். 599"
                  className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900"
                />
              </div>
            </>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">தொடக்க தேதி (Start Date)</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">முடிவு தேதி (End Date)</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border border-gray-200 rounded-none px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:border-gold bg-gray-50 text-gray-900 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-white text-gray-700 border border-gray-300 font-bold py-2.5 flex-1 rounded-none hover:bg-gray-100 text-xs cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="bg-forest text-cream-100 font-bold py-2.5 flex-1 rounded-none hover:bg-forest-700 text-xs cursor-pointer border-0 shadow-green min-h-[44px]">
              {editOffer ? "Update Offer" : "Create Offer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
