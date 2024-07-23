import { Document } from 'mongoose';

export interface IUserMetadata extends Document {
  sub: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}
