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
    !session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.INSTRUCTOR)
  ) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const recitation = searchParams.get('recitation');

  try {
    await connectMongoDB();
    let query = UserMetadata.find({
      // roles: { $in: [UserRole.STUDENT], $not: { $in: [UserRole.INSTRUCTOR] } },
      roles: { $in: [UserRole.STUDENT] },
    }).populate({
      path: 'enrollments',
      populate: {
        path: 'recitation_group_id',
        model: 'RecitationGroup',
      },
    });

    const users = await query.lean().exec();

    let users_data = users.map((user) => {
      const enrollments = user.enrollments.map((enrollment) => ({
        ...enrollment,
        recitation_group_id:
          (enrollment as any)?.recitation_group_id?._id || null,
        recitation_group:
          (enrollment as any)?.recitation_group_id?.name || null,
      }));

      return {
        ...user,
        enrollments,
      };
    });

    console.log(`users_data: ${JSON.stringify(users_data, null, 2)}`);

    if (recitation) {
      console.log(`recitation: ${recitation}`);
      users_data = users_data.filter((user) =>
        user.enrollments.some(
          (enrollment) =>
            enrollment.recitation_group_id &&
            enrollment.recitation_group_id.toString() === recitation,
        ),
      );
    }

    console.log(`users_data: ${JSON.stringify(users_data, null, 2)}`);

    return APIResponse({ data: users_data, status: 200 });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
