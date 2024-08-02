import { Document, Types } from 'mongoose';

import { IRecitationGroup } from './recitation-group';

export enum EnrollmentStatus {
  Active = 'active',
  Completed = 'completed',
  Dropped = 'dropped',
}

export interface IEnrollment extends Document {
  student_id: string;
  course_id: Types.ObjectId;
  recitation_group_id: Types.ObjectId | IRecitationGroup | null;
  status: EnrollmentStatus;
  enrollment_date: Date;
  completion_date?: Date;
}
