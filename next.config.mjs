import './src/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    serverActions: false,
    typedRoutes: true,
  },
};

export default nextConfig;
