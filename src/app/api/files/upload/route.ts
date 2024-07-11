import { headers } from 'next/headers';
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

    return Response.json({ fileUrl }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: 'Error uploading file', details: error },
      { status: 500 },
    );
  }
}
