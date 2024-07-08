import connectMongoDB from '@/lib/mongodb';
import { getCourseWithSections } from '@/services/db/course';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const courseSlug = params.courseSlug;

  await connectMongoDB();
  const course = await getCourseWithSections(courseSlug);

  return Response.json(course);
}
