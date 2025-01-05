/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    serverActions: true, // serverActions を有効にする
  },
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    }
    return config
  },
  images: {
    domains: ['hurjmewylpobevoaoxbo.supabase.co'],
  },
};

export default nextConfig;
