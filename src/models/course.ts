import { Schema, model, models, Model } from 'mongoose';
import { ICourse, ISection, ILecture } from '@/types/db/course';

const timeStamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const CourseSchema = new Schema<ICourse>(
  {
    title: String,
    description: String,
    slug: String,
    active: Boolean,
    cover_image: String,
    icon: String,
    overview: String,
  },
  { timestamps: timeStamps },
);

const SectionSchema = new Schema<ISection>(
  {
    title: String,
    description: String,
    slug: String,
    active: Boolean,
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    icon: String,
    section_num: Number,
  },
  { timestamps: timeStamps },
);

const LectureSchema = new Schema<ILecture>(
  {
    title: String,
    description: String,
    slug: String,
    active: Boolean,
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    section_id: { type: Schema.Types.ObjectId, ref: 'Section' },
    lecture_num: Number,
    content: String,
    tags: [String],
    video_url: String,
  },
  { timestamps: timeStamps },
);

export const Course: Model<ICourse> =
  models.Course || model('Course', CourseSchema);
export const Section: Model<ISection> =
  models.Section || model('Section', SectionSchema);
export const Lecture: Model<ILecture> =
  models.Lecture || model('Lecture', LectureSchema);
