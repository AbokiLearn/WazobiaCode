import { APIResponse, APIErrorHandler } from '@/lib/api';
import { createPresignedUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get('key')?.split(',');
    const fileNames = searchParams.get('fileName')?.split(',');

    if (!keys || !fileNames || keys.length !== fileNames.length) {
      return APIResponse({
        error: 'Invalid or mismatched keys and fileNames provided',
        status: 400,
      });
    }

    const presignedUrls = await Promise.all(
      keys.map((key, index) => createPresignedUrl(key, fileNames[index])),
    );

    return APIResponse({
      data: { download_urls: presignedUrls },
      message: 'File download URLs created',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
