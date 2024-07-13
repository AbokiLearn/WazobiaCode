import { getEndpoint } from '@/lib/client';
import { File as FileType } from '@/types';

export const uploadFile = async (file: File, destFolder?: string) => {
  const fileName = file.name;
  const fileType = file.type;
  const response = await fetch(getEndpoint('/files/upload'), {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': fileType,
      'X-File-Name': fileName,
      'X-Dest-Folder': destFolder ?? 'file-bin',
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(`Upload failed (status: ${err.status}): ${err.message}`);
    });

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
};

export const uploadFiles = async (files: File[], destFolder?: string) => {
  const promises = files.map((file) => uploadFile(file, destFolder));
  return Promise.all(promises);
};

export const getDownloadUrl = async (file: FileType) => {
  const key = file.file_key;
  const filename = file.file_name;

  if (!key || !filename) {
    throw new Error('Invalid file URL');
  }

  const response = await fetch(
    getEndpoint(`/files/download?key=${key}&fileName=${filename}`),
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(
        `Download failed (status: ${err.status}): ${err.message}`,
      );
    });

  const { download_urls } = response.data;
  return download_urls[0];
};

export const getDownloadUrls = async (files: FileType[]) => {
  const keys = files.map((file) => file.file_key);
  const filenames = files.map((file) => file.file_name);

  if (!keys.every((key) => key) || !filenames.every((filename) => filename)) {
    throw new Error('Invalid file URL');
  }

  const response = await fetch(
    getEndpoint(
      `/files/download?key=${encodeURIComponent(
        keys.join(','),
      )}&fileName=${encodeURIComponent(filenames.join(','))}`,
    ),
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(
        `Download failed (status: ${err.status}): ${err.message}`,
      );
    });

  const { download_urls } = response;
  return download_urls;
};

export const archiveFiles = async (files: FileType[]) => {
  const keys = files.map((file) => file.file_key);
  const filenames = files.map((file) => file.file_name);

  if (!keys.every((key) => key) || !filenames.every((filename) => filename)) {
    throw new Error('Invalid file URL');
  }

  const response = await fetch(
    getEndpoint(
      `/files/zip?key=${encodeURIComponent(
        keys.join(','),
      )}&fileName=${encodeURIComponent(filenames.join(','))}`,
    ),
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(`Archive failed (status: ${err.status}): ${err.message}`);
    });

  return response.data.archive_url;
};
