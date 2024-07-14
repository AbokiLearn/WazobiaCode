import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Assignment } from '@/models';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const assignment = await Assignment.findById(params.id).populate(
      'course_id section_id lecture_id',
    );
    if (!assignment) {
      return APIResponse({
        message: 'Assignment not found',
        status: 404,
      });
    }
    return APIResponse({
      data: { assignment },
      message: 'Assignment fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      params.id,
      body,
      { new: true },
    );
    if (!updatedAssignment) {
      return APIResponse({
        message: 'Assignment not found',
        status: 404,
      });
    }
    return APIResponse({
      data: { assignment: updatedAssignment },
      message: 'Assignment updated successfully',
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
    const deletedAssignment = await Assignment.findByIdAndDelete(params.id);
    if (!deletedAssignment) {
      return APIResponse({
        message: 'Assignment not found',
        status: 404,
      });
    }
    return APIResponse({
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
