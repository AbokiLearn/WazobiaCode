import { Schema, model, models, Model } from 'mongoose';
import {
  ISubmission,
  IQuizSubmission,
  IHomeworkSubmission,
} from '@/types/db/submission';

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignment_id: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    section_id: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    lecture_id: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true },
    type: { type: String, enum: ['quiz', 'homework'], required: true },
    score: { type: Number, required: true },
    submitted_at: { type: Date, default: Date.now },
    graded_at: Date,
    graded_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'submitted_at' } },
);

const QuizSubmissionSchema = new Schema<IQuizSubmission>({
  answers: [
    {
      question_id: { type: Schema.Types.ObjectId, required: true, auto: true },
      selected_option: { type: Number, required: true },
      feedback: String,
    },
  ],
});

const HomeworkSubmissionSchema = new Schema<IHomeworkSubmission>({
  submitted_files: [String],
  feedback: String,
});

export const Submission: Model<ISubmission> =
  models.Submission || model('Submission', SubmissionSchema);
export const QuizSubmission: Model<IQuizSubmission> =
  models.QuizSubmission ||
  Submission.discriminator('QuizSubmission', QuizSubmissionSchema);
export const HomeworkSubmission: Model<IHomeworkSubmission> =
  models.HomeworkSubmission ||
  Submission.discriminator('HomeworkSubmission', HomeworkSubmissionSchema);
