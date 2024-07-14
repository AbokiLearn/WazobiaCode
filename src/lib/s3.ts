import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import JSZip from 'jszip';

import { env } from '@/lib/config';
import { FileType } from '@/types';

const MY_AWS_REGION = env.MY_AWS_REGION;
const FILE_UPLOAD_BUCKET = env.MY_AWS_S3_BUCKET_NAME;

export const keyToUrl = (key: string) => {
  return `https://${FILE_UPLOAD_BUCKET}.s3.${MY_AWS_REGION}.amazonaws.com/${key}`;
};

export const urlToKey = (url: string) => {
  return url.split('/').pop();
};

export const s3Client = new S3Client({
  region: MY_AWS_REGION,
  credentials: {
    accessKeyId: env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: env.MY_AWS_SECRET_ACCESS_KEY,
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

export const createPresignedUrl = async (key: string, fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: FILE_UPLOAD_BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodeURIComponent(
      fileName,
    )}"`,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return signedUrl;
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
      'file-size': fileData.byteLength.toString(),
      'upload-timestamp': new Date().toISOString(),
    },
  };

  await s3Client.send(new PutObjectCommand(params));

  return s3Key;
};

export const archiveFiles = async (keys: string[], fileNames: string[]) => {
  const zip = new JSZip();

  for (let i = 0; i < keys.length; i++) {
    const file_key = keys[i];
    const file_name = fileNames[i];

    if (!file_key || !file_name) {
      throw new Error('Invalid file key or file name');
    }

    const command = new GetObjectCommand({
      Bucket: FILE_UPLOAD_BUCKET,
      Key: file_key,
    });
    const response = await s3Client.send(command);
    const fileContent = await response.Body?.transformToByteArray();

    if (fileContent) {
      zip.file(file_name, fileContent);
    }
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const zipKey = `temp-zips/${Date.now().toString()}.zip`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: FILE_UPLOAD_BUCKET,
      Key: zipKey,
      Body: zipBuffer,
      ContentType: 'application/zip',
    }),
  );

  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: FILE_UPLOAD_BUCKET,
      Key: zipKey,
      ResponseContentDisposition: 'attachment; filename="download.zip"',
    }),
    { expiresIn: 300 },
  );

  return signedUrl;
};
