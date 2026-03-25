"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, User, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated = false }: HeaderProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navigationLinks = [
    { path: "/treatments", label: "Treatments" },
    { path: "/membership", label: "Memberships" }, 
    { path: "/locations", label: "Locations" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* LEFT - Premium Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4EEFB]">
            <div className="h-4 w-4 rounded-full bg-[#B57EDC]" />
          </div>
          <span className="text-lg font-semibold text-[#1F2937]">
            Reflect Medical
          </span>
        </Link>

        {/* CENTER - Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[#B57EDC] ${
                isActive(link.path) 
                  ? 'text-[#1F2937] font-medium' 
                  : 'text-[#6B7280]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT - Auth State & Mobile Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F4EEFB] hover:text-[#B57EDC]">
                <Bell className="h-5 w-5" />
              </button>
              
              {/* Profile */}
              <Link 
                to="/dashboard" 
                className="h-8 w-8 rounded-full bg-gradient-to-br from-[#B57EDC]/20 to-[#9F6BCB]/20 flex items-center justify-center transition-transform hover:scale-105"
              >
                <User className="h-4 w-4 text-[#B57EDC]" />
              </Link>
            </>
          ) : (
            <>
              {/* Desktop Sign In */}
              <button className="hidden md:inline-flex rounded-full bg-[#B57EDC] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#9F6BCB] hover:shadow-lg transform hover:scale-105">
                Sign In
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-lg p-2 text-[#6B7280] hover:bg-[#F4EEFB] hover:text-[#B57EDC] transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-black/5 bg-white/95 px-6 py-4 md:hidden">
          <div className="space-y-4">
            {navigationLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-[#1F2937] font-medium' 
                    : 'text-[#6B7280] hover:text-[#B57EDC]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <button className="w-full rounded-full bg-[#B57EDC] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#9F6BCB] mt-4">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}