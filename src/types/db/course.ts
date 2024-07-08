import { Document, Types } from 'mongoose';

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  icon: string;
  description: string;
  slug: string;
  active: boolean;
  cover_image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISection extends Document {
  _id: Types.ObjectId;
  course_id: Types.ObjectId | ICourse;
  section_num: number;
  title: string;
  description: string;
  slug: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILecture extends Document {
  _id: Types.ObjectId;
  course_id: Types.ObjectId | ICourse;
  section_id: Types.ObjectId | ISection;
  lecture_num: number;
  title: string;
  description: string;
  slug: string;
  content: string;
  tags: string[];
  video_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithSections extends ICourse {
  sections: ISection[];
}
