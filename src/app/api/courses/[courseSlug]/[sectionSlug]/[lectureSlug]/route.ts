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
  await connectMongoDB();
  const lecture = await getLecture(
    params.courseSlug,
    params.sectionSlug,
    params.lectureSlug,
  );
  return Response.json(lecture);
}
