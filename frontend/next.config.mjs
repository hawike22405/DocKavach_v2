/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ["localhost:3000", "127.0.0.1:3000"]
  }
};
export default nextConfig;
