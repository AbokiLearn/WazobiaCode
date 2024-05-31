export const env = {
  APP_URL: process.env.APP_URL!,
  MONGODB_URI: process.env.MONGODB_URI!,

  SHEET_ID: process.env.SHEET_ID!,
  SHEET_NAME: process.env.SHEET_NAME!,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL!,
};
