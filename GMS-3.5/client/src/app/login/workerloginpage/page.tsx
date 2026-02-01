// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { 
//   User, Eye, EyeOff, Lock, LogIn, RefreshCw, HardHat, ArrowLeft, 
//   ClipboardCheck, Loader2
// } from "lucide-react";

// export default function WorkerLoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [captcha, setCaptcha] = useState("");
  
//   const [formData, setFormData] = useState({
//     username: "", 
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

//   useEffect(() => { generateCaptcha(); }, []);

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
//           email: formData.username,
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data.role !== "Worker") {
//             alert("Access Denied: Field Staff Account Required.");
//             setIsLoading(false);
//             generateCaptcha();
//             return;
//         }
//         const uiData = { fullName: data.fullName, role: data.role, userId: data.userId };
//         localStorage.setItem("user_info", JSON.stringify(uiData));
//         window.dispatchEvent(new Event("storage"));
//         router.push("/worker/dashboard");
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
//     <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
//       {/* --- LEFT SIDE: BRANDING (Consistent Split Layout) --- */}
//       <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 border-r border-slate-800">
        
//         {/* Background Texture - Professional Grid */}
//         <div className="absolute inset-0 opacity-5" 
//              style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
//         </div>

//         <div className="relative z-10 mt-8">
//             <div className="flex items-center gap-3 mb-10">
//                 <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 backdrop-blur-md">
//                     <HardHat className="w-6 h-6 text-amber-500" />
//                 </div>
//                 <span className="font-semibold text-lg tracking-wide text-white">GMS STAFF</span>
//             </div>
            
//             <h1 className="text-4xl font-bold leading-tight text-white mb-6">
//                 Field Operations <br/> <span className="text-amber-500">Portal</span>
//             </h1>
//             <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
//                 Secure access for field technicians and maintenance personnel. Manage assignments, update ticket statuses, and report resolutions in real-time.
//             </p>
//         </div>

//         {/* Feature List */}
//         <div className="relative z-10 space-y-5 mb-8">
//             <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
//                     <ClipboardCheck className="w-4 h-4 text-amber-500" />
//                 </div>
//                 <div>
//                     <p className="text-sm font-bold text-white">Task Management</p>
//                     <p className="text-xs text-slate-500">View and update assigned tickets</p>
//                 </div>
//             </div>
//         </div>

//         <div className="relative z-10 text-[10px] text-slate-600 uppercase tracking-widest">
//             Authorized Personnel Only • ID Required
//         </div>
//       </div>

//       {/* --- RIGHT SIDE: FORM --- */}
//       <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white">
//         <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right duration-500">
            
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-slate-900">Staff Login</h2>
//                 <p className="mt-1 text-slate-500 text-sm">Please authenticate with your worker credentials.</p>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-6">
                
//                 {/* Email Input */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Worker Email</label>
//                     <div className="relative">
//                         <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
//                         <input 
//                             name="username" 
//                             type="text" 
//                             required 
//                             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
//                             placeholder="worker@dept.gov"
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
//                     <div className="relative">
//                         <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
//                         <input 
//                             name="password" 
//                             type={showPassword ? "text" : "password"} 
//                             required 
//                             className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
//                             placeholder="••••••••"
//                             onChange={handleChange}
//                         />
//                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-amber-600 transition-colors">
//                             {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Captcha */}
//                 <div className="grid grid-cols-3 gap-3">
//                     <div className="col-span-1 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between px-3 select-none">
//                         <span className="font-mono text-lg font-bold text-slate-700 tracking-widest">{captcha}</span>
//                         <button type="button" onClick={generateCaptcha} className="text-slate-400 hover:text-amber-600 transition-colors">
//                             <RefreshCw className="w-4 h-4"/>
//                         </button>
//                     </div>
//                     <input
//                         name="captchaInput"
//                         type="text"
//                         required
//                         placeholder="SECURITY CODE"
//                         className="col-span-2 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm text-center uppercase tracking-widest text-slate-900 font-semibold placeholder:font-normal"
//                         onChange={handleChange}
//                         value={formData.captchaInput}
//                     />
//                 </div>

//                 {/* Submit Button */}
//                 <button 
//                     type="submit" 
//                     disabled={isLoading}
//                     className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 group"
//                 >
//                     {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//                     {isLoading ? "Verifying..." : "Access Dashboard"}
//                     {!isLoading && <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>}
//                 </button>

//                 {/* Footer Links */}
//                 <div className="text-center pt-6 border-t border-slate-100 mt-6">
//                     <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wide">
//                         <ArrowLeft className="w-3 h-3"/> Return to Main Portal
//                     </Link>
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
  User, Eye, EyeOff, Lock, LogIn, RefreshCw, HardHat, ArrowLeft, 
  ClipboardCheck, Loader2
} from "lucide-react";
import { getCsrfToken } from "@/utils/csrf"; // <--- 1. IMPORT CSRF HELPER

export default function WorkerLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  
  const [formData, setFormData] = useState({
    username: "", 
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

  useEffect(() => { generateCaptcha(); }, []);

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
          email: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role !== "Worker") {
            alert("Access Denied: Field Staff Account Required.");
            setIsLoading(false);
            generateCaptcha();
            return;
        }
        const uiData = { fullName: data.fullName, role: data.role, userId: data.userId };
        localStorage.setItem("user_info", JSON.stringify(uiData));
        window.dispatchEvent(new Event("storage"));
        router.push("/worker/dashboard"); // Ensure this path matches your folder structure
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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* --- LEFT SIDE: BRANDING (Consistent Split Layout) --- */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 border-r border-slate-800">
        
        {/* Background Texture - Professional Grid */}
        <div className="absolute inset-0 opacity-5" 
             style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
        </div>

        <div className="relative z-10 mt-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 backdrop-blur-md">
                    <HardHat className="w-6 h-6 text-amber-500" />
                </div>
                <span className="font-semibold text-lg tracking-wide text-white">GMS STAFF</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight text-white mb-6">
                Field Operations <br/> <span className="text-amber-500">Portal</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Secure access for field technicians and maintenance personnel. Manage assignments, update ticket statuses, and report resolutions in real-time.
            </p>
        </div>

        {/* Feature List */}
        <div className="relative z-10 space-y-5 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <ClipboardCheck className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Task Management</p>
                    <p className="text-xs text-slate-500">View and update assigned tickets</p>
                </div>
            </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-600 uppercase tracking-widest">
            Authorized Personnel Only • ID Required
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right duration-500">
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Staff Login</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Please authenticate with your worker credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Worker Email</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                        <input 
                            name="username" 
                            type="text" 
                            required 
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder-slate-400"
                            placeholder="worker@dept.gov"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                        <input 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder-slate-400"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-amber-600 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>

                {/* Captcha */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between px-3 select-none">
                        <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300 tracking-widest">{captcha}</span>
                        <button type="button" onClick={generateCaptcha} className="text-slate-400 hover:text-amber-600 transition-colors">
                            <RefreshCw className="w-4 h-4"/>
                        </button>
                    </div>
                    <input
                        name="captchaInput"
                        type="text"
                        required
                        placeholder="SECURITY CODE"
                        className="col-span-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm text-center uppercase tracking-widest text-slate-900 dark:text-white font-semibold placeholder:font-normal placeholder-slate-400"
                        onChange={handleChange}
                        value={formData.captchaInput}
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 group"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Verifying..." : "Access Dashboard"}
                    {!isLoading && <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>}
                </button>

                {/* Footer Links */}
                <div className="text-center pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors uppercase tracking-wide">
                        <ArrowLeft className="w-3 h-3"/> Return to Main Portal
                    </Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}