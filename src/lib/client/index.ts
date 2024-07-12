import { env } from '@/lib/config';

const getEndpoint = (endpoint: string) => {
  return `${env.APP_URL}/api/${endpoint}`;
};

export const getData = async (
  endpoint: string,
  cache: RequestCache,
  errorMessage: string,
) => {
  const data = await fetch(getEndpoint(endpoint), {
    cache,
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(errorMessage);
    });
  return data;
};
