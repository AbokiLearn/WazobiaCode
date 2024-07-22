import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { PipelineStage } from 'mongoose';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { UserRole } from '@/types/auth';
import { Course } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    // get all courses with their sections
    const aggregation = [
      {
        $lookup: {
          from: 'sections',
          localField: '_id',
          foreignField: 'course_id',
          as: 'sections',
        },
      },
      {
        $sort: {
          active: -1,
          'sections.section_num': 1,
        },
      },
    ] as PipelineStage[];
    const courses = await Course.aggregate(aggregation);

    return APIResponse({
      data: { courses },
      message: 'Courses fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export const POST = withApiAuthRequired(async function createCourse(
  request: Request,
) {
  const session = await getSession();
  const userRoles =
    (session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[]) || [];
  if (!userRoles.includes(UserRole.INSTRUCTOR)) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  try {
    await connectMongoDB();

    const { title, description, slug, cover_image, icon } =
      await request.json();

    // Validate required fields
    if (!title || !description || !slug || !cover_image || !icon) {
      return APIResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      slug,
      cover_image,
      icon,
      active: false,
    });

    await newCourse.save();

    return APIResponse({
      data: { course: newCourse, user: session?.user },
      message: 'Course created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
