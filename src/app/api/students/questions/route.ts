import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { StudentQuestion } from '@/models/student-question';

// TODO: protect routes

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

    const studentQuestions = await StudentQuestion.find(query);
    return APIResponse({
      data: { studentQuestions },
      message: 'Student questions fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

// TODO: protect routes
export async function POST(request: Request) {
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
}
