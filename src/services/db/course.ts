import { Course } from '@/models/course';
import { PipelineStage } from 'mongoose';

export const getCoursesWithSections = async () => {
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
        'sections.sectionNum': 1,
      },
    },
  ] as PipelineStage[];
  return Course.aggregate(aggregation);
};
