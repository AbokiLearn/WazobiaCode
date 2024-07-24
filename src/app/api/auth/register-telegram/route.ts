import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { UserMetadata } from '@/models';
import { env } from '@/lib/config';

export async function POST(request: Request) {
  const apiKey = request.headers.get('X-API-Key');

  if (apiKey !== env.TELEGRAM_BOT_API_KEY) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  try {
    await connectMongoDB();

    const { phone_number, telegram_user_id } = await request.json();

    // Validate input
    if (!phone_number || !telegram_user_id) {
      return APIResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    // Find and update the user metadata
    const updatedUser = await UserMetadata.findOneAndUpdate(
      { phone_number },
      { telegram_user_id },
      { new: true },
    );

    if (!updatedUser) {
      return APIResponse({
        error: 'User not found',
        status: 404,
      });
    }

    // TODO: trigger <telegram-server>/send-invite to invite user to their recitation group

    return APIResponse({
      message: `Your telegram account has been successfully linked to your WazobiaCode account (${updatedUser.email}).`,
      status: 200,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
