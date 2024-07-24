import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Types } from 'mongoose';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { RecitationGroup } from '@/models';

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
      { $match: { course_id: new Types.ObjectId(course_id) } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'recitation_group_id',
          as: 'enrollments',
        },
      },
      { $unwind: '$enrollments' },
      {
        $lookup: {
          from: 'user_metadata',
          localField: 'enrollments.student_id',
          foreignField: 'sub',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$telegram_group_id',
          user_ids: { $push: '$user.telegram_user_id' },
        },
      },
      {
        $project: {
          _id: 0,
          chat_id: '$_id',
          user_ids: {
            $filter: {
              input: '$user_ids',
              as: 'id',
              cond: { $ne: ['$$id', null] },
            },
          },
        },
      },
    ];
    const inviteRequests = await RecitationGroup.aggregate(aggregationPipeline);

    inviteRequests.forEach((invite) => {
      invite.message = message;
    });

    return APIResponse({ data: inviteRequests, status: 200 });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
