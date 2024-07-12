import { Document, Types } from 'mongoose';

export interface CourseBase extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  slug: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ICourse extends CourseBase {
  cover_image: string;
  icon: string;
  overview: string;
}

export interface ISection extends CourseBase {
  course_id: Types.ObjectId | ICourse;
  icon: string;
  section_num: number;
}

export interface ILecture extends CourseBase {
  course_id: Types.ObjectId | ICourse;
  section_id: Types.ObjectId | ISection;
  lecture_num: number;
  content: string;
  tags: string[];
  video_url: string;
}

export interface SectionWithLectures extends ISection {
  lectures: ILecture[];
}

export interface CourseWithSections extends ICourse {
  sections: SectionWithLectures[];
}
