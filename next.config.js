/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lastfm.freetls.fastly.net', 'i.scdn.co'], // Domains for Last.fm and Spotify images
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 