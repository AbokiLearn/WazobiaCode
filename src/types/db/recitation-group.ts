import { Document, Types } from 'mongoose';

export interface IRecitationGroup extends Document {
  _id: Types.ObjectId;
  course_id: Types.ObjectId;
  name: string;
  student_count: number;
  telegram_group_id: string | null;
}
