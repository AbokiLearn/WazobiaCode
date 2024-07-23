import { Document, Types } from 'mongoose';

export enum EnrollmentStatus {
  Active = 'active',
  Completed = 'completed',
  Dropped = 'dropped',
}

export interface IEnrollment extends Document {
  student_id: string;
  course_id: Types.ObjectId;
  status: EnrollmentStatus;
  enrollment_date: Date;
  completion_date?: Date;
}
