import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/app/video-player';
import CustomMDX from '@/components/app/custom-mdx';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/components/app/profile-menu';
import { getLecture } from '@/lib/api-client';

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

  const user = await getUser();
  const isLoggedIn = user !== null;

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
        <hr className="border-muted" />
      </div>
    );
  };

  const LectureContent = () => {
    return (
      <>
        {/* TODO: add a loading state */}
        <div className="flex flex-col mb-4">
          <Suspense fallback={<div>Loading...</div>}>
            <VideoPlayer url={lecture.video_url} title={lecture.title} />
          </Suspense>
        </div>
        <CustomMDX source={lecture.content} />
      </>
    );
  };

  return (
    <div className="p-6 lg:p-8 bg-background rounded-lg">
      <LectureHeader />
      <Tabs defaultValue="content">
        <div className="flex flex-row justify-center mb-4">
          <TabsList className={isLoggedIn ? '' : 'hidden'}>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="homework">Homework</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="content">
          <LectureContent />
        </TabsContent>
        <TabsContent value="quiz">Quiz</TabsContent>
        <TabsContent value="homework">Homework</TabsContent>
      </Tabs>
    </div>
  );
}
