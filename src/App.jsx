import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { LanguageProvider } from "./context/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";

// User layout & pages
import UserLayout from "./components/UserLayout";
import HomePage from "./pages/user/HomePage";
import ItemListPage from "./pages/user/ItemListPage";
import ItemDetailPage from "./pages/user/ItemDetailPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import LoginPage from "./pages/user/LoginPage";
import AboutPage from "./pages/user/AboutPage";
import ContactPage from "./pages/user/ContactPage";

import ProtectedRoute from "./components/ProtectedRoute";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminItemsPage from "./pages/admin/AdminItemsPage";
import AdminAddItemPage from "./pages/admin/AdminAddItemPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminSuggestionPage from "./pages/admin/AdminSuggestionPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminCustomerDetailPage from "./pages/admin/AdminCustomerDetailPage";
import AdminOffersPage from "./pages/admin/AdminOffersPage";

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* User routes wrapped in UserLayout */}
              <Route element={<UserLayout />}>
                <Route path="/"       element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
                <Route path="/shop"   element={<ErrorBoundary><ItemListPage /></ErrorBoundary>} />
                <Route path="/item/:id" element={<ErrorBoundary><ItemDetailPage /></ErrorBoundary>} />
                <Route path="/cart"   element={<ErrorBoundary><CartPage /></ErrorBoundary>} />
                <Route path="/login"  element={<ErrorBoundary><LoginPage /></ErrorBoundary>} />
                <Route path="/about"  element={<ErrorBoundary><AboutPage /></ErrorBoundary>} />
                <Route path="/contact" element={<ErrorBoundary><ContactPage /></ErrorBoundary>} />

                {/* Checkout: requires any logged-in user */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <ErrorBoundary><CheckoutPage /></ErrorBoundary>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>

              {/* Admin routes (protected) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ErrorBoundary>
                      <AdminLayout />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"      element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                <Route path="items"          element={<ErrorBoundary><AdminItemsPage /></ErrorBoundary>} />
                <Route path="items/new"      element={<ErrorBoundary><AdminAddItemPage /></ErrorBoundary>} />
                <Route path="items/edit/:id" element={<ErrorBoundary><AdminAddItemPage /></ErrorBoundary>} />
                <Route path="categories"     element={<ErrorBoundary><AdminCategoriesPage /></ErrorBoundary>} />
                <Route path="suggestions"    element={<ErrorBoundary><AdminSuggestionPage /></ErrorBoundary>} />
                <Route path="customers"      element={<ErrorBoundary><AdminCustomersPage /></ErrorBoundary>} />
                <Route path="customers/:id"  element={<ErrorBoundary><AdminCustomerDetailPage /></ErrorBoundary>} />
                <Route path="offers"         element={<ErrorBoundary><AdminOffersPage /></ErrorBoundary>} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </StoreProvider>
    </LanguageProvider>
  );
}
