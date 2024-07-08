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
  const sections = await Section.find({ course_id: course._id }).sort({
    section_num: 1,
  });
  return { ...course.toObject(), sections };
};
