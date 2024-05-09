import connectMongoDb from '../../../../lib/mongodb';
import Faq from '../../../../models/faq';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = params;
  const { newQuestion: question, newAnswer: answer } = await request.json();
  await connectMongoDb();
  const faq = await Faq.findByIdAndUpdate(id, { question, answer });

  return NextResponse.json({ message: 'FAQ updated' }, { status: 200 });
}
export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDb();
  const faq = await Faq.findOne({ _id: id });
  if (!faq) {
    return NextResponse.json({ message: 'FAQ not found' }, { status: 401 });
  }
  return NextResponse.json({ faq });
}
