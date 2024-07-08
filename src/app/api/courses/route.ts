import connectMongoDB from '@/lib/mongodb';
import { getCoursesWithSections } from '@/services/db/course';

export async function GET(request: Request) {
  await connectMongoDB();
  const courses = await getCoursesWithSections();
  return new Response(JSON.stringify(courses));
}
