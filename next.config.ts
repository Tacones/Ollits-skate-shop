import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.ossoskateshop.com.br' },
      { protocol: 'https', hostname: 'd26lpennugtm8s.cloudfront.net' },
      { protocol: 'https', hostname: 'dcdn-us.mitiendanube.com' },
    ],
  },
};

export default nextConfig;
