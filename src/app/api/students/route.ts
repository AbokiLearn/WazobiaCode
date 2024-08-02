import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { UserMetadata } from '@/models';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export const GET = withApiAuthRequired(async function GET(request: Request) {
  const session = await getSession();

  if (
    !session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.STUDENT)
  ) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const recitation = searchParams.get('recitation') === 'true';

  try {
    await connectMongoDB();
    let query = UserMetadata.find({
      roles: { $in: [UserRole.STUDENT], $not: { $in: [UserRole.INSTRUCTOR] } },
    });

    if (recitation) {
      query = query.populate({
        path: 'enrollments',
        populate: {
          path: 'recitation_group_id',
          model: 'RecitationGroup',
        },
      });
    }

    const users = await query.lean().exec();
    const users_data = users.map((user) => ({
      ...user,
      enrollments: user.enrollments.map((enrollment) => ({
        ...enrollment,
        recitation_group_id:
          (enrollment as any)?.recitation_group_id?._id || null,
        recitation_group:
          (enrollment as any)?.recitation_group_id?.name || null,
      })),
    }));

    return APIResponse({ data: users_data, status: 200 });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
