/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/404',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/404',
        permanent: false,
      },
      {
        source: '/signup',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
