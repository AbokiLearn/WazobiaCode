import connectMongoDB from '@/lib/mongodb';
import { FAQ } from '@/models/faq';

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const { newQuestion: question, newAnswer: answer } = await request.json();
  await connectMongoDB();
  const faq = await FAQ.findByIdAndUpdate(id, { question, answer });

  return Response.json({ message: 'FAQ updated', status: 200 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await connectMongoDB();
  const faq = await FAQ.findOne({ _id: id });

  if (!faq) {
    return Response.json({ message: 'FAQ not found', status: 401 });
  }
  return Response.json({ faq, status: 200 });
}
