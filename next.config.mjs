/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // External packages that can be used by server components
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Remove serverExternalPackages as it's deprecated
  },
  // Add transpilePackages for Clerk if needed
  transpilePackages: ['@clerk/nextjs']
};

export default nextConfig; 