import { Document, Types } from 'mongoose';

export interface IStudentQuestion extends Document {
  _id: Types.ObjectId;
  student_id: string; // auth0 `User.sub` property
  course_id: Types.ObjectId; // ref to Course
  section_id: Types.ObjectId; // ref to Section
  lecture_id: Types.ObjectId; // ref to Lecture
  question: string;
  response?: string;
  response_files?: string[];
  created_at: Date;
  updated_at: Date;
}
