/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com"],
    },
    // Add this configuration
    output: 'standalone',
  };
  
  module.exports = nextConfig;