import connectMongoDB from '@/lib/db/connect';
import { getCourseWithSections } from '@/lib/db/course';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const courseSlug = params.courseSlug;

  await connectMongoDB();
  const course = await getCourseWithSections(courseSlug);

  return Response.json(course);
}
