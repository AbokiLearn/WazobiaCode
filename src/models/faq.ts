import { Schema, model, models, Model } from 'mongoose';
import { IFAQ } from '@/types/db/faq';

const FAQSchema = new Schema<IFAQ>(
  {
    question: String,
    answer: String,
  },
  { timestamps: true },
);

export const FAQ: Model<IFAQ> = models.FAQ || model('FAQ', FAQSchema);
