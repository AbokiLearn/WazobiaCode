import { getSession } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { Course, RecitationGroup, Enrollment } from '@/models';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const { courseSlug } = params;
  const { searchParams } = new URL(request.url);
  const recitationId = searchParams.get('id');

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    let query: Record<string, any> = { course_id: course._id };
    if (recitationId) {
      query._id = recitationId;
    }

    const recitations = await RecitationGroup.find(query).lean();

    if (recitations.length === 0) {
      return APIResponse({
        error: 'Recitation group not found',
        status: 404,
      });
    }

    return APIResponse({
      data: { recitations: recitationId ? recitations[0] : recitations },
      message: 'Recitation groups fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export const POST = async function createRecitationGroup(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const session = await getSession();
  if (
    !session ||
    !(session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[])?.includes(
      UserRole.INSTRUCTOR,
    )
  ) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const { courseSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const data = await request.json();

    if (!data.name) {
      return APIResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    const newRecitationGroup = new RecitationGroup({
      course_id: course._id,
      name: data.name,
      telegram_group_id: data.telegram_group_id || null,
    });

    await newRecitationGroup.save();

    return APIResponse({
      data: { recitationGroup: newRecitationGroup },
      message: 'Recitation group created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
};

export const PATCH = async function updateRecitationGroup(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const session = await getSession();
  if (
    !session ||
    !(session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[])?.includes(
      UserRole.INSTRUCTOR,
    )
  ) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const { courseSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return APIResponse({
        error: 'Missing recitation group ID',
        status: 400,
      });
    }

    const updatedRecitationGroup = await RecitationGroup.findOneAndUpdate(
      { _id: id, course_id: course._id },
      updateData,
      { new: true },
    );

    if (!updatedRecitationGroup) {
      return APIResponse({
        error: 'Recitation group not found',
        status: 404,
      });
    }

    return APIResponse({
      data: { recitationGroup: updatedRecitationGroup },
      message: 'Recitation group updated successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
};

export const DELETE = async function deleteRecitationGroup(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const session = await getSession();
  if (
    !session ||
    !(session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[])?.includes(
      UserRole.INSTRUCTOR,
    )
  ) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const { courseSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const { id } = await request.json();

    if (!id) {
      return APIResponse({
        error: 'Missing recitation group ID',
        status: 400,
      });
    }

    const deletedRecitationGroup = await RecitationGroup.findOneAndDelete({
      _id: id,
      course_id: course._id,
    });

    if (!deletedRecitationGroup) {
      return APIResponse({
        error: 'Recitation group not found',
        status: 404,
      });
    }

    // Delete corresponding enrollments
    await Enrollment.deleteMany({ recitation_group_id: id });

    return APIResponse({
      message: 'Recitation group deleted successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
};
