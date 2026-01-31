"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  KeyRound,
  ShieldCheck,
  Loader2
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Set New Password
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "", 
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on type
  };

  // STEP 1: SEND OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:5087/api/Auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        setSuccessMessage("OTP sent securely to your email.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.message || "Failed to send OTP. Check email.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5087/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password Reset Successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Reset failed. Invalid OTP?");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      
      {/* Left Column: Branding */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 animate-in slide-in-from-left duration-700">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide">GRIEVANCE<span className="text-emerald-400">PORTAL</span></span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight animate-in slide-in-from-left duration-700 delay-100">
            Account Recovery <br/> Center
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed animate-in slide-in-from-left duration-700 delay-200">
            Securely restore access to your account. We use two-factor verification to ensure your identity is protected during this process.
          </p>
        </div>
        <div className="text-xs text-slate-600 font-mono">Secure Connection • TLS 1.3</div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4">
              <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Password Recovery</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h2>
            <p className="text-slate-500 dark:text-slate-400">
              {step === 1 ? "Enter your email to receive a verification code." : "Enter the code sent to your email and set a new password."}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" /> {successMessage}
            </div>
          )}

          {step === 1 ? (
            // --- STEP 1 FORM ---
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Registered Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin"/> : <>Send Secure Code <ArrowRight className="w-4 h-4"/></>}
              </button>
            </form>
          ) : (
            // --- STEP 2 FORM ---
            <form onSubmit={handleResetPassword} className="space-y-5 animate-in slide-in-from-right fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Verification Code (OTP)</label>
                <input
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full py-3.5 text-center text-2xl font-mono tracking-[0.5em] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="------"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="New secure password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-emerald-500">
                      {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full pl-10 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin"/> : "Reset Password"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}