import { headers } from 'next/headers';

import { APIResponse, APIErrorHandler } from '@/lib/api';
import { uploadFile, keyToUrl } from '@/lib/s3';

export async function POST(request: Request) {
  const headersList = headers();

  try {
    const contentType =
      headersList.get('content-type') || 'application/octet-stream';
    const fileName = headersList.get('X-File-Name') || 'unknown';
    const fileData = await request.arrayBuffer();
    const destFolder = headersList.get('X-Dest-Folder') || 'image-bin';

    const fileKey = await uploadFile({
      fileName,
      fileData,
      contentType,
      destFolder,
    });

    return APIResponse({
      data: {
        file_name: fileName,
        file_key: fileKey,
        file_url: keyToUrl(fileKey),
        file_mimetype: contentType,
      },
      message: 'File uploaded successfully',
      status: 201,
    });
  } catch (error: any) {
    return APIErrorHandler(error);
  }
}
