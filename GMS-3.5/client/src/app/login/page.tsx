// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { 
//   Mail, 
//   Eye, 
//   EyeOff, 
//   Lock, 
//   RefreshCw, 
//   ShieldCheck,
//   CheckCircle2,
//   ArrowRight
// } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [captcha, setCaptcha] = useState("");
  
//   const [formData, setFormData] = useState({
//     email: "", 
//     password: "",
//     captchaInput: ""
//   });

//   const generateCaptcha = () => {
//     const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let result = "";
//     for (let i = 0; i < 6; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setCaptcha(result);
//   };

//   useEffect(() => {
//     generateCaptcha();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (formData.captchaInput !== captcha) {
//       alert("Invalid Security Code.");
//       generateCaptcha(); 
//       setFormData(prev => ({...prev, captchaInput: ""})); 
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:5087/api/Auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const uiData = {
//             fullName: data.fullName,
//             role: data.role,
//             userId: data.userId
//         };
//         localStorage.setItem("user_info", JSON.stringify(uiData));
//         window.dispatchEvent(new Event("storage"));

//         if (data.role === "Admin" || data.role === "SuperAdmin") {
//             router.push("/admin/dashboard");
//         } else if (data.role === "Worker") {
//             router.push("/worker/dashboard");
//         } else {
//             router.push("/dashboard");
//         }
//       } else {
//         alert(data.message || "Login failed");
//         generateCaptcha(); 
//       }
//     } catch (error) {
//       alert("Connection failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      
//       {/* --- LEFT COLUMN: PROFESSIONAL BRANDING (Desktop) --- */}
//       <div className="hidden lg:flex w-5/12 bg-slate-900 text-white flex-col justify-between p-12 relative border-r border-slate-800">
         
//          {/* Clean Content */}
//          <div className="relative z-10 mt-10">
//             <div className="flex items-center gap-3 mb-10">
//                 <div className="bg-white/5 p-2 rounded-lg border border-white/10">
//                     <ShieldCheck className="w-6 h-6 text-emerald-400" />
//                 </div>
//                 <span className="font-semibold text-lg tracking-wide text-slate-200">GMS PORTAL</span>
//             </div>
            
//             <div className="space-y-6">
//                 <h1 className="text-4xl font-bold leading-tight text-white">
//                     Public Grievance <br/> Redressal System
//                 </h1>
//                 <p className="text-slate-400 text-base max-w-sm leading-relaxed">
//                     The official platform for filing complaints and tracking resolutions. Authenticated access ensures data privacy and accountability.
//                 </p>
//             </div>
//          </div>

//          {/* Trust Indicators - Minimalist */}
//          <div className="relative z-10 flex flex-col gap-4 mb-10">
//             <div className="flex items-center gap-3">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
//                 <span className="text-sm text-slate-300">End-to-End Encrypted</span>
//             </div>
//             <div className="flex items-center gap-3">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
//                 <span className="text-sm text-slate-300">Real-time Status Tracking</span>
//             </div>
//             <div className="flex items-center gap-3">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
//                 <span className="text-sm text-slate-300">Official Government Portal</span>
//             </div>
//          </div>

//          <div className="relative z-10 text-[10px] text-slate-600 uppercase tracking-widest">
//             Restricted Access • Authorized Personnel & Citizens Only
//          </div>
//       </div>

//       {/* --- RIGHT COLUMN: CLEAN FORM --- */}
//       <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
//         <div className="w-full max-w-[400px] animate-in fade-in duration-500">
            
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
//                 <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Please enter your credentials to proceed.</p>
//             </div>

//             <form className="space-y-6" onSubmit={handleLogin}>
                
//                 {/* Email Input */}
//                 <div>
//                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Mail className="h-5 w-5 text-slate-400" />
//                         </div>
//                         <input
//                             name="email"
//                             type="email"
//                             required
//                             className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-sm text-sm"
//                             placeholder="name@example.com"
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                     <div className="flex justify-between mb-2">
//                         <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
//                         <Link href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline">Forgot password?</Link>
//                     </div>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Lock className="h-5 w-5 text-slate-400" />
//                         </div>
//                         <input
//                             name="password"
//                             type={showPassword ? "text" : "password"}
//                             required
//                             className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-sm text-sm"
//                             placeholder="••••••••"
//                             onChange={handleChange}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
//                         >
//                             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Professional Captcha */}
//                 <div className="grid grid-cols-3 gap-3">
//                     <div className="col-span-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between px-3 select-none">
//                         <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300 tracking-widest">{captcha}</span>
//                         <button type="button" onClick={generateCaptcha} className="text-slate-400 hover:text-emerald-600 transition-colors">
//                             <RefreshCw className="w-4 h-4"/>
//                         </button>
//                     </div>
//                     <input
//                         name="captchaInput"
//                         type="text"
//                         required
//                         placeholder="Security Code"
//                         className="col-span-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none text-sm text-center uppercase tracking-widest text-slate-900 dark:text-white"
//                         onChange={handleChange}
//                         value={formData.captchaInput}
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full flex justify-center items-center py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
//                 >
//                     {isLoading ? "Authenticating..." : "Access Account"}
//                     {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
//                 </button>

//                 <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                         Don't have an account? <Link href="/signup" className="font-bold text-slate-900 dark:text-white hover:underline">Register Now</Link>
//                     </p>
                    
//                     <div className="mt-8 flex justify-center items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                         <Link href="/login/workerloginpage" className="hover:text-emerald-600 transition-colors">Staff Login</Link>
//                         <span>•</span>
//                         <Link href="/login/adminloginpage" className="hover:text-emerald-600 transition-colors">Admin Console</Link>
//                     </div>
//                 </div>
//             </form>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Eye, 
  EyeOff, 
  Lock, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { getCsrfToken } from "@/utils/csrf"; // <--- 1. IMPORT CSRF HELPER

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  
  const [formData, setFormData] = useState({
    email: "", 
    password: "",
    captchaInput: ""
  });

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.captchaInput !== captcha) {
      alert("Invalid Security Code.");
      generateCaptcha(); 
      setFormData(prev => ({...prev, captchaInput: ""})); 
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5087/api/Auth/login", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken() // <--- 2. ADD CSRF HEADER
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const uiData = {
            fullName: data.fullName,
            role: data.role,
            userId: data.userId
        };
        localStorage.setItem("user_info", JSON.stringify(uiData));
        window.dispatchEvent(new Event("storage"));

        if (data.role === "Admin" || data.role === "SuperAdmin") {
            router.push("/admin"); // Adjusted path based on standard admin routes
        } else if (data.role === "Worker") {
            router.push("/worker"); // Adjusted path based on standard worker routes
        } else {
            router.push("/dashboard");
        }
      } else {
        alert(data.message || "Login failed");
        generateCaptcha(); 
      }
    } catch (error) {
      alert("Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* --- LEFT COLUMN: PROFESSIONAL BRANDING (Desktop) --- */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 text-white flex-col justify-between p-12 relative border-r border-slate-800">
         
         {/* Clean Content */}
         <div className="relative z-10 mt-10">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="font-semibold text-lg tracking-wide text-slate-200">GMS PORTAL</span>
            </div>
            
            <div className="space-y-6">
                <h1 className="text-4xl font-bold leading-tight text-white">
                    Public Grievance <br/> Redressal System
                </h1>
                <p className="text-slate-400 text-base max-w-sm leading-relaxed">
                    The official platform for filing complaints and tracking resolutions. Authenticated access ensures data privacy and accountability.
                </p>
            </div>
         </div>

         {/* Trust Indicators - Minimalist */}
         <div className="relative z-10 flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-300">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-300">Real-time Status Tracking</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-300">Official Government Portal</span>
            </div>
         </div>

         <div className="relative z-10 text-[10px] text-slate-600 uppercase tracking-widest">
            Restricted Access • Authorized Personnel & Citizens Only
         </div>
      </div>

      {/* --- RIGHT COLUMN: CLEAN FORM --- */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-[400px] animate-in fade-in duration-500">
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Please enter your credentials to proceed.</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
                
                {/* Email Input */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-sm text-sm"
                            placeholder="name@example.com"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <Link href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-sm text-sm"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Professional Captcha */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between px-3 select-none">
                        <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300 tracking-widest">{captcha}</span>
                        <button type="button" onClick={generateCaptcha} className="text-slate-400 hover:text-emerald-600 transition-colors">
                            <RefreshCw className="w-4 h-4"/>
                        </button>
                    </div>
                    <input
                        name="captchaInput"
                        type="text"
                        required
                        placeholder="Security Code"
                        className="col-span-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none text-sm text-center uppercase tracking-widest text-slate-900 dark:text-white"
                        onChange={handleChange}
                        value={formData.captchaInput}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                    {isLoading ? "Authenticating..." : "Access Account"}
                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </button>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account? <Link href="/signup" className="font-bold text-slate-900 dark:text-white hover:underline">Register Now</Link>
                    </p>
                    
                    <div className="mt-8 flex justify-center items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <Link href="/login/workerloginpage" className="hover:text-emerald-600 transition-colors">Staff Login</Link>
                        <span>•</span>
                        <Link href="/login/adminloginpage" className="hover:text-emerald-600 transition-colors">Admin Console</Link>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
