/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "twrgiobaconoezsgstwz.supabase.co", // Supabase Storage
      },
      {
        protocol: "https",
        hostname: "drive.google.com", // Google Drive direct links
      },
    ],
  },
};

export default nextConfig;
