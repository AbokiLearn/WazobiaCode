import { getSectionWithLectures } from '@/lib/db/course';
import { APIResponse, APIErrorHandler } from '@/lib/utils';
import connectMongoDB from '@/lib/db/connect';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  try {
    await connectMongoDB();
    const section = await getSectionWithLectures(
      params.courseSlug,
      params.sectionSlug,
    );
    return APIResponse({
      data: { section },
      message: 'Section fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
