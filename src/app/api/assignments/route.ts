import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import {
  Lecture,
  Assignment,
  Submission,
  QuizAssignment,
  HomeworkAssignment,
} from '@/models';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export const GET = withApiAuthRequired(async function GET(request: Request) {
  const session = await getSession();

  if (
    !session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.INSTRUCTOR)
  ) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const sectionId = searchParams.get('sectionId');
    const lectureId = searchParams.get('lectureId');
    const populateLecture = searchParams.get('populate_lecture') === 'true';
    const countSubmissions = searchParams.get('count_submissions') === 'true';

    await connectMongoDB();

    let query = {};
    if (courseId) query = { ...query, course_id: courseId };
    if (sectionId) query = { ...query, section_id: sectionId };
    if (lectureId) query = { ...query, lecture_id: lectureId };

    let assignments = [];
    if (populateLecture) {
      assignments = await Assignment.find(query).populate(
        'lecture_id section_id course_id',
      );
    } else {
      assignments = await Assignment.find(query);
    }

    if (countSubmissions) {
      assignments = await Promise.all(
        assignments.map(async (assignment) => {
          const submissionCount = await Submission.countDocuments({
            assignment_id: assignment._id,
          });
          return {
            ...assignment.toObject(),
            submission_count: submissionCount,
          };
        }),
      );
    }

    return APIResponse({
      data: { assignments },
      message: 'Assignments fetched successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});

export const POST = withApiAuthRequired(async function POST(request: Request) {
  const session = await getSession();

  if (
    !session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.INSTRUCTOR)
  ) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  try {
    await connectMongoDB();

    const body = await request.json();

    let newAssignment = null;

    if (body.type === 'quiz') {
      newAssignment = await QuizAssignment.create(body);
    } else if (body.type === 'homework') {
      newAssignment = await HomeworkAssignment.create(body);
    } else {
      return APIErrorHandler({
        message: 'Invalid assignment type',
        status: 400,
      });
    }

    const updatedLecture = await Lecture.findOneAndUpdate(
      { _id: body.lecture_id },
      { $push: { [newAssignment.type]: newAssignment._id } },
      { new: true },
    );

    if (!updatedLecture) {
      return APIErrorHandler({ message: 'Lecture not found', status: 404 });
    }

    return APIResponse({
      data: { assignment: newAssignment },
      message: 'Assignment created successfully',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});

export const PATCH = withApiAuthRequired(async function PATCH(
  request: Request,
) {
  const session = await getSession();

  if (
    !session?.user[`${env.AUTH0_NAMESPACE}/roles`].includes(UserRole.INSTRUCTOR)
  ) {
    return APIErrorHandler({ message: 'Unauthorized', status: 401 });
  }

  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');

    if (!assignmentId) {
      return APIErrorHandler({
        message: 'Assignment ID is required',
        status: 400,
      });
    }

    const body = await request.json();

    let updatedAssignment = null;
    if (body.type === 'quiz') {
      updatedAssignment = await QuizAssignment.findByIdAndUpdate(
        assignmentId,
        body,
        { new: true },
      );
    } else if (body.type === 'homework') {
      updatedAssignment = await HomeworkAssignment.findByIdAndUpdate(
        assignmentId,
        body,
        { new: true },
      );
    } else {
      console.log(body);
      return APIErrorHandler({
        message: 'Invalid assignment type',
        status: 400,
      });
    }

    if (!updatedAssignment) {
      return APIErrorHandler({ message: 'Assignment not found', status: 404 });
    }

    return APIResponse({
      data: { assignment: updatedAssignment },
      message: 'Assignment updated successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
});
