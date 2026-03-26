import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { logOut } from "../../firebase";
import {
  LayoutDashboard,
  Sparkles,
  CreditCard,
  Stethoscope,
  Users,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  Gift,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  if (isPublicRoute) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Membership", href: "/membership", icon: Sparkles },
    { name: "Beauty Bank", href: "/credits", icon: CreditCard },
    { name: "Treatments", href: "/treatments", icon: Stethoscope },
    { name: "Referrals", href: "/referrals", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Gift Cards", href: "/gift-cards", icon: Gift },
    { name: "Locations", href: "/locations", icon: MapPin },
    { name: "Settings", href: "/settings", icon: Settings },
    ...(profile?.role === "admin" ? [{ name: "Admin", href: "/admin", icon: ShieldCheck }] : []),
  ];

  const handleSignOut = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex transition-colors duration-200" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Sidebar (Desktop) */}
      <aside
        className={`hidden md:flex flex-col border-r fixed h-full z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
        style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
      >
        {/* Logo + Collapse Toggle */}
        <div className={`flex items-center p-4 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <img src="/reflect-logo.png" alt="Reflect Medical" className="h-10 w-auto object-contain" />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                title={sidebarCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-semibold border-l-2 border-violet-600"
                    : "hover:bg-gray-50"
                }`}
                style={!isActive ? { color: 'var(--text-secondary)' } : {}}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-violet-600" : ""}`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-3 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl" style={{ backgroundColor: 'var(--card-subtle)' }}>
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                  {profile?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{profile?.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{profile?.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-gray-50 ${sidebarCollapsed ? 'justify-center' : ''}`}
              style={{ color: 'var(--text-secondary)' }}
              title={sidebarCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 w-full h-16 z-50 flex items-center justify-between px-4 transition-colors duration-200" style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <img
            src="/reflect-logo.png"
            alt="Reflect Medical"
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-secondary)' }}
            className="p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 transition-colors duration-200" style={{ backgroundColor: 'var(--bg)' }}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 font-semibold" : ""
                  }`}
                  style={!isActive ? { color: 'var(--text-secondary)' } : {}}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            {user && (
              <button
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 mt-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen pt-16 md:pt-0 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}



