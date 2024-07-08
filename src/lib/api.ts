import { env } from '@/lib/config';

const APP_URL = env.APP_URL;

export const getEndpoint = (endpoint: string) => {
  return `${APP_URL}/api/${endpoint}`;
};
