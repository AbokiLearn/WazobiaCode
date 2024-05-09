import connectMongoDb from '../../../lib/mongodb';
import Faq from '../../../models/faq';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { question, answer } = await request.json();
  await connectMongoDb();
  await Faq.create({ question, answer });
  return NextResponse.json({ message: 'FAQ Created' }, { status: 201 });
}

export async function GET() {
  await connectMongoDb();
  const faqs = await Faq.find();
  return NextResponse.json({ faqs });
}

export async function DELETE(request) {
  await connectMongoDb();
  const id = request.nextUrl.searchParams.get('id');
  await Faq.findByIdAndDelete(id);
  return NextResponse.json({ message: 'FAQ Deleted' }, { status: 200 });
}
