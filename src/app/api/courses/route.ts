import { PipelineStage } from 'mongoose';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { Course } from '@/models';

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    // get all courses with their sections
    const aggregation = [
      {
        $lookup: {
          from: 'sections',
          localField: '_id',
          foreignField: 'course_id',
          as: 'sections',
        },
      },
      {
        $sort: {
          active: -1,
          'sections.section_num': 1,
        },
      },
    ] as PipelineStage[];
    const courses = await Course.aggregate(aggregation);

    return APIResponse({
      data: { courses },
      message: 'Courses fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
