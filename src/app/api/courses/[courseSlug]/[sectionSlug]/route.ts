import { APIResponse, APIErrorHandler } from '@/lib/api';
import { Course, Section } from '@/models';
import connectMongoDB from '@/lib/db/connect';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  const { courseSlug, sectionSlug } = params;

  try {
    await connectMongoDB();

    // get a section with its lectures
    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      return APIResponse({
        data: null,
        message: 'Course not found',
      });
    }
    const section = await Section.aggregate([
      { $match: { course_id: course._id, slug: sectionSlug } },
      {
        $lookup: {
          from: 'lectures',
          localField: '_id',
          foreignField: 'section_id',
          pipeline: [{ $sort: { lecture_num: 1 } }],
          as: 'lectures',
        },
      },
      { $limit: 1 },
    ]).then((results) => results[0] || null);

    return APIResponse({
      data: { section },
      message: 'Section fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
