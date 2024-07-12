import { APIResponse, APIErrorHandler } from '@/lib/api';
import { getCourseWithSections } from '@/lib/db/course';
import connectMongoDB from '@/lib/db/connect';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const courseSlug = params.courseSlug;

  try {
    await connectMongoDB();
    const course = await getCourseWithSections(courseSlug);
    return APIResponse({
      data: { course },
      message: 'Course fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
