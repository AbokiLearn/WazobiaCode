import { getSession } from '@auth0/nextjs-auth0';

import {
  Course,
  Section,
  Lecture,
  QuizAssignment,
  HomeworkAssignment,
  Assignment,
} from '@/models';
import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { ILecture } from '@/types/db/course';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

async function createAssignmentIfNeeded(lecture: ILecture) {
  if (lecture.has_quiz && !lecture.quiz_id) {
    const quizAssignment = new QuizAssignment({
      course_id: lecture.course_id,
      section_id: lecture.section_id,
      lecture_id: lecture._id,
    });
    await quizAssignment.save();
    lecture.quiz_id = quizAssignment._id;
  }

  if (lecture.has_homework && !lecture.homework_id) {
    const homeworkAssignment = new HomeworkAssignment({
      course_id: lecture.course_id,
      section_id: lecture.section_id,
      lecture_id: lecture._id,
    });
    await homeworkAssignment.save();
    lecture.homework_id = homeworkAssignment._id;
  }

  return lecture;
}

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

    if (!data.title || !data.description || !data.slug) {
      return APIResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    const lastLecture = await Lecture.findOne({ section_id: section._id }).sort(
      { lecture_num: -1 },
    );
    const lecture_num = lastLecture ? lastLecture.lecture_num + 1 : 1;

    let newLecture = new Lecture({
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
      has_quiz: data.has_quiz || false,
      has_homework: data.has_homework || false,
    });

    newLecture = await createAssignmentIfNeeded(newLecture);
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

    let updatedLecture = await Lecture.findOneAndUpdate(
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

    updatedLecture = await createAssignmentIfNeeded(updatedLecture);
    await updatedLecture.save();

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
