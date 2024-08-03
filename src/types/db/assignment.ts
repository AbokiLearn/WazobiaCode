import { Document, Types } from 'mongoose';
import { ICourse, ISection, ILecture } from './course';
import { File } from '@/types';

export enum AssignmentType {
  QUIZ = 'quiz',
  HOMEWORK = 'homework',
}

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  course_id: Types.ObjectId | ICourse;
  section_id: Types.ObjectId | ISection;
  lecture_id: Types.ObjectId | ILecture;
  type: AssignmentType;
  tags: string[];
  max_score: number;
  due_date: Date;
  active_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IQuizQuestion {
  _id?: Types.ObjectId;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

export interface IQuizAssignment extends IAssignment {
  type: AssignmentType.QUIZ;
  questions: IQuizQuestion[];
}

export interface IHomeworkAssignment extends IAssignment {
  type: AssignmentType.HOMEWORK;
  instructions: string;
  files: File[];
}
