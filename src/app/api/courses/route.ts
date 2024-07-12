import connectMongoDB from '@/lib/db/connect';
import { getCoursesWithSections } from '@/lib/db/course';

export async function GET(request: Request) {
  await connectMongoDB();
  const courses = await getCoursesWithSections();
  return new Response(JSON.stringify(courses));
}
