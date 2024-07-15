interface APIResponseData {
  data?: any;
  message?: string | null;
  error?: string | null;
}

export const APIResponse = ({
  data = null,
  message = null,
  error = null,
  status = 200,
  headers = {},
}: APIResponseData & {
  status?: number;
  headers?: HeadersInit;
}): Response => {
  return Response.json({ data, message, error }, { status, headers });
};

export const APIErrorHandler = (error: any, status = 500): Response => {
  console.error(error);
  return APIResponse({
    error: error.message || 'An unexpected error occured',
    status,
  });
};
