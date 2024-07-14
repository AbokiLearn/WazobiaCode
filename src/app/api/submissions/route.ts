import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Submission, QuizSubmission, HomeworkSubmission } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');

    let query = {};
    if (assignmentId) query = { ...query, assignment_id: assignmentId };
    if (studentId) query = { ...query, student_id: studentId };

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
}

export async function POST(request: Request) {
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
}
