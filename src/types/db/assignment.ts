import { Document, Types } from 'mongoose';
import { ICourse, ISection, ILecture } from './course';

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  course_id: Types.ObjectId | ICourse;
  section_id: Types.ObjectId | ISection;
  lecture_id: Types.ObjectId | ILecture;
  type: 'quiz' | 'homework';
  tags: string[];
  max_score: number;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IQuizQuestion {
  _id: Types.ObjectId;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

export interface IQuizAssignment extends IAssignment {
  type: 'quiz';
  questions: IQuizQuestion[];
}

export interface IHomeworkAssignment extends IAssignment {
  type: 'homework';
  instructions: string;
  files: string[];
}
