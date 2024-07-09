import { Suspense } from 'react';
import VideoPlayer from '@/components/app/video-player';
import CustomMDX from '@/components/app/custom-mdx';
import { Badge } from '@/components/ui/badge';
import { getLecture } from '@/lib/api';
import { ILecture } from '@/types/db/course';

export default async function Page({
  params,
}: {
  params: {
    courseSlug: string;
    sectionSlug: string;
    lectureSlug: string;
  };
}) {
  const { courseSlug, sectionSlug, lectureSlug } = params;
  const lecture = await getLecture(courseSlug, sectionSlug, lectureSlug);

  return <Lecture lecture={lecture} />;
}

const Lecture = ({ lecture }: { lecture: ILecture }) => {
  const LectureHeader = () => {
    return (
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold">{lecture.title}</h1>
        <p className="text-lg text-muted-foreground mb-2">
          {lecture.description}
        </p>
        <div className="flex flex-row gap-2 mb-4">
          {lecture.tags.map((tag) => (
            // TODO: tags should link to a search page
            <Badge key={tag} className="bg-secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <hr className="border-muted mb-4" />
        {/* TODO: add a loading state */}
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPlayer url={lecture.video_url} title={lecture.title} />
        </Suspense>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 bg-background rounded-lg">
      <LectureHeader />
      <CustomMDX source={lecture.content} />
    </div>
  );
};
