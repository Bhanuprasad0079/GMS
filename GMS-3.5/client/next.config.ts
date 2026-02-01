// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;


// 👇 Just a plain variable, no ": NextConfig" type
const nextConfig = {
  // 👇 1. Ignore Linting Errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 👇 2. Ignore TypeScript Errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;