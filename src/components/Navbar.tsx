import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signIn, logOut } from "../firebase";
import { Sparkles, User, LayoutDashboard, ShoppingBag, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Membership", path: "/membership", icon: Sparkles },
    { name: "Catalog", path: "/catalog", icon: ShoppingBag },
    ...(profile?.role === "admin" ? [{ name: "Admin", path: "/admin", icon: ShieldCheck }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-slate-900">REFLECT</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600",
                  location.pathname === item.path ? "text-emerald-600" : "text-slate-600"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-900">{profile?.name}</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    {profile?.membershipTierId ? "Member" : "Guest"}
                  </span>
                </div>
                <button
                  onClick={logOut}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
