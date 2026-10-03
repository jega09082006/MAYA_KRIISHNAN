import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { currentUser } = useStore();
  const location = useLocation();

  if (!currentUser || (requiredRole && currentUser.role !== requiredRole)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
