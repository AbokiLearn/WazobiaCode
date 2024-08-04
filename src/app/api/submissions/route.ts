import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import {
  Submission,
  QuizSubmission,
  HomeworkSubmission,
  Assignment,
} from '@/models';
import { IHomeworkSubmission } from '@/types/db/submission';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export const GET = withApiAuthRequired(async (request: Request) => {
  const session = await getSession();

  const userId = session?.user.id;
  let role: UserRole | null = null;

  if (
    session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.INSTRUCTOR)
  ) {
    role = UserRole.INSTRUCTOR;
  } else if (
    session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.STUDENT)
  ) {
    role = UserRole.STUDENT;
  } else {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignment_id');
    const studentId = searchParams.get('student_id');

    let query = {};
    if (assignmentId) query = { ...query, assignment_id: assignmentId };

    // students should only be able to see their own submissions
    if (studentId) {
      if (role === UserRole.STUDENT && studentId !== userId) {
        return APIErrorHandler({ message: 'Unauthorized', status: 401 });
      } else {
        query = { ...query, student_id: studentId };
      }
    }

    const submissions = await Submission.find(query).populate(
      'assignment_id student_id',
    );

    return APIResponse({
      data: { submissions },
      message: 'Submissions fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});

export const POST = withApiAuthRequired(async (request: Request) => {
  try {
    await connectMongoDB();
    const body = await request.json();

    let newSubmission;
    if (body.type === 'quiz') {
      newSubmission = await QuizSubmission.create(body);
    } else {
      newSubmission = await HomeworkSubmission.create(body);
    }

    return APIResponse({
      data: { submission: newSubmission },
      message: 'Submission created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
