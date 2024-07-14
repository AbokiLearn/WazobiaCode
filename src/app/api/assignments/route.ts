import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Lecture } from '@/models';
import { Assignment } from '@/models';

export async function GET(request: Request) {
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

    const assignments = await Assignment.find(query);
    return APIResponse({
      data: { assignments },
      message: 'Assignments fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const newAssignment = await Assignment.create(body);
    Lecture.findOneAndUpdate(
      { _id: body.lecture_id },
      { $push: { [newAssignment.type]: newAssignment._id } },
    );

    return APIResponse({
      data: { assignment: newAssignment },
      message: 'Assignment created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
