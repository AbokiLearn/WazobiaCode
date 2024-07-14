import mongoose, { Schema } from 'mongoose';

const faqSchema = new Schema(
  {
    question: String,
    answer: String,
  },
  {
    timestamps: true,
  },
);

const Faq = mongoose.models.FAQS || mongoose.model('FAQS', faqSchema);

export default Faq;
