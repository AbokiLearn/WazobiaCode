import { APIResponse, APIErrorHandler } from '@/lib/api';
import { Course, Section, Lecture } from '@/models/course';
import connectMongoDB from '@/lib/db/connect';

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
    }).lean();
    if (!lecture) {
      return APIResponse({
        data: null,
        message: 'Lecture not found',
      });
    }

    return APIResponse({
      data: { lecture },
      message: 'Lecture fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
