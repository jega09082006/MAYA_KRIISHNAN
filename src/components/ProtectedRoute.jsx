import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";

/**
 * ProtectedRoute
 *
 * requiredRole = "admin"    → used for /admin/* (existing behaviour)
 * requiredRole = "customer" → used for /checkout, /account, etc.
 *                             Guest → /login with redirect state + sessionStorage backup
 * requiredRole = null       → any logged-in user is allowed
 *
 * Redirect safety: the `from` path is only stored if it starts with "/"
 * to prevent open-redirect attacks with external URLs.
 */
export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { currentUser } = useStore();
  const location = useLocation();

  // ── Not logged in at all ───────────────────────────────────────────────
  if (!currentUser) {
    const safePath =
      location.pathname.startsWith("/") ? location.pathname + location.search : "/";

    // Save to sessionStorage as a refresh-safe backup
    try {
      sessionStorage.setItem("redirectAfterLogin", safePath);
    } catch (_) {
      // Storage blocked (private mode, etc.) — silent fail
    }

    return (
      <Navigate
        to="/login"
        state={{ from: { pathname: safePath } }}
        replace
      />
    );
  }

  // ── Logged in but wrong role ───────────────────────────────────────────
  if (requiredRole && currentUser.role !== requiredRole) {
    // Admin trying to reach /checkout → send to admin panel
    // Customer trying to reach /admin → send to login (admin guard handles this)
    if (requiredRole === "admin") {
      return (
        <Navigate
          to="/login"
          state={{ from: { pathname: location.pathname } }}
          replace
        />
      );
    }
    // requiredRole === "customer" but user is admin → just let them through
    // (admins can preview checkout)
  }

  return children;
}
