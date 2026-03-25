"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    { path: "/catalog", label: "Treatments" },
    { path: "/membership", label: "Memberships" }, 
    { path: "/locations", label: "Locations" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0F0F14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* LEFT - Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/20">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Reflect
          </span>
        </Link>

        {/* CENTER - Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive(link.path) 
                  ? 'text-white' 
                  : 'text-[#A1A1AA]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <motion.button
                className="rounded-xl p-2 text-[#A1A1AA] transition-colors hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5" />
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/"
                  className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center transition-colors hover:bg-purple-600/30"
                >
                  <User className="h-4 w-4 text-purple-400" />
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.button
                className="hidden md:inline-flex rounded-xl bg-[#6D28D9] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6]"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Sign In
              </motion.button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-xl p-2 text-[#A1A1AA] hover:bg-white/5 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-[#1C1C24] px-6 py-4 md:hidden overflow-hidden"
          >
            <div className="space-y-2">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.path) 
                      ? 'bg-purple-600/10 text-purple-400'
                      : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <button className="w-full mt-2 rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5B21B6] transition-colors">
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
