import { Document, Types } from 'mongoose';
import { ICourse, ISection, ILecture } from './course';
import { IAssignment } from './assignment';

export interface ISubmission extends Document {
  _id: Types.ObjectId;
  assignment_id: Types.ObjectId | IAssignment;
  student_id: Types.ObjectId; // include Student<User> model
  course_id: Types.ObjectId | ICourse;
  section_id: Types.ObjectId | ISection;
  lecture_id: Types.ObjectId | ILecture;
  type: 'quiz' | 'homework';
  score: number | null;
  submitted_at: Date;
  graded_at: Date | null;
  graded_by: Types.ObjectId | null; // include Instructor<User> model
}

export interface IQuizAnswer {
  question_id: Types.ObjectId;
  selected_option: number;
  feedback: string | null;
}

export interface IQuizSubmission extends ISubmission {
  type: 'quiz';
  answers: IQuizAnswer[];
}

export interface IHomeworkSubmission extends ISubmission {
  type: 'homework';
  submitted_files: string[];
  feedback?: string;
}
