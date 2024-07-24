import { getSession } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { Course, Section, Lecture } from '@/models';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const { courseSlug } = params;
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get('id');
  const sectionSlug = searchParams.get('slug');
  const includeLectures = searchParams.get('lectures') === 'true';
  const includeLectureContent = searchParams.get('content') === 'true';

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return APIResponse({
        error: 'Course not found',
        status: 404,
      });
    }

    let query: Record<string, string> = { course_id: course._id.toString() };
    if (sectionId) {
      query = { ...query, _id: sectionId };
    }
    if (sectionSlug) {
      query = { ...query, slug: sectionSlug };
    }

    let sections = await Section.find(query).sort({ section_num: 1 }).lean();

    if (includeLectures) {
      sections = await Promise.all(
        sections.map(async (section) => {
          const lectures = await Lecture.find({ section_id: section._id })
            .sort({ lecture_num: 1 })
            .select(includeLectureContent ? '' : '-content')
            .lean();
          return { ...section, lectures };
        }),
      );
    }

    if (sections.length === 0) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    return APIResponse({
      data: { sections: sectionId ? sections[0] : sections },
      message: 'Sections fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export const POST = async function createSection(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const session = await getSession();
  if (!session) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const userRoles =
    (session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[]) || [];
  if (!userRoles.includes(UserRole.INSTRUCTOR)) {
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

    if (!data.title || !data.description || !data.slug) {
      return APIResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    if (!data.icon) {
      data.icon =
        'https://wazobiacode-web.s3.us-east-1.amazonaws.com/course-assets/d47743b5-63ed-45d9-a24f-95caf592a393.svg';
    }

    const lastSection = await Section.findOne({ course_id: course._id }).sort({
      section_num: -1,
    });
    const section_num = lastSection ? lastSection.section_num + 1 : 1;

    const newSection = new Section({
      title: data.title,
      description: data.description,
      slug: data.slug,
      icon: data.icon,
      course_id: course._id,
      section_num,
      active: data.active,
    });

    await newSection.save();

    return APIResponse({
      data: { section: newSection },
      message: 'Section created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
};

export const PATCH = async function updateSection(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const session = await getSession();
  if (!session) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const userRoles =
    (session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[]) || [];
  if (!userRoles.includes(UserRole.INSTRUCTOR)) {
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
        error: 'Missing section ID',
        status: 400,
      });
    }

    const updatedSection = await Section.findOneAndUpdate(
      { _id: id, course_id: course._id },
      updateData,
      { new: true },
    );

    if (!updatedSection) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    return APIResponse({
      data: { section: updatedSection },
      message: 'Section updated successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
};

export const DELETE = async function deleteSection(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const session = await getSession();
  if (!session) {
    return APIResponse({
      error: 'Unauthorized',
      status: 401,
    });
  }

  const userRoles =
    (session?.user[`${env.AUTH0_NAMESPACE}/roles`] as string[]) || [];
  if (!userRoles.includes(UserRole.INSTRUCTOR)) {
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
        error: 'Missing section ID',
        status: 400,
      });
    }

    const deletedSection = await Section.findOneAndDelete({
      _id: id,
      course_id: course._id,
    });

    if (!deletedSection) {
      return APIResponse({
        error: 'Section not found',
        status: 404,
      });
    }

    // Delete associated lectures
    await Lecture.deleteMany({ section_id: id });

    // Update section numbers for remaining sections
    await Section.updateMany(
      {
        course_id: course._id,
        section_num: { $gt: deletedSection.section_num },
      },
      { $inc: { section_num: -1 } },
    );

    return APIResponse({
      message: 'Section deleted successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
};
