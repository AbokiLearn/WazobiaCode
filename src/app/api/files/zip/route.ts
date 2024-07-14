import { APIResponse, APIErrorHandler } from '@/lib/api';
import { archiveFiles } from '@/lib/s3';

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

    const archive_url = await archiveFiles(keys, fileNames);
    return APIResponse({
      data: { archive_url },
      status: 200,
      message: 'Files archived successfully',
    });
  } catch (error) {
    return APIErrorHandler(error);
  }
}
