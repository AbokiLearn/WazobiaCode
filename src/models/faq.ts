import { Schema } from 'mongoose';

import { IFAQ } from '@/types/db/faq';

export const FAQSchema = new Schema<IFAQ>(
  {
    question: String,
    answer: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
