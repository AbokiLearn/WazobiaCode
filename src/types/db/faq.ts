import { Document, Types } from 'mongoose';

export interface IFAQ extends Document {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}
