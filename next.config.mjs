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
          hostname: "your-project-id.supabase.co", // later when you use Supabase Storage
        },
      ],
    },
  };
  
  export default nextConfig;
  