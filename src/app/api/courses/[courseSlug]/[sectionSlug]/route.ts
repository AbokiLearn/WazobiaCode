import connectMongoDB from '@/lib/mongodb';
import { getSectionWithLectures } from '@/services/db/course';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string; sectionSlug: string } },
) {
  await connectMongoDB();
  const section = await getSectionWithLectures(
    params.courseSlug,
    params.sectionSlug,
  );
  return Response.json(section);
}
