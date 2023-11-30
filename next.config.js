/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn2.gstatic.com",
      "www.google.com",
      "dynamic-media-cdn.tripadvisor.com",
      "cdn.tgdd.vn",
    ],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

module.exports = nextConfig;
