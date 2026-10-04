import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";

// User pages
import HomePage from "./pages/user/HomePage";
import ItemListPage from "./pages/user/ItemListPage";
import ItemDetailPage from "./pages/user/ItemDetailPage";
import CartPage from "./pages/user/CartPage";
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
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ItemListPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="items" element={<AdminItemsPage />} />
            <Route path="items/new" element={<AdminAddItemPage />} />
            <Route path="items/edit/:id" element={<AdminAddItemPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="suggestions" element={<AdminSuggestionPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
