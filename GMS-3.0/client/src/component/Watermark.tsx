"use client";

import { useEffect } from "react";

export default function Watermark() {
  useEffect(() => {
    console.log(
      "%c GMS System \n%c Developed by Bhanu Prasad Khuntia ",
      "color: #10b981; font-size: 25px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
      "background: #0f172a; color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 14px;"
    );
    console.log("Looking at the code? Connect with me at Bhanuprasad0079 for collaborations! ");
  }, []);

  return null; 
}