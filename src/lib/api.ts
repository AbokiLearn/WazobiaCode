export const APIResponse = ({
  data = null,
  message = 'Form submitted successfully',
  error = null,
  status = 200,
}: {
  data?: any;
  message?: string | null;
  error?: string | null;
  status?: number;
}) => {
  return Response.json({ data, message, error, status });
};

export const APIErrorHandler = (error: any) => {
  console.error(error);
  return APIResponse({
    error: error.message,
    status: 500,
  });
};
