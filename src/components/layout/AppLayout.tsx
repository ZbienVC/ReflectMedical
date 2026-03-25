import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { logOut } from "../../firebase";
import { 
  LayoutDashboard, 
  Sparkles, 
  Wallet, 
  Stethoscope, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  if (isPublicRoute) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Membership", href: "/membership", icon: Sparkles },
    { name: "Beauty Bank", href: "/wallet", icon: Wallet },
    { name: "Treatments", href: "/treatments", icon: Stethoscope },
    { name: "Referrals", href: "/referrals", icon: Users },
  ];

  if (profile?.role === "admin") {
    navItems.push({ name: "Settings", href: "/admin", icon: Settings });
  }

  const handleSignOut = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed h-full z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Reflect</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {profile?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{profile?.name}</p>
                <p className="text-xs text-text-secondary truncate">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-card/90 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white">Reflect</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-secondary hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-text-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-4 text-text-secondary mt-4"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
