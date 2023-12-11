import './src/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: false,
    typedRoutes: true,
  },
};

export default nextConfig;
