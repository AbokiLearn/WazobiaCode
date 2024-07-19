import { Schema } from 'mongoose';

import { ICourse, ISection, ILecture } from '@/types/db/course';

const timeStamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },
    cover_image: { type: String, required: true },
    icon: { type: String, required: true },
    overview: { type: String, required: true },
  },
  { timestamps: timeStamps },
);

export const SectionSchema = new Schema<ISection>(
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

export const LectureSchema = new Schema<ILecture>(
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
    quiz: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    homework: { type: Schema.Types.ObjectId, ref: 'Assignment' },
  },
  { timestamps: timeStamps },
);

CourseSchema.index({ slug: 1 });
SectionSchema.index({ course_id: 1, section_num: 1 });
LectureSchema.index({ course_id: 1, section_id: 1, lecture_num: 1 });
