import { APIResponse, APIErrorHandler } from '@/lib/api';
import {
  Course,
  Section,
  Lecture,
  QuizAssignment,
  HomeworkAssignment,
} from '@/models';
import connectMongoDB from '@/lib/db/connect';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { courseSlug: string; sectionSlug: string; lectureSlug: string };
  },
) {
  const { courseSlug, sectionSlug, lectureSlug } = params;

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      return APIResponse({
        data: null,
        message: 'Course not found',
      });
    }
    const section = await Section.findOne({
      course_id: course._id,
      slug: sectionSlug,
    }).lean();
    if (!section) {
      return APIResponse({
        data: null,
        message: 'Section not found',
      });
    }
    const lecture = await Lecture.findOne({
      course_id: course._id,
      section_id: section._id,
      slug: lectureSlug,
    });

    if (!lecture) {
      return APIResponse({
        data: null,
        message: 'Lecture not found',
      });
    }

    if (lecture.has_quiz && lecture.quiz_id) {
      const quiz = await QuizAssignment.findOne({ _id: lecture.quiz_id });
      if (quiz) {
        lecture.quiz_id = quiz._id;
      }
    }

    if (lecture.has_homework && lecture.homework_id) {
      const homework = await HomeworkAssignment.findOne({
        _id: lecture.homework_id,
      });
      if (homework) {
        lecture.homework_id = homework._id;
      }
    }

    return APIResponse({
      data: { lecture },
      message: 'Lecture fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
