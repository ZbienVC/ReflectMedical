import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { logOut } from "../../firebase";
import {
  LayoutDashboard,
  Sparkles,
  CreditCard,
  Gift,
  Stethoscope,
  Users,
  Users2,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password"];

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  if (isPublicRoute) {
    return <>{children}</>;
  }

  const isAdminOrAbove = profile?.role === "admin" || profile?.role === "superadmin";
  const isSuperAdmin = profile?.role === "superadmin";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Membership", href: "/membership", icon: Sparkles },
    { name: "Credits", href: "/credits", icon: CreditCard },
    { name: "Gift Cards", href: "/gift-cards", icon: Gift },
    { name: "Treatments", href: "/treatments", icon: Stethoscope },
    { name: "Referrals", href: "/referrals", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Locations", href: "/locations", icon: MapPin },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const adminItems = isAdminOrAbove
    ? [
        { name: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
        ...(isSuperAdmin ? [{ name: "Users", href: "/admin/users", icon: Users2 }] : []),
      ]
    : [];

  const handleSignOut = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F7FB] dark:bg-[#0B0B0F] text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 fixed h-full z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Reflect</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-semibold border-l-2 border-violet-600"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-violet-600 dark:text-violet-400" : ""}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Admin section */}
          {isAdminOrAbove && adminItems.length > 0 && (
            <>
              <div className="pt-4 pb-1 px-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </div>
              </div>
              {adminItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-semibold border-l-2 border-violet-600"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-violet-600 dark:text-violet-400" : ""}`} />
                    {item.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
            {/* Theme Toggle in desktop sidebar */}
            <div className="flex items-center justify-between px-4 py-2.5 mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark mode</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold">
                {profile?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{profile?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">Reflect</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile admin section */}
            {isAdminOrAbove && adminItems.length > 0 && (
              <>
                <div className="pt-4 pb-1 px-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </div>
                </div>
                {adminItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl mt-2 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </nav>
          {/* User info at bottom of mobile menu */}
          {user && (
            <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 font-bold">
                  {profile?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile?.name}</p>
                  <p className="text-xs text-gray-500">{profile?.membershipTierId ? `${profile.membershipTierId} member` : "Member"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Dark mode</span>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}