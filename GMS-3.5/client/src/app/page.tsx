"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for routing logic
import { 
  ShieldCheck, 
  Clock, 
  FileSearch, 
  ArrowRight, 
  Activity,
  Building2,
  Users,
  Landmark,
  Lock
} from "lucide-react";
import { API_BASE_URL } from '@/utils/api';

const LandingPage = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/me`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // --- THE NEW LOGIC ---
  const handleCitizenAccess = (e: React.MouseEvent) => {
    // Check if user is Staff
    if (userRole === "Admin" || userRole === "SuperAdmin" || userRole === "Worker") {
      e.preventDefault(); // STOP the navigation
      
      const shouldSignOut = window.confirm(
        "⚠️ Access Restricted\n\nYou are currently logged in as a Staff Member (Admin/Worker).\n\nTo File a Grievance or Track Status, you must use a Citizen account.\n\nDo you want to sign out now?"
      );

      if (shouldSignOut) {
        // Perform Logout
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");
        window.location.href = "/login"; // Redirect to login
      }
    }
    // If Citizen or Not Logged In, the Link works normally (goes to /dashboard)
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        
        {/* Background Texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
              Official Grievance Portal
            </span>
          </div>
          
          {/* Headline */}
          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Secure, Transparent, <br className="hidden md:block" />
            <span className="text-emerald-600 dark:text-emerald-500">Public Redressal System</span>
          </h1>
          
          {/* Subheadline */}
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            The trusted platform for citizens to report concerns and track resolutions. We ensure accountability and timely action for every grievance.
          </p>

          {/* CTA Buttons - Using handleCitizenAccess to gate Admins */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            
            <Link href="/dashboard" onClick={handleCitizenAccess} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-all shadow-lg hover:-translate-y-0.5">
                File a Grievance
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link href="/dashboard" onClick={handleCitizenAccess} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                Track Status
              </button>
            </Link>

          </div>

          {/* Trust Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-slate-200 dark:border-slate-800 pt-8 animate-in fade-in duration-1000 delay-500">
            <div className="flex flex-col items-center">
              <Landmark className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Government Initiative</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Secure & Encrypted</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Citizen First</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Timely Resolution</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">System Capabilities</h2>
            <p className="text-slate-600 dark:text-slate-400">Designed for efficiency, transparency, and public trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-950 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Identity Protection</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Your personal data is encrypted. We prioritize your privacy while ensuring your grievance reaches the right department.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Inter-Departmental Sync</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Seamless coordination between Sanitation, Transport, and Law Enforcement departments for faster case closures.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mb-6">
                <FileSearch className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Audit Trails</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Every action is logged. View the complete history of your application, from submission to final resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Resolution Process</h2>
            <p className="text-slate-600 dark:text-slate-400">A streamlined workflow for effective governance.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-slate-100 dark:bg-slate-800 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Submit Ticket</h3>
                <p className="text-sm text-slate-500 max-w-xs">Register your complaint with specific category and location details.</p>
              </div>

              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 border-4 border-emerald-50 dark:border-emerald-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-emerald-600">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Verification & Action</h3>
                <p className="text-sm text-slate-500 max-w-xs">Field officers investigate the issue and perform necessary actions.</p>
              </div>

              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-emerald-600">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Closure & Feedback</h3>
                <p className="text-sm text-slate-500 max-w-xs">Receive a resolution report. Close the ticket if satisfied or re-open.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA STRIP --- */}
      <section className="py-16 bg-slate-900 dark:bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Empowering Citizens, Ensuring Accountability.</h2>
          <p className="text-slate-400 mb-8">Join the platform that is transforming public administration.</p>
          <Link href="/dashboard" onClick={handleCitizenAccess}>
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg hover:-translate-y-0.5">
              Access Portal
            </button>
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-900 dark:text-white">Grievance<span className="text-emerald-600">Resolve</span></span>
            </div>
            <p className="text-slate-500">Official Public Redressal System</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-slate-600 dark:text-slate-400 font-medium">
            <Link href="/about" className="hover:text-emerald-600 transition-colors">About System</Link>
            <Link href="/login/workerloginpage" className="hover:text-emerald-600 transition-colors">Staff Access</Link>
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            <Link href="/help" className="hover:text-emerald-600 transition-colors">Help Center</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-slate-400 text-xs">
          &copy; {new Date().getFullYear()} Government of India. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;