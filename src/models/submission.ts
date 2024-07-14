import { Schema } from 'mongoose';

import {
  ISubmission,
  IQuizSubmission,
  IHomeworkSubmission,
} from '@/types/db/submission';

export const SubmissionSchema = new Schema<ISubmission>(
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
    score: { type: Number, default: null },
    submitted_at: { type: Date, default: Date.now },
    graded_at: { type: Date, default: null },
    graded_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: { createdAt: 'submitted_at', updatedAt: 'updated_at' } },
);

export const QuizSubmissionSchema = new Schema<IQuizSubmission>({
  answers: [
    {
      question_id: { type: Schema.Types.ObjectId, required: true },
      selected_option: { type: Number, required: true },
      feedback: { type: String, default: null },
    },
  ],
});

export const HomeworkSubmissionSchema = new Schema<IHomeworkSubmission>({
  comments: { type: String, default: null },
  submitted_files: [
    {
      file_url: String,
      file_key: String,
      file_name: String,
      file_mimetype: String,
    },
  ],
  feedback: { type: String, default: null },
});
