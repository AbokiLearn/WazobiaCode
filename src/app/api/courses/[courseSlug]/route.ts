import connectMongoDB from '@/lib/mongodb';
import { Course } from '@/models/course';

export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } },
) {
  const courseSlug = params.courseSlug;

  await connectMongoDB();
  const course = await Course.findOne({ slug: courseSlug });

  return Response.json(course);
}
