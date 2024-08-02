import axios from 'axios';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';

import { UserMetadata, Enrollment } from '@/models';
import { IRecitationGroup } from '@/types/db/recitation-group';

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

    const enrolledUser = await Enrollment.findOne({
      student_id: updatedUser.sub,
    }).populate({
      path: 'recitation_group_id',
      select: 'telegram_group_id',
    });
    if (!enrolledUser || !enrolledUser.recitation_group_id) {
      return APIResponse({
        error: 'User not enrolled or recitation group not found',
        status: 404,
      });
    }

    const message = `Welcome to WazobiaCode! We're thrilled to have you join us. Please join your lab group, where all class sessions will take place. We're looking forward to getting started with you!`;

    const invites = [
      {
        chat_id: (
          enrolledUser.recitation_group_id as unknown as IRecitationGroup
        ).telegram_group_id,
        user_ids: [`${telegram_user_id}`],
        message,
      },
    ];

    await axios.post(
      `${env.TELEGRAM_API_URL}/send-invites`,
      { invites },
      { headers: { 'X-API-Key': env.TELEGRAM_API_KEY } },
    );

    return APIResponse({
      message: `Your telegram account has been successfully linked to your WazobiaCode account (${updatedUser.email}).`,
      status: 200,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
