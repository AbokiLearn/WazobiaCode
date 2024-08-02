import { Schema } from 'mongoose';

import { IUserMetadata } from '@/types/db/user-metadata';

export const UserMetadataSchema = new Schema<IUserMetadata>(
  {
    sub: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    telegram_user_id: {
      type: String,
      required: false,
      default: null,
    },
    roles: [{ type: String, required: true }],
    enrollments: [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
UserMetadataSchema.index(
  { telegram_user_id: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { telegram_user_id: { $type: 'string' } },
  },
);
