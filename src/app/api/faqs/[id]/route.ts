import { APIResponse, APIErrorHandler } from '@/lib/api';
import connectMongoDB from '@/lib/db/connect';
import { FAQ } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    await connectMongoDB();
    const faq = await FAQ.findOne({ _id: id });

    if (!faq) {
      return APIResponse({
        message: 'FAQ not found',
        status: 401,
      });
    }
    return APIResponse({
      data: { faq },
      message: 'FAQ fetched',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    const { newQuestion: question, newAnswer: answer } = await request.json();
    await connectMongoDB();
    await FAQ.findByIdAndUpdate(id, { question, answer });

    return APIResponse({
      message: 'FAQ updated',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
