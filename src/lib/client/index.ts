import { env } from '@/lib/config';

export const getEndpoint = (endpoint: string) => {
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
    throw new Error(response.error);
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
    throw new Error(response.error);
  }

  return response;
};

export const patchData = async (
  endpoint: string,
  data: any,
  errorMessage: string = 'Error updating data',
) => {
  const response = await fetch(getEndpoint(endpoint), {
    method: 'PATCH',
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
    throw new Error(response.error);
  }

  return response;
};

export const deleteData = async (
  endpoint: string,
  id: string,
  errorMessage: string = 'Error deleting data',
) => {
  const response = await fetch(getEndpoint(endpoint), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(
        `${errorMessage} (status: ${err.status}): ${err.message}`,
      );
    });

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
};
