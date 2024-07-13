import { headers } from 'next/headers';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import { uploadFile } from '@/lib/s3';

export async function POST(request: Request) {
  const headersList = headers();

  try {
    const contentType =
      headersList.get('content-type') || 'application/octet-stream';
    const fileName = headersList.get('x-file-name') || 'unknown';
    const fileData = await request.arrayBuffer();
    const destFolder = headersList.get('x-s3-folder') || 'image-bin';

    const fileUrl = await uploadFile({
      fileName,
      fileData,
      contentType,
      destFolder,
    });

    return APIResponse({
      data: { file_name: fileName, file_url: fileUrl },
      message: 'File uploaded successfully',
      status: 201,
    });
  } catch (error: any) {
    return APIErrorHandler(error);
  }
}
