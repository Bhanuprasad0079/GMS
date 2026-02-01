"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, X, ShieldCheck, LogOut, Sun, Moon, User
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ role: string, fullName: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. AUTH CHECK
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:5087/api/Auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
          setIsLoggedIn(true);
        } else {
          setUserInfo(null);
          setIsLoggedIn(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
      }
    };

    // 2. THEME CHECK
    const checkTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    };

    checkLoginStatus();
    checkTheme();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5087/api/Auth/logout", { method: "POST", credentials: "include" });
    } catch (e) { console.error("Logout error", e); }
    localStorage.removeItem("user_info");
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsOpen(false);
    router.push("/login");
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const getDashboardLink = () => {
    const role = userInfo?.role;
    if (role === "Admin" || role === "SuperAdmin") return "/admin/dashboard";
    if (role === "Worker") return "/worker/dashboard";
    return "/dashboard";
  };

  const dashboardLink = getDashboardLink();

  // Helper for Nav Links with Transition
  const NavLink = ({ href, label }: { href: string, label: string }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${
          isActive 
            ? "text-emerald-500 dark:text-emerald-400" 
            : "text-slate-400 hover:text-white"
        }`}
      >
        {label}
        {/* Animated Underline */}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`}></span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-800 shadow-lg transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-slate-900" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white leading-none group-hover:text-emerald-400 transition-colors">
                GRIEVANCE<span className="text-emerald-500">RESOLVE</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">
                Official Portal
              </span>
            </div>
          </Link>

          {/* --- DESKTOP MENU (Animated) --- */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About" />
            {isLoggedIn && <NavLink href={dashboardLink} label="Dashboard" />}
          </div>

          {/* --- DESKTOP ACTIONS --- */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-white leading-none">{userInfo?.fullName.split(' ')[0]}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md transition-all active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right duration-500">
                <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleTheme} className="text-slate-400 hover:text-white transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white focus:outline-none transition-colors">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Slide Down) --- */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2">
          <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/about" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>About</Link>
          
          {isLoggedIn && (
            <Link href={dashboardLink} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === dashboardLink ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              Dashboard
            </Link>
          )}

          <div className="border-t border-slate-800 pt-4 mt-2">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-rose-900/30 text-rose-400 font-bold hover:bg-rose-900/50 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center px-4 py-3 rounded-lg border border-slate-700 text-slate-300 font-bold hover:bg-slate-800">Login</Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-center px-4 py-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}