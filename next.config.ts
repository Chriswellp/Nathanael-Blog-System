import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'chute-platonic-tall.ngrok-free.dev',
    '192.168.1.232',
    '192.168.1.232:3000',
    'localhost:3000',
  ],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nathanael-blog-system-44yf.vercel.app',
          },
        ],
        destination: 'https://www.socialworkeracrossborders.co.uk/:path*',
        permanent: true, // Triggers HTTP 301 status code required by Search Console
      },
    ];
  },
};

export default nextConfig;