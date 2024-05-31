/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
