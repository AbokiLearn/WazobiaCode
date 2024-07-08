import connectMongoDB from '@/lib/mongodb';
import { FAQ } from '@/models/faq';

export async function POST(request: Request) {
  const { question, answer } = await request.json();
  await connectMongoDB();
  await FAQ.create({ question, answer });
  return Response.json({ message: 'FAQ Created', status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const faqs = await FAQ.find();
  return Response.json({ faqs, status: 200 });
}

export async function DELETE(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  await FAQ.findByIdAndDelete(id);
  return Response.json({ message: 'FAQ Deleted', status: 200 });
}
