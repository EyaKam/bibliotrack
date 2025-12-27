import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      { protocol: "https", hostname: "placeholder.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "ucarecdn.com"},
    ],
  },  
  typescript : {
    ignoreBuildErrors : true,
  },
  eslint : {
    ignoreDuringBuilds : true,
  },
  

};

export default nextConfig;
