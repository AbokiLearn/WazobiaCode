import { Document, Types } from 'mongoose';

import { IEnrollment } from './enrollment';

export interface IUserMetadata extends Document {
  sub: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  telegram_user_id: string | null;
  roles: string[];
  enrollments: Types.ObjectId[] | IEnrollment[];
  created_at: Date;
  updated_at: Date;
}
