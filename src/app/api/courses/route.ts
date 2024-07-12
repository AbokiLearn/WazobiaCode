import { getCoursesWithSections } from '@/lib/db/course';
import { APIResponse, APIErrorHandler } from '@/lib/utils';
import connectMongoDB from '@/lib/db/connect';

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const courses = await getCoursesWithSections();
    return APIResponse({
      data: { courses },
      message: 'Courses fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
