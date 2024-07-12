import { Schema, model, models, Model, CallbackError } from 'mongoose';
import {
  IAssignment,
  IQuizAssignment,
  IHomeworkAssignment,
} from '@/types/db/assignment';
import { Lecture } from './course';

const AssignmentSchema = new Schema<IAssignment>(
  {
    lecture_id: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true },
    type: { type: String, enum: ['quiz', 'homework'], required: true },
    tags: [String],
    max_score: { type: Number, required: true },
    due_date: { type: Date, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
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

const QuizAssignmentSchema = new Schema<IQuizAssignment>({
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correct_answer: { type: Number, required: true },
      points: { type: Number, default: 1 },
    },
  ],
});

const HomeworkAssignmentSchema = new Schema<IHomeworkAssignment>({
  instructions: { type: String, required: true },
  files: [String],
});

export const Assignment: Model<IAssignment> =
  models.Assignment || model('Assignment', AssignmentSchema);
export const QuizAssignment: Model<IQuizAssignment> =
  models.QuizAssignment ||
  Assignment.discriminator('QuizAssignment', QuizAssignmentSchema);
export const HomeworkAssignment: Model<IHomeworkAssignment> =
  models.HomeworkAssignment ||
  Assignment.discriminator('HomeworkAssignment', HomeworkAssignmentSchema);
