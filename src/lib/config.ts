export const env = {
  APP_URL: process.env.APP_URL!,
  MONGODB_URI: process.env.MONGODB_URI!,

  AUTH_SECRET: process.env.AUTH_SECRET!,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,

  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL!,
  SHEET_ID: process.env.SHEET_ID!,
  SHEET_NAME: process.env.SHEET_NAME!,

  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!,

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
};
