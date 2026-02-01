// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;

const nextConfig = {
  // 👇 REMOVED the 'eslint' block from here because it causes the error.

  // Keep this to ignore TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;