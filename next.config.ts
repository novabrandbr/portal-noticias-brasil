import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.globo.com" },
      { protocol: "https", hostname: "**.uol.com.br" },
      { protocol: "https", hostname: "**.r7.com" },
      { protocol: "https", hostname: "**.cnnbrasil.com.br" },
      { protocol: "https", hostname: "**.metropoles.com" },
      { protocol: "https", hostname: "**.infomoney.com.br" },
    ],
  },
}

export default nextConfig
