import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Course, Section } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const courseSlug = params.courseSlug;
  const { searchParams } = new URL(request.url);
  const includeSections = searchParams.get('sections') === 'true';
  const includeLectures = searchParams.get('lectures') === 'true';

  try {
    await connectMongoDB();

    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      return APIResponse({
        data: null,
        message: 'Course not found',
      });
    }

    let courseData: any = { ...course, sections: [] };

    if (includeSections) {
      const sections = await Section.find({ course_id: courseData._id })
        .sort({ section_num: 1 })
        .lean();

      if (includeLectures) {
        const sectionsWithLectures = await Section.aggregate([
          { $match: { course_id: courseData._id } },
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
        courseData.sections = sectionsWithLectures;
      } else {
        courseData.sections = sections;
      }
    }

    return APIResponse({
      data: { course: courseData },
      message: 'Course fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
