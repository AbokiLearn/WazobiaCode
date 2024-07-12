import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { FAQ } from '@/models/faq';

export async function GET() {
  try {
    await connectMongoDB();
    const faqs = await FAQ.find();
    return APIResponse({
      data: { faqs },
      message: 'FAQs fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json();
    await connectMongoDB();
    await FAQ.create({ question, answer });
    return APIResponse({
      message: 'FAQ Created',
      status: 201,
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    await FAQ.findByIdAndDelete(id);
    return APIResponse({
      message: 'FAQ Deleted',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
