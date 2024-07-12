import { Schema, model, models, Model } from 'mongoose';
import { ICourse, ISection, ILecture } from '@/types/db/course';

const timeStamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    cover_image: { type: String, required: true },
    icon: { type: String, required: true },
    overview: { type: String, required: true },
  },
  { timestamps: timeStamps },
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    icon: { type: String, required: true },
    section_num: { type: Number, required: true },
  },
  { timestamps: timeStamps },
);

const LectureSchema = new Schema<ILecture>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    section_id: { type: Schema.Types.ObjectId, ref: 'Section' },
    lecture_num: { type: Number, required: true },
    content: { type: String, required: true },
    tags: [String],
    video_url: { type: String, required: true },
  },
  { timestamps: timeStamps },
);

CourseSchema.index({ slug: 1 });
SectionSchema.index({ course_id: 1, section_num: 1 });
LectureSchema.index({ course_id: 1, section_id: 1, lecture_num: 1 });

export const Course: Model<ICourse> =
  models.Course || model('Course', CourseSchema);
export const Section: Model<ISection> =
  models.Section || model('Section', SectionSchema);
export const Lecture: Model<ILecture> =
  models.Lecture || model('Lecture', LectureSchema);
