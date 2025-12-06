"use client"
import React from "react";


import Link from "next/link"; 
import { usePathname } from "next/navigation";
import { link } from "fs";
export default function Navbar() {
  return (
<nav className="bg-indigo-600 p-4">

  <div className="flex justify-between items-center max-w-7xl mx-auto">
    
    <a href="/" className="text-white text-xl font-bold hover:text-indigo-200">
      Grievance Portal
    </a>
    
    <div className="flex space-x-6">
        <a href="/home" className="text-white hover:text-indigo-200 transition duration-150">
        Home
      </a>
      <a href="/about" className="text-white hover:text-indigo-200 transition duration-150">
        About
      </a>
      <a href="/signup" className="text-white hover:text-indigo-200 transition duration-150">
        Signup
      </a>

    </div>

    <a href="/login" className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition duration-150">
      Log In
    </a>
    
  </div>
</nav>
  );
}
// export default Navbar;
