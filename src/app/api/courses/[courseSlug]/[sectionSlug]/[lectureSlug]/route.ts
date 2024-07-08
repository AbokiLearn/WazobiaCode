import connectMongoDB from '@/lib/mongodb';
import { getLecture } from '@/services/db/course';

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
