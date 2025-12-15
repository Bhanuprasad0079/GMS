// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { User, Eye, EyeOff, KeyRound, LogIn, RefreshCw, Languages } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     username: "", // This maps to 'Contact' in backend
//     password: ""
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:5087/api/Auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contact: formData.username,
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Optional: Save user data to localStorage if needed
//         // localStorage.setItem("user", JSON.stringify(data));
//         alert("Welcome " + data.fullName);
//         router.push("/dashboard");
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Could not connect to server.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
//       <div className="max-w-md w-full space-y-8 bg-white border border-gray-200 p-8 rounded-lg shadow-xl">
        
//         {/* Header */}
//         <div>
//           <h2 className="mt-2 text-left text-3xl font-extrabold text-gray-900 tracking-tight border-b border-gray-200 pb-4">
//             User Login
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign in to access the Grievance Management System
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          
//           {/* Language Select */}
//           <div>
//             <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
//               Select Language
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Languages className="text-gray-400 w-4 h-4" />
//               </div>
//               <select
//                 id="language"
//                 name="language"
//                 className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 transition-colors"
//               >
//                 <option value="en">English</option>
//                 <option value="hi">Hindi</option>
//               </select>
//             </div>
//           </div>

//           {/* Username */}
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//               Mobile / Email
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User className="text-gray-400 w-4 h-4" />
//               </div>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400 transition-all"
//                 placeholder="Enter email or mobile"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <KeyRound className="text-gray-400 w-4 h-4" />
//               </div>
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400 transition-all"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//                 ) : (
//                   <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Captcha */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Security Code
//             </label>
//             <div className="flex gap-3 mb-2">
//               <div className="flex-1 bg-gray-200 text-gray-800 font-mono font-bold text-xl p-2 rounded-lg select-none text-center tracking-widest italic border border-gray-300" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')"}}>
//                  nQDKEr
//               </div>
//                <button type="button" className="p-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
//                  <RefreshCw className="w-4 h-4" />
//                </button>
//             </div>
//              <input
//                 id="captcha"
//                 name="captcha"
//                 type="text"
//                 required
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400 transition-all"
//                 placeholder="Type the code above"
//               />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white shadow-md hover:shadow-lg transition-all
//               ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`}
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//             {!isLoading && (
//               <span className="absolute right-4 flex items-center">
//                 <LogIn className="w-5 h-5 text-blue-200 group-hover:text-white" />
//               </span>
//             )}
//           </button>

//           {/* Footer Links */}
//           <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-6">
//             <div className="space-y-2">
//                  <Link href="#" className="block hover:text-blue-600 transition-colors">Forgot Password?</Link>
//                  <Link href="/signup" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">Create New Account</Link>
//             </div>
//              <div className="space-y-2 text-right">
//                  <Link href="#" className="block hover:text-blue-600 transition-colors">Forgot Username?</Link>
//                  <Link href="#" className="block hover:text-blue-600 transition-colors">Login via OTP</Link>
//             </div>
//           </div>
          
//           <div className="text-center mt-4">
//              <Link href="/login/adminloginpage" className="inline-block text-xs font-bold text-pink-600 hover:text-pink-700 tracking-wide uppercase transition-colors">
//                 — Admin Access —
//             </Link>
//           </div>

//         </form>
//       </div>
//     </main>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Eye, EyeOff, Lock, LogIn, RefreshCw, Languages } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  
  const [formData, setFormData] = useState({
    username: "", 
    password: "",
    captchaInput: ""
  });

  // Generate a random captcha code
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars like I, 1, 0, O
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  // Generate captcha on initial load
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Captcha
    if (formData.captchaInput !== captcha) {
      alert("Invalid Security Code. Please try again.");
      generateCaptcha(); // Refresh captcha on failure
      setFormData(prev => ({...prev, captchaInput: ""})); // Clear input
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5087/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        
        if (data.role === "Admin" || data.role === "SuperAdmin") {
            router.push("/admin/dashboard");
        } else if (data.role === "Worker") {
            router.push("/worker/dashboard");
        } else {
            router.push("/dashboard");
        }
      } else {
        alert(data.message || "Login failed");
        generateCaptcha(); // Refresh captcha on failed login
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Could not connect to server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md w-full space-y-8 bg-white border border-gray-200 p-8 rounded-lg shadow-xl">
        
        {/* Header */}
        <div>
          <h2 className="mt-2 text-left text-3xl font-extrabold text-gray-900 tracking-tight border-b border-gray-200 pb-4">
            User Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the Grievance Management System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          
          {/* Language Select */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Select Language
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Languages className="text-gray-400 w-4 h-4" />
              </div>
              <select
                id="language"
                name="language"
                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 transition-colors"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-gray-400 w-4 h-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400 transition-all"
                placeholder="Enter email or mobile"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Captcha - Now Reloadable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Code
            </label>
            <div className="flex gap-3 mb-2">
              <div className="flex-1 bg-gray-200 text-gray-800 font-mono font-bold text-xl p-2 rounded-lg select-none text-center tracking-widest italic border border-gray-300" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')"}}>
                 {captcha}
              </div>
               <button 
                 type="button" 
                 onClick={generateCaptcha}
                 className="p-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors active:scale-95"
                 title="Refresh Captcha"
               >
                 <RefreshCw className="w-4 h-4" />
               </button>
            </div>
             <input
                id="captchaInput"
                name="captchaInput"
                type="text"
                required
                value={formData.captchaInput}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400 transition-all"
                placeholder="Type the code above"
              />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white shadow-md hover:shadow-lg transition-all
              ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
            {!isLoading && (
              <span className="absolute right-4 flex items-center">
                <LogIn className="w-5 h-5 text-blue-200 group-hover:text-white" />
              </span>
            )}
          </button>

          {/* Footer Links */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-6">
            <div className="space-y-2">
                 <Link href="#" className="block hover:text-blue-600 transition-colors">Forgot Password?</Link>
                 <Link href="/signup" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">Create New Account</Link>
            </div>
             <div className="space-y-2 text-right">
                 <Link href="#" className="block hover:text-blue-600 transition-colors">Forgot Username?</Link>
                 <Link href="#" className="block hover:text-blue-600 transition-colors">Login via OTP</Link>
            </div>
          </div>
          
          <div className="text-center mt-4">
             <Link href="/login/adminloginpage" className="inline-block text-xs font-bold text-pink-600 hover:text-pink-700 tracking-wide uppercase transition-colors">
                — Admin Access —
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}