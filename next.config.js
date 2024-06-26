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
  env: {
    APP_URL: process.env.APP_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    SHEET_ID: process.env.SHEET_ID,
    SHEET_NAME: process.env.SHEET_NAME,
  },
};

module.exports = nextConfig;
