"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  CreditCard,
  Calendar,
  Stethoscope,
  Settings,
  LogOut,
  PiggyBank,
  Users
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Treatment Catalog",
    href: "/treatments",
    icon: Stethoscope,
  },
  {
    name: "Beauty Bucks",
    href: "/wallet", 
    icon: CreditCard,
  },
  {
    name: "Bank Your Points",
    href: "/banking",
    icon: PiggyBank,
  },
  {
    name: "Referrals",
    href: "/referrals",
    icon: Users,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
];

export default function Sidebar() {
  const location = useLocation();
 const pathname = location.pathname;

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden w-64 border-r border-black/5 bg-white lg:block">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 border-b border-black/5 p-6">
        <div className="h-6 w-6 rounded bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB]" />
        <span className="font-semibold text-[#1F2937]">Dashboard</span>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#B57EDC]/10 text-[#B57EDC] shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F4EEFB] hover:text-[#B57EDC]"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-[#B57EDC]" : "text-[#6B7280] group-hover:text-[#B57EDC]"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-black/5" />

        {/* Settings */}
        <div className="space-y-1">
          <Link
            to="/settings"
            className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#6B7280] transition-all hover:bg-[#F4EEFB] hover:text-[#B57EDC]"
          >
            <Settings className="h-5 w-5 text-[#6B7280] group-hover:text-[#B57EDC]" />
            Settings
          </Link>
          
          <button className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#6B7280] transition-all hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-5 w-5 text-[#6B7280] group-hover:text-red-600" />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}