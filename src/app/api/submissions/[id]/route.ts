import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Submission, HomeworkSubmission, QuizSubmission } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const submission = await Submission.findById(params.id).populate(
      'assignment_id student_id',
    );
    if (!submission) {
      return APIResponse({
        message: 'Submission not found',
        status: 404,
      });
    }
    return APIResponse({
      data: { submission },
      message: 'Submission fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const body = await request.json();

    let updatedSubmission;
    if (body.type === 'homework') {
      updatedSubmission = await HomeworkSubmission.findByIdAndUpdate(
        params.id,
        body,
        { new: true },
      );
    } else if (body.type === 'quiz') {
      updatedSubmission = await QuizSubmission.findByIdAndUpdate(
        params.id,
        body,
        { new: true },
      );
    } else {
      return APIResponse({
        message: 'Invalid submission type',
        status: 400,
      });
    }

    if (!updatedSubmission) {
      return APIResponse({
        message: 'Submission not found',
        status: 404,
      });
    }
    return APIResponse({
      data: { submission: updatedSubmission },
      message: 'Submission updated successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const deletedSubmission = await Submission.findByIdAndDelete(params.id);
    if (!deletedSubmission) {
      return APIResponse({
        message: 'Submission not found',
        status: 404,
      });
    }
    return APIResponse({
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
