import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import { getManagementClient } from '@/lib/auth';

export const POST = withApiAuthRequired(async function handler(
  request: Request,
) {
  const session = await getSession();

  const { firstName, lastName, phoneNumber } = await request.json();
  console.log(firstName, lastName, phoneNumber);

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof phoneNumber !== 'string'
  ) {
    return APIResponse({
      error: 'Invalid request',
      status: 400,
    });
  }

  const client = await getManagementClient();

  try {
    await client.users.update(
      { id: session?.user!.sub },
      {
        user_metadata: {
          firstName,
          lastName,
          phoneNumber,
        },
      },
    );

    return APIResponse({
      data: {
        redirectUrl: '/api/auth/silent?redirect=app',
      },
      message: 'Profile updated successfully',
      status: 200,
    });
  } catch (error: any) {
    return APIErrorHandler(error);
  }
});
