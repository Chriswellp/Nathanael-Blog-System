import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'chute-platonic-tall.ngrok-free.dev',
    '192.168.1.232',
    '192.168.1.232:3000',
    'localhost:3000',
  ],
};

export default nextConfig;