import { Schema, model, models, Model } from 'mongoose';
import { ICourse, ISection, ILecture } from '@/types/db/course';

const CourseSchema = new Schema<ICourse>(
  {
    title: String,
    icon: String,
    description: String,
    slug: String,
    active: Boolean,
    cover_image: String,
  },
  { timestamps: true },
);

const SectionSchema = new Schema<ISection>(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    section_num: Number,
    title: String,
    description: String,
    slug: String,
    icon: String,
  },
  { timestamps: true },
);

const LectureSchema = new Schema<ILecture>(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    section_id: { type: Schema.Types.ObjectId, ref: 'Section' },
    lecture_num: Number,
    title: String,
    description: String,
    slug: String,
    content: String,
    tags: [String],
    video_url: String,
  },
  { timestamps: true },
);

export const Course: Model<ICourse> =
  models.Course || model('Course', CourseSchema);
export const Section: Model<ISection> =
  models.Section || model('Section', SectionSchema);
export const Lecture: Model<ILecture> =
  models.Lecture || model('Lecture', LectureSchema);
