import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import { AssignmentContents } from '@/components/app/courses/assignment-contents';
import { LectureTabList } from '@/components/app/courses/lecture-tab-list';
import { SubmitQuestion } from '@/components/app/courses/submit-question';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import VideoPlayer from '@/components/app/video-player';
import CustomMDX from '@/components/app/custom-mdx';
import { Badge } from '@/components/ui/badge';

import { getLecture } from '@/lib/client/course';

interface LecturePageProps {
  params: { courseSlug: string; sectionSlug: string; lectureSlug: string };
}

export async function generateMetadata({
  params,
}: LecturePageProps): Promise<Metadata> {
  const { courseSlug, sectionSlug, lectureSlug } = params;
  const lecture = await getLecture(courseSlug, sectionSlug, lectureSlug);
  return {
    title: lecture.title,
  };
}

export const dynamic = 'force-dynamic';

export default async function LecturePage({ params }: LecturePageProps) {
  const { courseSlug, sectionSlug, lectureSlug } = params;
  const lecture = await getLecture(courseSlug, sectionSlug, lectureSlug);

  const LectureHeader = () => {
    return (
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-bold">{lecture.title}</h1>
        <p className="text-lg text-muted-foreground mb-2">
          {lecture.description}
        </p>
        <div className="flex flex-row gap-2 mb-4">
          {lecture.tags.map((tag) => (
            <Link href={`/search?tag=${tag}`} key={tag}>
              <Badge className="bg-red-500/40 text-foreground italic hover:bg-red-500/60">
                #{tag}
              </Badge>
            </Link>
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
        <SubmitQuestion
          course_id={lecture.course_id}
          section_id={lecture.section_id}
          lecture_id={lecture._id}
        />
      </>
    );
  };

  return (
    <div className="p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <LectureHeader />
        <Tabs defaultValue="content">
          <div className="flex flex-row justify-center mb-4">
            <LectureTabList />
          </div>
          <TabsContent value="content">
            <LectureContent />
          </TabsContent>
          <AssignmentContents lecture={lecture} />
        </Tabs>
      </div>
    </div>
  );
}
