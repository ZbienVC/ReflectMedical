import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Dashboard from "./pages/Dashboard";
import EnhancedMembership from "./pages/EnhancedMembership";
import Treatments from "./pages/Treatments";
import Locations from "./pages/Locations";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import ErrorBoundary from "./components/ErrorBoundary";

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  if (adminOnly && profile?.role !== "admin") return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/membership" element={<EnhancedMembership />} />
              <Route path="/memberships" element={<Navigate to="/membership" replace />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/checkout/:serviceId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
