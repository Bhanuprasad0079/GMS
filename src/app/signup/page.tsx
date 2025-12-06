"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Building
} from "lucide-react";

export default function SignUpPage() {
  // Mock router for preview environment
  const router = { push: (path: string) => console.log("Navigating to:", path) };
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    contact: "", 
    password: "",
    confirmPassword: "",
    otp: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      console.log("Sending OTP to", formData.contact);
      setStep(2);
    } else if (step === 2) {
      if (formData.otp.length >= 4) {
        setStep(3);
      } else {
        alert("Please enter a valid OTP");
      }
    } else {
      console.log("Submitting Data:", formData);
      setSuccessMessage("Registration Successful!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-lg w-full space-y-8 bg-white border border-gray-200 p-8 rounded-lg shadow-xl">
        
        {/* Success Banner */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-3 animate-pulse">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Header */}
        <div>
          <h2 className="mt-2 text-left text-3xl font-extrabold text-gray-900 tracking-tight">
            Citizen Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join the platform to lodge and track grievances.</p>
          
          {/* Progress Bar */}
          <div className="flex items-center mt-6 mb-8 gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    step >= num ? "bg-blue-600" : "bg-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
             <span className={step >= 1 ? "text-blue-600" : ""}>Credentials</span>
             <span className={step >= 2 ? "text-blue-600" : ""}>Verify</span>
             <span className={step >= 3 ? "text-blue-600" : ""}>Details</span>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleNext}>
          
          {/* STEP 1: Credentials */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400 w-4 h-4" />
                  </div>
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 w-4 h-4" />
                  </div>
                  <input
                    name="contact"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 w-4 h-4" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <p className="text-gray-600 text-sm mb-2">
                  One Time Password (OTP) sent to:
                </p>
                <p className="font-mono font-bold text-gray-900 text-lg tracking-wide">{formData.contact}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-Digit Code</label>
                <input
                  name="otp"
                  type="text"
                  maxLength={6}
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-3xl font-mono tracking-[0.5em] text-center rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4"
                  placeholder="------"
                />
              </div>
              
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-semibold underline">
                Resend OTP
              </button>
            </div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <div className="relative">
                   <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="text-gray-400 w-4 h-4" />
                  </div>
                  <textarea
                    name="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
                    placeholder="House No, Street Name, Locality"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="text-gray-400 w-4 h-4" />
                     </div>
                     <select
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 appearance-none"
                     >
                        <option value="">Select State</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                     </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5"
                  >
                    <option value="">Select District</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  name="pincode"
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
                  placeholder="Enter 6 digit Pincode"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-1/3 flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-bold rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </button>
            )}
            
            <button
              type="submit"
              className={`flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white shadow-md hover:shadow-lg transition-all
              ${step === 3 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {step === 1 ? "Send OTP" : step === 2 ? "Verify & Proceed" : "Complete Registration"}
              {step < 3 ? <ArrowRight className="ml-2 w-4 h-4" /> : <CheckCircle className="ml-2 w-4 h-4" />}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Sign In
              </a>
            </p>
          </div>

        </form>
      </div>
    </main>
  );
}