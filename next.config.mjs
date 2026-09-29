/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Stops the App Router from refetching dynamic pages (cookies() in
    // the root layout) on every Link that points at the current URL.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
