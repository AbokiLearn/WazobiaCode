import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { getLecture } from '@/lib/db/course';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { courseSlug: string; sectionSlug: string; lectureSlug: string };
  },
) {
  try {
    await connectMongoDB();
    const lecture = await getLecture(
      params.courseSlug,
      params.sectionSlug,
      params.lectureSlug,
    );
    return APIResponse({
      data: { lecture },
      message: 'Lecture fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
