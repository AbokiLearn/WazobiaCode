import { getSession } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import { AssignmentContents } from '@/components/app/courses/assignment-contents';
import { LectureTabList } from '@/components/app/courses/lecture-tab-list';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CustomMDX from '@/components/app/custom-mdx';

import LectureContent from './lecture-content';

import { getLecture } from '@/lib/client/course';
import { checkUserRole } from '@/lib/auth';
import { UserRole } from '@/types/auth';

interface LecturePageProps {
  params: { courseSlug: string; sectionSlug: string; lectureSlug: string };
}

export async function generateMetadata({
  params,
}: LecturePageProps): Promise<Metadata> {
  const { courseSlug, sectionSlug, lectureSlug } = params;

  try {
    const lecture = await getLecture(courseSlug, sectionSlug, lectureSlug);
    return {
      title: lecture.title,
    };
  } catch (error) {
    return {
      title: 'Lecture not found',
    };
  }
}

export const dynamic = 'force-dynamic';

export default async function LecturePage({
  params,
  searchParams,
}: LecturePageProps & {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { courseSlug, sectionSlug, lectureSlug } = params;

  let selectedTab = searchParams.tab || 'content';
  if (selectedTab !== 'homework' && selectedTab !== 'content') {
    selectedTab = 'content';
  }

  const session = await getSession();
  const isInstructor = await checkUserRole(session, UserRole.INSTRUCTOR);

  const lecture = await getLecture(courseSlug, sectionSlug, lectureSlug);

  if (!lecture.active && !isInstructor) {
    notFound();
  }

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

  return (
    <div className="p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <LectureHeader />
        <Tabs defaultValue={selectedTab}>
          <div className="flex flex-row justify-center mb-4">
            <LectureTabList lecture={lecture} />
          </div>
          <TabsContent value="content">
            <LectureContent lecture={lecture}>
              <CustomMDX source={lecture.content} />
            </LectureContent>
          </TabsContent>
          <AssignmentContents lecture={lecture} />
        </Tabs>
      </div>
    </div>
  );
}
