import { Schema } from 'mongoose';

import { IUserMetadata } from '@/types/db/user-metadata';

export const UserMetadataSchema = new Schema<IUserMetadata>({
  sub: { type: String, required: true, unique: true, index: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
});
