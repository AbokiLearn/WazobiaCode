import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const nextConfig = {
  async redirects() {
    return [
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
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-dev-public.s3.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
