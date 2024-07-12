import { Schema, model, models, Model } from 'mongoose';
import { IStudentQuestion } from '@/types/db/student-question';

const QuestionSchema = new Schema<IStudentQuestion>(
  {
    student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    section_id: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    lecture_id: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true },
    question: { type: String, required: true },
    response: { type: String, default: '' },
    response_files: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

export const StudentQuestion: Model<IStudentQuestion> =
  models.StudentQuestion || model('StudentQuestion', QuestionSchema);
