import { getSession } from '@auth0/nextjs-auth0';
import { Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitQuestion } from '@/components/app/submit-question';
import { Quiz } from '@/components/app/quiz-content';
import { Homework } from '@/components/app/homework-content';
import VideoPlayer from '@/components/app/video-player';
import CustomMDX from '@/components/app/custom-mdx';
import { Badge } from '@/components/ui/badge';
import { getLecture } from '@/lib/client/course';
import { IQuizAssignment } from '@/types/db/assignment';
import { IHomeworkAssignment } from '@/types/db/assignment';

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

  const session = await getSession();
  const user = session?.user;

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
        {user && (
          <>
            <hr className="border-muted mt-4" />
            <SubmitQuestion
              course_id={lecture.course_id}
              section_id={lecture.section_id}
              lecture_id={lecture._id}
              student_id={user.id}
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <LectureHeader />
        <Tabs defaultValue="content">
          <div className="flex flex-row justify-center mb-4">
            <TabsList className={user ? '' : 'hidden'}>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="homework">Homework</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="content">
            <LectureContent />
          </TabsContent>
          {user && (
            <>
              <TabsContent value="quiz">
                <Quiz
                  quiz_id={lecture.quiz._id}
                  course_id={lecture.course_id}
                  section_id={lecture.section_id}
                  lecture_id={lecture._id}
                  questions={(lecture.quiz as IQuizAssignment).questions}
                  user_id={user.id}
                />
              </TabsContent>
              <TabsContent value="homework">
                <Homework
                  assignment_id={lecture.homework._id}
                  course_id={lecture.course_id}
                  section_id={lecture.section_id}
                  lecture_id={lecture._id}
                  student_id={user.id}
                  homework={lecture.homework as IHomeworkAssignment}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
