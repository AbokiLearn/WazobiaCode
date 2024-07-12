import { env } from '@/lib/config';

const getEndpoint = (endpoint: string) => {
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }
  return `${env.APP_URL}/api${endpoint}`;
};

export const getData = async (
  endpoint: string,
  cache: RequestCache,
  errorMessage: string = 'Error fetching data',
) => {
  const response = await fetch(getEndpoint(endpoint), {
    cache,
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(
        `${errorMessage} (status: ${err.status}): ${err.message}`,
      );
    });
  if (response.error) {
    throw new Error(
      `${errorMessage} (status: ${response.status}): ${response.error}`,
    );
  }
  return response;
};

export const postData = async (
  endpoint: string,
  data: any,
  errorMessage: string = 'Error uploading data',
) => {
  const response = await fetch(getEndpoint(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(
        `${errorMessage} (status: ${err.status}): ${err.message}`,
      );
    });

  if (response.error) {
    throw new Error(
      `${errorMessage} (status: ${response.status}): ${response.error}`,
    );
  }

  return response;
};
