import { APIResponse, APIErrorHandler } from '@/lib/api';
import { Course, Section, Lecture } from '@/models';
import connectMongoDB from '@/lib/db/connect';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const courseSlug = params.courseSlug;

  try {
    await connectMongoDB();

    // get a course with its sections and their lectures
    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      return APIResponse({
        data: null,
        message: 'Course not found',
      });
    }
    const sections = await Section.aggregate([
      { $match: { course_id: course._id } },
      { $sort: { section_num: 1 } },
      {
        $lookup: {
          from: 'lectures',
          localField: '_id',
          foreignField: 'section_id',
          pipeline: [
            { $project: { content: 0 } },
            { $sort: { lecture_num: 1 } },
          ],
          as: 'lectures',
        },
      },
    ]);
    const courseWithLectures = { ...course, sections };

    return APIResponse({
      data: { course: courseWithLectures },
      message: 'Course fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
