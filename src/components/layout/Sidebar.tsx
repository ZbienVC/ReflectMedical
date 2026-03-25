"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard,
  CreditCard,
  Calendar,
  Stethoscope,
  Settings,
  LogOut,
  PiggyBank,
  Users,
  Sparkles
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Treatment Catalog", href: "/catalog", icon: Stethoscope },
  { name: "Beauty Bucks", href: "/wallet", icon: CreditCard },
  { name: "Bank Your Points", href: "/banking", icon: PiggyBank },
  { name: "Referrals", href: "/referrals", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden w-64 border-r border-white/5 bg-[#1C1C24] lg:block min-h-screen sticky top-16">
      {/* Navigation */}
      <nav className="p-4 pt-6">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <motion.div key={item.name} whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                <Link
                  to={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                      : "text-[#A1A1AA] hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-purple-400" : "text-[#71717A] group-hover:text-white"} transition-colors`} />
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="my-6 border-t border-white/5" />

        <div className="space-y-1">
          <Link
            to="/admin"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#A1A1AA] transition-all hover:bg-white/5 hover:text-white border border-transparent"
          >
            <Settings className="h-5 w-5 text-[#71717A] group-hover:text-white transition-colors" />
            Settings
          </Link>
          
          <button className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#A1A1AA] transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent">
            <LogOut className="h-5 w-5 text-[#71717A] group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
