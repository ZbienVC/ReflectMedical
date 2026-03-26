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
import Credits from "./pages/Credits";
import ReferralCenter from "./pages/ReferralCenter";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import IntakeForm from "./pages/IntakeForm";
import Packages from "./pages/Packages";
import ErrorBoundary from "./components/ErrorBoundary";
import AppLayout from "./components/layout/AppLayout";

import GiftCards from "./pages/GiftCards";
import Landing from "./pages/Landing";

const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && profile?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppInner />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <AppLayout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/gift-cards" element={<GiftCards />} />

        {/* Root: Landing if logged out, Dashboard if logged in */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/membership" element={<PrivateRoute><EnhancedMembership /></PrivateRoute>} />
        <Route path="/memberships" element={<Navigate to="/membership" replace />} />
        <Route path="/treatments" element={<PrivateRoute><Treatments /></PrivateRoute>} />
        <Route path="/locations" element={<PrivateRoute><Locations /></PrivateRoute>} />
        <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
        <Route path="/credits" element={<PrivateRoute><Credits /></PrivateRoute>} />
        <Route path="/wallet" element={<Navigate to="/credits" replace />} />
        <Route path="/banking" element={<Navigate to="/credits" replace />} />
        <Route path="/referrals" element={<PrivateRoute><ReferralCenter /></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/checkout/:serviceId" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/intake" element={<PrivateRoute><IntakeForm /></PrivateRoute>} />
        <Route path="/packages" element={<PrivateRoute><Packages /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}
