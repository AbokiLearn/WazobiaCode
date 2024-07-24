import { Schema } from 'mongoose';
import { IEnrollment, EnrollmentStatus } from '@/types/db/enrollment';

export const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student_id: { type: String, required: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    recitation_group_id: {
      type: Schema.Types.ObjectId,
      ref: 'RecitationGroup',
    },
    status: {
      type: String,
      enum: EnrollmentStatus,
      default: EnrollmentStatus.Active,
    },
    enrollment_date: { type: Date, default: Date.now },
    completion_date: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

EnrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });
