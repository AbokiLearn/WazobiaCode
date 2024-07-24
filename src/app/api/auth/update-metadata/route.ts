import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import { getManagementClient } from '@/lib/auth';
import connectMongoDB from '@/lib/db/connect';
import { env } from '@/lib/config';
import { UserMetadata, Enrollment, RecitationGroup, Course } from '@/models';

const DEFAULT_COURSE_SLUG = 'fullstack-web-dev';

export const POST = withApiAuthRequired(async function handler(
  request: Request,
) {
  await connectMongoDB();
  const session = await getSession();

  const updatedMetadata = await validateData(await request.json(), session);
  if (!updatedMetadata) {
    return APIResponse({
      error: 'Invalid request',
      status: 400,
    });
  }

  try {
    // Attempt to update or create user metadata in MongoDB
    const userMetadata = await updateMongoMetadata(updatedMetadata, session);
    console.log('userMetadata', userMetadata);

    // Update Auth0 user metadata
    await updateAuth0Metadata(updatedMetadata, session);

    // Enroll the user in the default course
    await oneTimeEnrollment(userMetadata);

    return APIResponse({
      data: {
        redirectUrl: '/api/auth/silent?redirect=app',
      },
      message: 'Profile updated successfully',
      status: 200,
    });
  } catch (error: any) {
    // Check if the error is a MongoServerError due to duplicate phone number
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return APIResponse({
        error: 'Phone number already in use by another user',
        status: 409,
      });
    } else {
      return APIErrorHandler(error);
    }
  }
});

const validateData = async (data: any, session: any) => {
  const { first_name, last_name, phone_number } = data;

  if (
    typeof first_name !== 'string' ||
    typeof last_name !== 'string' ||
    typeof phone_number !== 'string'
  ) {
    return {};
  }

  return {
    first_name,
    last_name,
    phone_number,
    email: session.user.email,
  };
};

const updateMongoMetadata = async (updatedMetadata: any, session: any) => {
  const roles = session.user[`${env.AUTH0_NAMESPACE}/roles`] as string[];
  const userMetadata = await UserMetadata.findOneAndUpdate(
    { sub: session.user.sub },
    { ...updatedMetadata, roles },
    { upsert: true, new: true },
  );
  if (!userMetadata) {
    throw new Error('User metadata not found');
  }

  return userMetadata;
};

const updateAuth0Metadata = async (updatedMetadata: any, session: any) => {
  const client = await getManagementClient();
  await client.users.update(
    { id: session.user.sub },
    { user_metadata: updatedMetadata },
  );
};

const oneTimeEnrollment = async (userMetadata: any) => {
  const course = await Course.findOne({ slug: DEFAULT_COURSE_SLUG });

  if (course) {
    const course_id = course._id;

    // Check if the user is already enrolled in the default course
    const existingEnrollment = await Enrollment.findOne({
      student_id: userMetadata.sub,
      course_id,
    });

    if (!existingEnrollment) {
      // Find the recitation group with the fewest student
      const recitationGroup = (
        await RecitationGroup.find({ course_id })
          .sort({ student_count: 1 })
          .limit(1)
      )[0];

      if (!recitationGroup) {
        throw new Error('No recitation group found for the default course');
      }

      // Create a new enrollment
      const newEnrollment = new Enrollment({
        student_id: userMetadata.sub,
        course_id,
        recitation_group_id: recitationGroup._id,
      });
      await newEnrollment.save();

      // Update the recitation group's student count
      await RecitationGroup.updateOne(
        { _id: recitationGroup._id },
        { $inc: { student_count: 1 } },
      );

      // Update the user's enrollment status
      await UserMetadata.findByIdAndUpdate(userMetadata._id, {
        $push: { enrollments: newEnrollment._id },
      });

      // Update the course's enrolled_students count
      await Course.findByIdAndUpdate(course_id, {
        $inc: { enrolled_students: 1 },
      });
    }
  } else {
    console.log('Course not found');
  }
};
