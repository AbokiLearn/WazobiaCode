import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import { getManagementClient } from '@/lib/auth';
import connectMongoDB from '@/lib/db/connect';
import { UserMetadata } from '@/models';

export const POST = withApiAuthRequired(async function handler(
  request: Request,
) {
  await connectMongoDB();
  const session = await getSession();

  const { first_name, last_name, phone_number } = await request.json();

  if (
    typeof first_name !== 'string' ||
    typeof last_name !== 'string' ||
    typeof phone_number !== 'string'
  ) {
    return APIResponse({
      error: 'Invalid request',
      status: 400,
    });
  }

  const client = await getManagementClient();

  try {
    // Update Auth0 user metadata
    await client.users.update(
      { id: session?.user!.sub },
      {
        user_metadata: {
          first_name,
          last_name,
          phone_number,
        },
      },
    );

    // Update or create user metadata in MongoDB
    await UserMetadata.findOneAndUpdate(
      { sub: session?.user!.sub },
      { first_name, last_name, phone_number },
      { upsert: true, new: true },
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
