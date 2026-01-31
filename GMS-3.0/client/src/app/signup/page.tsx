"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Lock, Eye, EyeOff, MapPin, ArrowRight, ArrowLeft, 
  CheckCircle, ShieldCheck, AlertCircle, Loader2, Navigation, UserPlus
} from "lucide-react";

// --- STATIC DATA: STATE & DISTRICT MAPPING ---
const INDIA_LOCATIONS: { [key: string]: string[] } = {
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  "Odisha": ["Angul", "Balangir", "Bhubaneswar", "Cuttack", "Puri", "Rourkela"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida"]
};

export default function SignUpPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); 
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    otp: "", gender: "Male", address: "", state: "", district: "", pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");

    if (name === "state") {
      setDistricts(INDIA_LOCATIONS[value] || []);
      setFormData(prev => ({ ...prev, state: value, district: "" }));
    }
  };

  // HANDLERS (Same logic as before)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes("@")) { setError("Invalid email address."); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5087/api/Auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) { setStep(2); setSuccess("OTP sent to your email."); } 
      else { setError(data.message || "Failed to send OTP."); }
    } catch (err) { setError("Server connection failed."); } 
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5087/api/Auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      if (res.ok) { setStep(3); setSuccess("Email verified successfully."); } 
      else { setError("Invalid OTP."); }
    } catch (err) { setError("Verification failed."); } 
    finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        fullName: formData.fullName, email: formData.email, password: formData.password,
        role: "Citizen", department: "", gender: formData.gender, address: formData.address,
        state: formData.state, district: formData.district, pincode: formData.pincode
      };
      const res = await fetch("http://localhost:5087/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account Created! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else { setError(data.message || "Registration failed."); }
    } catch (err) { setError("Server error."); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* --- LEFT SIDE: BRANDING --- */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 border-r border-slate-800">
        
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-5" 
             style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
        </div>

        <div className="relative z-10 mt-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 backdrop-blur-md">
                    <UserPlus className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="font-semibold text-lg tracking-wide text-white">GMS REGISTRATION</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight text-white mb-6">
                Create Your <br/> <span className="text-emerald-500">Citizen Account</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Join the official platform to report grievances, track resolutions, and ensure your voice is heard by the administration.
            </p>
        </div>

        {/* Steps Indicator */}
        <div className="relative z-10 space-y-6">
            <StepItem num={1} label="Identity" active={step >= 1} current={step === 1} />
            <StepItem num={2} label="Verification" active={step >= 2} current={step === 2} />
            <StepItem num={3} label="Location" active={step >= 3} current={step === 3} />
        </div>

        <div className="relative z-10 text-[10px] text-slate-600 uppercase tracking-widest">
            Secure Enrollment • Official Portal
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-right duration-500">
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Sign Up</h2>
                <p className="mt-1 text-slate-500 text-sm">Please follow the steps to register.</p>
            </div>

            {/* ALERTS */}
            {error && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
            {success && <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4"/>{success}</div>}

            {/* STEP 1 */}
            {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                <input name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="John Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="citizen@email.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="••••••" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="••••••" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 mt-4">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Continue"} <ArrowRight className="w-4 h-4"/>
                    </button>
                </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="text-center bg-slate-50 border border-slate-100 rounded-lg p-6">
                        <Mail className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">Verification code sent to</p>
                        <p className="font-bold text-slate-900 text-sm">{formData.email}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 text-center">Enter 6-Digit Code</label>
                        <input name="otp" maxLength={6} required value={formData.otp} onChange={handleChange} className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="------" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStep(1)} className="px-5 py-3 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">Back</button>
                        <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md flex justify-center items-center gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Verify Email"}
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm">
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Pincode</label>
                            <input name="pincode" maxLength={6} value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" placeholder="000000" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">State</label>
                            <div className="relative">
                                <Navigation className="absolute left-3 top-3.5 w-4 h-4 text-slate-400"/>
                                <select name="state" value={formData.state} onChange={handleChange} className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm appearance-none">
                                    <option value="">State</option>
                                    {Object.keys(INDIA_LOCATIONS).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">District</label>
                            <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.state} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm disabled:opacity-50">
                                <option value="">District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Permanent Address</label>
                        <textarea name="address" rows={3} required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm resize-none" placeholder="House No, Street, Landmark..."></textarea>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStep(2)} className="px-5 py-3 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">Back</button>
                        <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md flex justify-center items-center gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Complete Registration"}
                        </button>
                    </div>
                </form>
            )}

            <div className="text-center pt-6 border-t border-slate-100 mt-6">
                <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3"/> Already have an account? Login
                </Link>
            </div>

        </div>
      </div>
    </div>
  );
}

// Helper for Steps
const StepItem = ({ num, label, active, current }: { num: number, label: string, active: boolean, current: boolean }) => (
    <div className={`flex items-center gap-4 transition-all duration-300 ${active ? "opacity-100" : "opacity-40"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all 
            ${current ? "bg-white text-slate-900 border-white scale-110 shadow-lg" : 
              active ? "bg-emerald-500 text-white border-emerald-500" : 
              "bg-transparent text-slate-500 border-slate-700"}`}>
            {active && !current ? <CheckCircle className="w-5 h-5"/> : num}
        </div>
        <span className={`font-medium ${current ? "text-white" : "text-slate-400"}`}>{label}</span>
    </div>
);