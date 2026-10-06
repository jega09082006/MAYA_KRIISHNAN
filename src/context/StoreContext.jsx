import React, { createContext, useContext, useState, useMemo } from "react";
import {
  MOCK_ITEMS,
  MOCK_CUSTOMERS,
  MOCK_OFFERS,
  MOCK_ORDERS,
  PUBLIC_CATEGORIES,
  MOCK_SUGGESTION_GROUPS,
} from "../data/mockData";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [orders] = useState(MOCK_ORDERS);
  const [publicCategories, setPublicCategories] = useState(PUBLIC_CATEGORIES);
  const [suggestionGroups, setSuggestionGroups] = useState(MOCK_SUGGESTION_GROUPS);
  const [cart, setCart] = useState(() => {
    // ── Persist cart across page refreshes ─────────────────────────────
    try {
      const saved = localStorage.getItem("maya_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Drop any invalid entries (must be {id: string, qty: positive number})
      return Array.isArray(parsed)
        ? parsed.filter((e) => e && typeof e.id === "string" && typeof e.qty === "number" && e.qty > 0)
        : [];
    } catch (_) {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState(null); // null = guest, { role:'admin'|'customer', ...data }
  const [searchQuery, setSearchQuery] = useState("");

  // ── Persist cart to localStorage on every change ──────────────────────
  React.useEffect(() => {
    try {
      localStorage.setItem("maya_cart", JSON.stringify(cart));
    } catch (_) {
      // Storage full or blocked — silent fail
    }
  }, [cart]);

  // ── Derived Active Suggestion Groups with resolved items ──
  const activeSuggestionGroups = useMemo(() => {
    return [...suggestionGroups]
      .filter((g) => g.isActive)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .map((g) => ({
        ...g,
        items: (g.itemIds || [])
          .map((id) => items.find((i) => i.id === id))
          .filter(Boolean),
      }))
      .filter((g) => g.items.length > 0);
  }, [suggestionGroups, items]);

  // Active offers for the currently-logged-in customer
  const activeOffersForUser = currentUser?.role === "customer"
    ? offers.filter((o) => o.customerId === currentUser.id && o.isActive)
    : [];

  function getItemPrice(item) {
    if (!item) return 0;
    if (!currentUser || currentUser.role !== "customer") return item.price ?? 0;
    const offer = activeOffersForUser.find(
      (o) => o.type === "item" && o.itemId === item.id
    );
    if (!offer) return item.price ?? 0;
    if (offer.discountType === "percent")
      return Math.round((item.price ?? 0) * (1 - offer.discountValue / 100));
    if (offer.discountType === "flat")
      return Math.max(0, (item.price ?? 0) - offer.discountValue);
    return item.price ?? 0;
  }

  function getItemOffer(item) {
    if (!item) return null;
    if (!currentUser || currentUser.role !== "customer") return null;
    return (
      activeOffersForUser.find(
        (o) => o.type === "item" && o.itemId === item.id
      ) || null
    );
  }

  // ── Cart ─────────────────────────────────────────────────
  // Store only { id, qty } — resolve to full item at render time.
  // qty param lets callers add more than 1 at once (e.g. Buy Now from card).
  function addToCart(item, qty = 1) {
    if (!item?.id || qty < 1) return;
    const safeQty = Math.max(1, Math.round(qty));
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + safeQty } : c
        );
      return [...prev, { id: item.id, qty: safeQty }];
    });
  }

  function removeFromCart(itemId) {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  }

  function updateCartQty(itemId, qty) {
    if (qty <= 0) return removeFromCart(itemId);
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, qty } : c))
    );
  }

  function clearCart() {
    setCart([]);
  }

  /**
   * mergeCart — called after login/register to combine the guest cart
   * (already in state) with any persisted customer cart.
   * Strategy: for each entry in `incomingCart`, if the same itemId already
   * exists in the current state cart, add the quantities; otherwise append.
   * This keeps the guest items the user added before logging in.
   */
  function mergeCart(incomingCart) {
    if (!incomingCart || incomingCart.length === 0) return;
    setCart((prev) => {
      const merged = [...prev];
      for (const entry of incomingCart) {
        if (!entry?.id) continue;
        const idx = merged.findIndex((c) => c.id === entry.id);
        if (idx !== -1) {
          merged[idx] = { ...merged[idx], qty: merged[idx].qty + (entry.qty || 1) };
        } else {
          merged.push({ id: entry.id, qty: entry.qty || 1 });
        }
      }
      return merged;
    });
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  // cartTotal is a FUNCTION so consumers can call cartTotal() safely.
  // getItemPrice guards against missing/undefined items.
  function cartTotal() {
    return cart.reduce((s, c) => {
      const masterItem = items.find((i) => i.id === c.id) || c;
      return s + getItemPrice(masterItem) * (c.qty || 1);
    }, 0);
  }

  // ── Price helpers exposed to ItemDetailPage ───────────────
  /** Returns the original (undiscounted) price for an item. */
  function getOriginalPrice(item) {
    if (!item) return 0;
    return item.price ?? 0;
  }

  /** Returns the discount % (0–100) if an active offer applies, else 0. */
  function getOfferPercentage(item) {
    if (!item) return 0;
    const offer = getItemOffer(item);
    if (!offer) return 0;
    const discounted = getItemPrice(item);
    const original   = item.price ?? 0;
    if (original <= 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
  }

  // ── Auth ─────────────────────────────────────────────────
  function login(identifier, password) {
    const cleanId = (identifier || "").trim();
    const cleanPass = (password || "").trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: "பயனர் விவரங்கள் மற்றும் கடவுச்சொல்லை உள்ளிடவும் (Please enter credentials)." };
    }

    // Admin authentication check
    const isAdminId = cleanId.toLowerCase() === "jegathees" || cleanId === "9360833089";
    if (isAdminId) {
      if (cleanPass === "09082006") {
        const adminUser = {
          role: "admin",
          id: "jegathees",
          name: "Jegatheesan (Admin)",
          phone: "9360833089",
          email: "admin@mayakrishnan.com",
        };
        setCurrentUser(adminUser);
        return { success: true, role: "admin", user: adminUser };
      } else {
        return { success: false, message: "தவறான கடவுச்சொல்! (Invalid password for Admin)" };
      }
    }

    // Customer login check
    const matchedCustomer = customers.find(
      (c) =>
        c.id === cleanId ||
        c.username?.toLowerCase() === cleanId.toLowerCase() ||
        c.phone?.replaceAll(" ", "").includes(cleanId) ||
        c.name.toLowerCase().includes(cleanId.toLowerCase())
    );

    if (matchedCustomer && matchedCustomer.password) {
      if (matchedCustomer.password !== cleanPass) {
        return { success: false, message: "தவறான கடவுச்சொல்! (Incorrect password)" };
      }
    }

    const userObj = matchedCustomer
      ? { role: "customer", ...matchedCustomer }
      : { role: "customer", id: `cust-${Date.now()}`, name: cleanName, phone: cleanName };

    setCurrentUser(userObj);
    return { success: true, role: "customer", user: userObj };
  }

  function registerCustomer({ name, phone, username, password }) {
    const cleanName = (name || "").trim();
    const cleanPhone = (phone || "").trim();
    const cleanUsername = (username || "").trim();
    const cleanPassword = (password || "").trim();

    if (!cleanName || !cleanPhone || !cleanUsername || !cleanPassword) {
      return {
        success: false,
        message: "அனைத்து விவரங்களையும் பூர்த்தி செய்யவும் (Please fill in all fields).",
      };
    }

    // Check if phone or username already exists
    const existing = customers.find(
      (c) =>
        (c.username && c.username.toLowerCase() === cleanUsername.toLowerCase()) ||
        (c.phone && c.phone.replaceAll(" ", "") === cleanPhone.replaceAll(" ", ""))
    );
    if (existing) {
      return {
        success: false,
        message: "இந்த பயனர் பெயர் அல்லது தொலைபேசி எண் ஏற்கனவே உள்ளது! (Username or Phone number already registered)",
      };
    }

    const newCust = {
      id: `cust-${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      phone: cleanPhone,
      password: cleanPassword,
      email: `${cleanUsername}@example.com`,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      address: "Tamil Nadu, India",
    };

    setCustomers((prev) => [newCust, ...prev]);

    const userObj = { role: "customer", ...newCust };
    setCurrentUser(userObj);

    return { success: true, user: userObj };
  }

  function loginAsAdmin() {
    setCurrentUser({
      role: "admin",
      id: "jegathees",
      name: "Jegatheesan (Admin)",
      phone: "9360833089",
      email: "admin@mayakrishnan.com",
    });
  }

  function loginAsCustomer(customerId) {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) setCurrentUser({ role: "customer", ...cust });
  }

  function logout() {
    setCurrentUser(null);
  }

  // ── Admin: Items ─────────────────────────────────────────
  function addItem(item) {
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
      categoryIds: item.categoryIds || ["cat-1"],
    };
    setItems((prev) => [...prev, newItem]);
    return newItem;
  }

  function updateItem(id, updates) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    // Remove deleted item from all suggestion groups
    setSuggestionGroups((prev) =>
      prev.map((g) => ({
        ...g,
        itemIds: (g.itemIds || []).filter((itemId) => itemId !== id),
      }))
    );
  }

  // ── Admin: Categories (PUBLIC) ───────────────────────────
  function addCategory(label) {
    const newCat = {
      id: `cat-${Date.now()}`,
      label,
      shortLabel: label,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    };
    setPublicCategories((prev) => [...prev, newCat]);
  }

  function renameCategory(id, label) {
    setPublicCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label, shortLabel: label } : c))
    );
  }

  function deleteCategory(id) {
    setPublicCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        categoryIds: (i.categoryIds || []).filter((cid) => cid !== id),
      }))
    );
  }

  // ── Admin: Suggestion Groups (Many-to-Many System) ───────
  function createGroup({ name, tamilName, color }) {
    const maxOrder = Math.max(0, ...suggestionGroups.map((g) => g.order ?? 0));
    const newGroup = {
      id: `sug-${Date.now()}`,
      name: name.trim(),
      tamilName: tamilName?.trim() || name.trim(),
      color: color || "#2d5a3d",
      isActive: true,
      order: maxOrder + 1,
      itemIds: [],
    };
    setSuggestionGroups((prev) => [...prev, newGroup]);
    return newGroup;
  }

  function updateGroup(groupId, updates) {
    setSuggestionGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updates } : g))
    );
  }

  function deleteGroup(groupId) {
    setSuggestionGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  function moveGroup(groupId, direction) {
    const sorted = [...suggestionGroups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex((g) => g.id === groupId);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const orderA = sorted[idx].order ?? (idx + 1);
    const orderB = sorted[swapIdx].order ?? (swapIdx + 1);

    setSuggestionGroups((prev) =>
      prev.map((g) => {
        if (g.id === sorted[idx].id) return { ...g, order: orderB };
        if (g.id === sorted[swapIdx].id) return { ...g, order: orderA };
        return g;
      })
    );
  }

  function addItemToGroup(groupId, itemId) {
    setSuggestionGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        if (g.itemIds && g.itemIds.includes(itemId)) return g;
        return {
          ...g,
          itemIds: [...(g.itemIds || []), itemId],
        };
      })
    );
  }

  function removeItemFromGroup(groupId, itemId) {
    setSuggestionGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          itemIds: (g.itemIds || []).filter((id) => id !== itemId),
        };
      })
    );
  }

  function moveItemInGroup(groupId, itemId, direction) {
    setSuggestionGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const ids = [...(g.itemIds || [])];
        const idx = ids.indexOf(itemId);
        if (idx === -1) return g;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= ids.length) return g;
        const temp = ids[idx];
        ids[idx] = ids[swapIdx];
        ids[swapIdx] = temp;
        return { ...g, itemIds: ids };
      })
    );
  }

  function setItemGroups(itemId, groupIds) {
    setSuggestionGroups((prev) =>
      prev.map((g) => {
        const shouldBeIn = groupIds.includes(g.id);
        const isCurrentlyIn = (g.itemIds || []).includes(itemId);
        if (shouldBeIn && !isCurrentlyIn) {
          return { ...g, itemIds: [...(g.itemIds || []), itemId] };
        }
        if (!shouldBeIn && isCurrentlyIn) {
          return { ...g, itemIds: (g.itemIds || []).filter((id) => id !== itemId) };
        }
        return g;
      })
    );
  }

  function getGroupsOfItem(itemId) {
    return suggestionGroups.filter((g) => (g.itemIds || []).includes(itemId));
  }

  // ── Admin: Offers ─────────────────────────────────────────
  function addOffer(offer) {
    const newOffer = { ...offer, id: `offer-${Date.now()}` };
    setOffers((prev) => [...prev, newOffer]);
  }

  function updateOffer(id, updates) {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  }

  function deleteOffer(id) {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  // ── Admin: Customers ──────────────────────────────────────
  function updateCustomer(id, updates) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  return (
    <StoreContext.Provider
      value={{
        // data
        items,
        customers,
        offers,
        orders,
        publicCategories,
        suggestionGroups,
        activeSuggestionGroups,
        // cart
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        mergeCart,
        // auth
        currentUser,
        login,
        registerCustomer,
        loginAsAdmin,
        loginAsCustomer,
        logout,
        // pricing
        getItemPrice,
        getItemOffer,
        getOriginalPrice,
        getOfferPercentage,
        activeOffersForUser,
        // admin items
        addItem,
        updateItem,
        deleteItem,
        // admin categories
        addCategory,
        renameCategory,
        deleteCategory,
        // admin suggestion groups
        createGroup,
        updateGroup,
        deleteGroup,
        moveGroup,
        addItemToGroup,
        removeItemFromGroup,
        moveItemInGroup,
        setItemGroups,
        getGroupsOfItem,
        // admin offers
        addOffer,
        updateOffer,
        deleteOffer,
        // admin customers
        updateCustomer,
        // search
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
