import { Schema, CallbackError, Types } from 'mongoose';

import {
  IAssignment,
  IQuizAssignment,
  IHomeworkAssignment,
  IQuizQuestion,
  AssignmentType,
} from '@/types/db/assignment';
import { Lecture } from '@/models';

export const AssignmentSchema = new Schema<IAssignment>(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    section_id: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    lecture_id: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true },
    type: { type: String, enum: Object.values(AssignmentType), required: true },
    tags: [String],
    max_score: { type: Number, default: 10 },
    due_date: { type: Date, default: new Date() },
    active_date: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
AssignmentSchema.index(
  { course_id: 1, section_id: 1, lecture_id: 1, type: 1 },
  { unique: true },
);

AssignmentSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('course_id')) {
    try {
      const lecture = await Lecture.findById(this.lecture_id);
      if (lecture) {
        this.tags = lecture.tags;
      }
    } catch (error) {
      return next(error as CallbackError);
    }
  }
  next();
});

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
  question: { type: String },
  options: { type: [String] },
  correct_answer: { type: Number },
  points: { type: Number, default: 1 },
});

export const QuizAssignmentSchema = new Schema<IQuizAssignment>({
  questions: [QuizQuestionSchema],
  type: {
    type: String,
    enum: Object.values(AssignmentType),
    default: AssignmentType.QUIZ,
    required: true,
  },
});

export const HomeworkAssignmentSchema = new Schema<IHomeworkAssignment>({
  instructions: { type: String, default: '' },
  files: [
    {
      file_url: String,
      file_key: String,
      file_name: String,
      file_mimetype: String,
    },
  ],
  type: {
    type: String,
    enum: Object.values(AssignmentType),
    default: AssignmentType.HOMEWORK,
    required: true,
  },
});
