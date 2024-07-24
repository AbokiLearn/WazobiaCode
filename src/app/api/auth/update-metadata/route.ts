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

  // TODO: assign users to recitation groups if they don't have one

  try {
    // Attempt to update or create user metadata in MongoDB
    const userMetadata = await UserMetadata.findOneAndUpdate(
      { sub: session?.user!.sub },
      { first_name, last_name, phone_number, email: session?.user!.email },
      { upsert: true, new: true },
    );
  } catch (error: any) {
    // Check if the error is a MongoServerError due to duplicate phone number
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return APIResponse({
        error: 'Phone number already in use by another user',
        status: 409,
      });
    } else {
      throw error; // Rethrow the error if it's not a duplicate phone number error
    }
  }

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
