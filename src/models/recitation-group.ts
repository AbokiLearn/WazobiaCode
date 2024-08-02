import { Schema } from 'mongoose';
import { IRecitationGroup } from '@/types/db/recitation-group';

export const RecitationGroupSchema = new Schema<IRecitationGroup>(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true },
    student_count: { type: Number, default: 0 },
    telegram_group_id: { type: String, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

RecitationGroupSchema.index({ course_id: 1, name: 1 }, { unique: true });
