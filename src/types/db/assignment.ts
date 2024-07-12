import { Document, Types } from 'mongoose';
import { ILecture } from './course';

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  lecture_id: Types.ObjectId | ILecture;
  type: 'quiz' | 'homework';
  tags: string[];
  max_score: number;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IQuizAssignment extends IAssignment {
  type: 'quiz';
  questions: {
    question: string;
    options: string[];
    correct_answer: number;
    points: number;
  }[];
}

export interface IHomeworkAssignment extends IAssignment {
  type: 'homework';
  instructions: string;
  files: string[];
}
