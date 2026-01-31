import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Enable 'class' based dark mode
  darkMode: 'class', 
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}", // Ensure your component folder is here
  ],
  theme: {
    extend: {
      colors: {
      brand: {
        50: '#f0f9ff', // Light Blue Background
        100: '#e0f2fe',
        600: '#0284c7', // Primary Action Blue
        800: '#075985', // Dark Header Blue
        900: '#0c4a6e', // Deep Navy (Footer/Sidebar)
      },
      accent: {
        500: '#10b981', // Success Green (Buttons)
        600: '#059669', // Hover Green
      }
    }
    },
  },
  plugins: [],
};
export default config;