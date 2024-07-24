import { getSession } from '@auth0/nextjs-auth0';
import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { Course, Section, Lecture, Assignment } from '@/models';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  const { courseSlug, sectionSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const section = await Section.findOne({
      course_id: course._id,
      slug: sectionSlug,
    });
    if (!section) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    const lectures = await Lecture.find({
      course_id: course._id,
      section_id: section._id,
    })
      .sort({ lecture_num: 1 })
      .lean();

    return APIResponse({
      data: { lectures },
      message: 'Lectures fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  const session = await getSession();
  if (
    !session ||
    !session.user[`${env.AUTH0_NAMESPACE}/roles`]?.includes(UserRole.INSTRUCTOR)
  ) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const { courseSlug, sectionSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const section = await Section.findOne({
      course_id: course._id,
      slug: sectionSlug,
    });
    if (!section) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    const data = await request.json();

    if (
      !data.title ||
      !data.description ||
      !data.slug ||
      !data.content ||
      !data.video_url
    ) {
      return APIResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    const lastLecture = await Lecture.findOne({ section_id: section._id }).sort(
      { lecture_num: -1 },
    );
    const lecture_num = lastLecture ? lastLecture.lecture_num + 1 : 1;

    const newLecture = new Lecture({
      title: data.title,
      description: data.description,
      slug: data.slug,
      content: data.content,
      video_url: data.video_url,
      tags: data.tags || [],
      course_id: course._id,
      section_id: section._id,
      lecture_num,
      active: data.active !== undefined ? data.active : true,
    });

    await newLecture.save();

    return APIResponse({
      data: { lecture: newLecture },
      message: 'Lecture created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  const session = await getSession();
  if (
    !session ||
    !session.user[`${env.AUTH0_NAMESPACE}/roles`]?.includes(UserRole.INSTRUCTOR)
  ) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const { courseSlug, sectionSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const section = await Section.findOne({
      course_id: course._id,
      slug: sectionSlug,
    });
    if (!section) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return APIResponse({
        error: 'Missing lecture ID',
        status: 400,
      });
    }

    const updatedLecture = await Lecture.findOneAndUpdate(
      { _id: id, course_id: course._id, section_id: section._id },
      updateData,
      { new: true },
    );

    if (!updatedLecture) {
      return APIResponse({
        error: 'Lecture not found',
        status: 404,
      });
    }

    return APIResponse({
      data: { lecture: updatedLecture },
      message: 'Lecture updated successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  const session = await getSession();
  if (
    !session ||
    !session.user[`${env.AUTH0_NAMESPACE}/roles`]?.includes(UserRole.INSTRUCTOR)
  ) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const { courseSlug, sectionSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    const section = await Section.findOne({
      course_id: course._id,
      slug: sectionSlug,
    });
    if (!section) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    const { id } = await request.json();

    if (!id) {
      return APIResponse({
        error: 'Missing lecture ID',
        status: 400,
      });
    }

    const deletedLecture = await Lecture.findOneAndDelete({
      _id: id,
      course_id: course._id,
      section_id: section._id,
    });

    if (!deletedLecture) {
      return APIResponse({
        error: 'Lecture not found',
        status: 404,
      });
    }

    // Delete associated assignments
    await Assignment.deleteMany({ lecture_id: id });

    // Update lecture numbers for remaining lectures
    await Lecture.updateMany(
      {
        section_id: section._id,
        lecture_num: { $gt: deletedLecture.lecture_num },
      },
      { $inc: { lecture_num: -1 } },
    );

    return APIResponse({
      message: 'Lecture and associated assignments deleted successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
