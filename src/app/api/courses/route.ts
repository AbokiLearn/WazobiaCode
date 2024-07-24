import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { PipelineStage } from 'mongoose';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { UserRole } from '@/types/auth';
import { Course } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeSections = searchParams.get('sections') === 'true';

  try {
    await connectMongoDB();

    let aggregation: PipelineStage[] = [];

    if (includeSections) {
      aggregation.push({
        $lookup: {
          from: 'sections',
          localField: '_id',
          foreignField: 'course_id',
          as: 'sections',
        },
      });
    }

    aggregation.push({
      $sort: {
        active: -1,
        'sections.section_num': 1,
      },
    });

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
      console.log(
        `title: ${title}, description: ${description}, slug: ${slug}, cover_image: ${cover_image}, icon: ${icon}`,
      );
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
      message: 'Course created successfully',
      status: 201,
    });
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return APIResponse({
        error: 'Course slug already in use',
        status: 409,
      });
    } else {
      return APIErrorHandler(error);
    }
  }
});

export const PATCH = withApiAuthRequired(async function updateCourse(
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

    const { id, ...updateData } = await request.json();

    if (!id) {
      return APIResponse({
        error: 'Missing course ID',
        status: 400,
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCourse) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    return APIResponse({
      data: { course: updatedCourse },
      message: 'Course updated successfully',
      status: 200,
    });
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return APIResponse({
        error: 'Course slug already in use',
        status: 409,
      });
    } else {
      return APIErrorHandler(error);
    }
  }
});

export const DELETE = withApiAuthRequired(async function deleteCourse(
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

    const { id } = await request.json();
    await Course.findByIdAndDelete(id);

    return APIResponse({
      message: 'Course deleted successfully',
      status: 200,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
