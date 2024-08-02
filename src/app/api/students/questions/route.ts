import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { StudentQuestion } from '@/models';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export const GET = withApiAuthRequired(async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.STUDENT)) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const sectionId = searchParams.get('sectionId');
    const lectureId = searchParams.get('lectureId');

    await connectMongoDB();

    let query = {};
    if (courseId) query = { ...query, course_id: courseId };
    if (sectionId) query = { ...query, section_id: sectionId };
    if (lectureId) query = { ...query, lecture_id: lectureId };

    const studentQuestions = await StudentQuestion.find(query);
    return APIResponse({
      data: { studentQuestions },
      message: 'Student questions fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
})

export const POST = withApiAuthRequired(async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.STUDENT)) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  try {
    await connectMongoDB();

    const body = await request.json();
    const newStudentQuestion = await StudentQuestion.create(body);

    return APIResponse({
      data: { studentQuestion: newStudentQuestion },
      message: 'Student question submitted successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
})
