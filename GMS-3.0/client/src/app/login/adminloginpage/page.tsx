"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Eye, EyeOff, Lock, LayoutDashboard, ArrowLeft, Loader2, ShieldCheck
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5087/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          email: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role !== "Admin" && data.role !== "SuperAdmin") {
            alert("Access Denied: Administrative Privileges Required.");
            setIsLoading(false);
            return;
        }
        const uiData = { fullName: data.fullName, role: data.role, userId: data.userId };
        localStorage.setItem("user_info", JSON.stringify(uiData));
        window.dispatchEvent(new Event("storage"));
        router.push("/admin/dashboard");
      } else {
        alert(data.message || "Login failed");
        setIsLoading(false);
      }
    } catch (error) {
      alert("Server connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* --- LEFT SIDE: SIDEBAR --- */}
      <div className="hidden lg:flex w-1/3 bg-slate-900 relative flex-col justify-between p-12">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-lg tracking-wide text-white">GMS ADMIN</span>
            </div>
            
            <h1 className="text-3xl font-bold leading-tight text-white mb-4">
                System Administration
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Manage grievances, oversee department performance, and generate resolution reports.
            </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
            Authorized Personnel Only
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm animate-in fade-in duration-500">
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Administrator Login</h2>
                <p className="mt-1 text-slate-500 text-sm">Enter your credentials to access the console.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Admin Email</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                        <input 
                            name="username" 
                            type="text" 
                            required 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all shadow-sm"
                            placeholder="admin@govt.in"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                        <input 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all shadow-sm"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Verifying..." : "Sign In to Console"}
                </button>

                <div className="text-center pt-6 border-t border-slate-100 mt-6">
                    <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-3 h-3"/> Return to Main Portal
                    </Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}