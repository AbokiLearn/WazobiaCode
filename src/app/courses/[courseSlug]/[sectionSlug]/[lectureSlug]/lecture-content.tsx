'use client';

import { Suspense, useState, useCallback, ReactNode } from 'react';
import { Download } from 'lucide-react';

import { getDownloadUrl } from '@/lib/client/files';
import { Button } from '@/components/ui/button';

import { SubmitQuestion } from '@/components/app/courses/submit-question';

import VideoPlayer from '@/components/app/video-player';

import { ILecture } from '@/types/db/course';

export default function LectureContent({
  lecture,
  children,
}: {
  lecture: ILecture;
  children: ReactNode;
}) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);

  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
      return;
    }

    setIsGeneratingUrl(true);
    if (!lecture.video_download_url) {
      setIsGeneratingUrl(false);
      return;
    }

    getDownloadUrl(lecture.video_download_url)
      .then((url) => {
        setDownloadUrl(url);
        window.open(url, '_blank');
      })
      .catch((error) => {
        console.error('Error generating download URL:', error);
      })
      .finally(() => {
        setIsGeneratingUrl(false);
      });
  }, [downloadUrl, lecture.video_download_url]);

  return (
    <>
      <div className="flex flex-col mb-4 items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPlayer url={lecture.video_url} title={lecture.title} />
        </Suspense>
        {lecture.video_download_url && lecture.video_download_url.file_url && (
          <Button
            onClick={handleDownload}
            disabled={isGeneratingUrl}
            className="mt-2 w-1/4"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingUrl ? 'Generating URL...' : 'Download Video'}
          </Button>
        )}
      </div>
      {children}
      <SubmitQuestion
        course_id={lecture.course_id}
        section_id={lecture.section_id}
        lecture_id={lecture._id}
      />
    </>
  );
}
