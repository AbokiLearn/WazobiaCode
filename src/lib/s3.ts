import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/lib/config';
import { FileType } from '@/types';

const AWS_REGION = env.AWS_REGION;
const FILE_UPLOAD_BUCKET = env.AWS_S3_BUCKET_NAME;

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getFileType = (contentType: string) => {
  let fileType: FileType;

  switch (true) {
    case /^text\/.*$/.test(contentType):
      fileType = FileType.CODE;
      break;
    case /^image\/.*$/.test(contentType):
      fileType = FileType.IMAGE;
      break;
    case /^application\/pdf$/.test(contentType):
      fileType = FileType.PDF;
      break;
    case /^application\/zip$/.test(contentType):
      fileType = FileType.ZIP;
      break;
    default:
      fileType = FileType.OTHER;
  }

  return fileType;
};

export const uploadFile = async ({
  fileName,
  fileData,
  contentType,
  destFolder,
}: {
  fileName: string;
  fileData: ArrayBuffer;
  contentType: string;
  destFolder: string;
}) => {
  const fileId = uuidv4();
  const fileExtension = fileName.split('.').pop();
  const s3Key = `${destFolder}/${fileId}${
    fileExtension ? `.${fileExtension}` : ''
  }`;

  const params = {
    Bucket: FILE_UPLOAD_BUCKET,
    Key: s3Key,
    Body: Buffer.from(fileData),
    ContentType: contentType,
    Metadata: {
      'original-filename': fileName,
      'file-type': contentType,
    },
  };

  await s3Client.send(new PutObjectCommand(params));

  const fileUrl = `https://${FILE_UPLOAD_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;

  return fileUrl;
};
