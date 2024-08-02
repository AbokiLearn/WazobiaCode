import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Types } from 'mongoose';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Course } from '@/models';

export const POST = withApiAuthRequired(async (req: Request) => {
  try {
    const { course_id, message } = await req.json();

    if (!course_id) {
      return APIResponse({ error: 'Course ID is required', status: 400 });
    }

    if (!message) {
      return APIResponse({ error: 'Message is required', status: 400 });
    }

    await connectMongoDB();
    const aggregationPipeline = [
      {
        $match: { _id: new Types.ObjectId(course_id) },
      },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course_id',
          as: 'enrollments',
        },
      },
      { $unwind: '$enrollments' },
      {
        $lookup: {
          from: 'user_metadata',
          localField: 'enrollments.student_id',
          foreignField: 'sub',
          as: 'user_metadata',
        },
      },
      { $unwind: '$user_metadata' },
      {
        $group: {
          _id: '$_id',
          telegram_channel_id: { $first: '$telegram_channel_id' },
          user_ids: {
            $push: {
              $cond: [
                { $ne: ['$user_metadata.telegram_user_id', null] },
                '$user_metadata.telegram_user_id',
                '$$REMOVE',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          chat_id: '$telegram_channel_id',
          user_ids: 1,
        },
      },
    ];
    const inviteRequests = await Course.aggregate(aggregationPipeline);

    inviteRequests.forEach((invite) => {
      invite.message = message;
    });

    return APIResponse({ data: inviteRequests, status: 200 });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
