'use client';

import { useState } from 'react';
import {
  FileCode2,
  FileImage,
  FileText,
  FolderArchive,
  File as FileIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { getDownloadUrl } from '@/lib/client/files';
import { File, FileType } from '@/types';
import { getFileType } from '@/lib/s3';

interface FileLinkProps {
  file: File;
}

const IconMap: { [key: string]: React.ElementType } = {
  [FileType.CODE]: FileCode2,
  [FileType.IMAGE]: FileImage,
  [FileType.PDF]: FileText,
  [FileType.ZIP]: FolderArchive,
  [FileType.OTHER]: FileIcon,
};

export const FileLink = ({ file }: FileLinkProps) => {
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const fileType = getFileType(file.file_mimetype);
  const Icon = IconMap[fileType];

  const handleClick = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!downloadURL) {
      try {
        const url = await getDownloadUrl(file);
        setDownloadURL(url);
        console.log(url);
        window.open(url, '_blank');
      } catch (error) {
        toast.error('Failed to download file');
      }
    } else {
      window.open(downloadURL, '_blank');
    }
  };

  return (
    <a href="#" onClick={handleClick}>
      <div className="flex items-center p-2 gap-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm active:border-accent">
        <Icon className="w-6 h-6 text-accent" />
        <p className="text-sm font-medium text-gray-700 truncate">
          {file.file_name}
        </p>
      </div>
    </a>
  );
};
