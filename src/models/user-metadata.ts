import { Schema } from 'mongoose';

import { IUserMetadata } from '@/types/db/user-metadata';

export const UserMetadataSchema = new Schema<IUserMetadata>({
  sub: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  telegram_user_id: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    validate: {
      validator: async function (value: string) {
        if (value === null) return true;
        const count = await (this.constructor as any).countDocuments({
          telegram_user_id: value,
        });
        return count === 0;
      },
      message: 'Telegram user ID must be unique',
    },
  },
  roles: [{ type: String, required: true }],
  enrollments: [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],
});
