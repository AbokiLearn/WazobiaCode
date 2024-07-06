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

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);

export default FAQ;
