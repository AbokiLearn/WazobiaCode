import { Course, Section } from '@/models/course';
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
        'sections.section_num': 1,
      },
    },
  ] as PipelineStage[];
  return Course.aggregate(aggregation);
};

export const getCourseWithSections = async (courseSlug: string) => {
  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    return null;
  }
  const sections = await Section.aggregate([
    { $match: { course_id: course._id } },
    { $sort: { section_num: 1 } },
    {
      $lookup: {
        from: 'lectures',
        localField: '_id',
        foreignField: 'section_id',
        pipeline: [
          { $project: { slug: 1, title: 1, _id: 0 } },
          { $sort: { lecture_num: 1 } },
        ],
        as: 'lectures',
      },
    },
  ]);

  return { ...course.toObject(), sections };
};
